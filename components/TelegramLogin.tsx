'use client'

import { useEffect, useRef } from 'react'

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

interface TelegramLoginProps {
  botName: string
  onAuth: (user: TelegramUser) => void
  buttonSize?: 'large' | 'medium' | 'small'
  cornerRadius?: number
  showUserPhoto?: boolean
}

export function TelegramLogin({
  botName,
  onAuth,
  buttonSize = 'large',
  cornerRadius,
  showUserPhoto = true,
}: TelegramLoginProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Make callback available globally for Telegram widget
    (window as any).onTelegramAuth = (user: TelegramUser) => {
      onAuth(user)
    }

    // Load Telegram widget script
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', botName)
    script.setAttribute('data-size', buttonSize)
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')

    if (cornerRadius !== undefined) {
      script.setAttribute('data-radius', cornerRadius.toString())
    }

    if (!showUserPhoto) {
      script.setAttribute('data-userpic', 'false')
    }

    script.async = true

    containerRef.current?.appendChild(script)

    return () => {
      delete (window as any).onTelegramAuth
    }
  }, [botName, onAuth, buttonSize, cornerRadius, showUserPhoto])

  return <div ref={containerRef} />
}
