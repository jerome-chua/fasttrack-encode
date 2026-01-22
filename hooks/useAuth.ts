'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface AuthUser {
  telegram_id: number
  first_name: string
  current_weight: number | null
  goal_weight: number | null
  height: number | null
  onboarding_step: string
  username?: string
  photo_url?: string
}

interface UseAuthOptions {
  required?: boolean
  redirectTo?: string
}

export function useAuth(options: UseAuthOptions = {}) {
  const { required = true, redirectTo = '/login' } = options
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('session_token')
      const expires = localStorage.getItem('session_expires')
      const cachedUser = localStorage.getItem('user')

      // Check if token exists and isn't expired
      if (!token || (expires && new Date(expires) < new Date())) {
        localStorage.removeItem('session_token')
        localStorage.removeItem('session_expires')
        localStorage.removeItem('user')

        if (required) {
          router.push(redirectTo)
        }
        setIsLoading(false)
        return
      }

      // Use cached user data for initial render
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser))
        } catch {
          // Ignore parse errors
        }
      }

      // Verify session with server
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          localStorage.removeItem('session_token')
          localStorage.removeItem('session_expires')
          localStorage.removeItem('user')

          if (required) {
            router.push(redirectTo)
          }
          setUser(null)
        } else {
          const data = await res.json()
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        if (required) {
          router.push(redirectTo)
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [required, redirectTo, router])

  const logout = async () => {
    const token = localStorage.getItem('session_token')

    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    localStorage.removeItem('session_token')
    localStorage.removeItem('session_expires')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/login')
  }

  return { user, isLoading, logout }
}
