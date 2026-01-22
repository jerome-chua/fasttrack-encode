'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { TelegramLogin, TelegramUser } from '@/components/TelegramLogin'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async (telegramUser: TelegramUser) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telegramUser),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      // Store session token in localStorage
      localStorage.setItem('session_token', data.token)
      localStorage.setItem('session_expires', data.expiresAt)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-fasttrack-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <a href="/" className="text-2xl font-bold text-fasttrack-ocean">
          FastTrack
        </a>
      </nav>

      {/* Login Content */}
      <div className="flex min-h-[calc(100vh-88px)] flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h1 className="mb-2 text-center text-2xl font-bold text-fasttrack-ocean">
              Welcome Back
            </h1>
            <p className="mb-8 text-center text-fasttrack-ocean/70">
              Sign in with your Telegram account to access your dashboard
            </p>

            {/* Telegram Login Button */}
            <div className="flex flex-col items-center gap-4">
              {isLoading ? (
                <div className="flex items-center gap-3 text-fasttrack-ocean/70">
                  <svg
                    className="h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Signing in...</span>
                </div>
              ) : (
                <TelegramLogin
                  botName={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || 'FastTrackOcBot'}
                  onAuth={handleAuth}
                  buttonSize="large"
                  cornerRadius={8}
                />
              )}

              {error && (
                <p className="mt-2 text-center text-sm text-red-500">{error}</p>
              )}
            </div>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-fasttrack-ocean/10" />
              <span className="text-sm text-fasttrack-ocean/50">or</span>
              <div className="h-px flex-1 bg-fasttrack-ocean/10" />
            </div>

            {/* Alternative CTA */}
            <div className="text-center">
              <p className="mb-4 text-sm text-fasttrack-ocean/70">
                New to FastTrack? Start your journey on Telegram
              </p>
              <a
                href="https://t.me/FastTrackOcBot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-fasttrack-ocean/20 px-6 py-3 font-medium text-fasttrack-ocean transition-colors hover:bg-fasttrack-mist"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Open Telegram Bot
              </a>
            </div>
          </div>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-fasttrack-ocean/50">
            <a href="/" className="hover:text-fasttrack-ocean">
              Back to Home
            </a>
            <span className="mx-2">·</span>
            <a href="/about" className="hover:text-fasttrack-ocean">
              About
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
