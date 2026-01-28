'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import QRCode from 'react-qr-code'

type LoginState = 'loading' | 'code' | 'waiting' | 'success' | 'expired' | 'error'

export default function LoginPage() {
  const router = useRouter()
  const [state, setState] = useState<LoginState>('loading')
  const [code, setCode] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<Date | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate a new login code
  const generateCode = useCallback(async () => {
    setState('loading')
    setError(null)

    try {
      const res = await fetch('/api/auth/code/generate', {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate code')
      }

      setCode(data.code)
      setExpiresAt(new Date(data.expiresAt))
      setState('code')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate code')
      setState('error')
    }
  }, [])

  // Generate code on mount
  useEffect(() => {
    generateCode()
  }, [generateCode])

  // Update countdown timer
  useEffect(() => {
    if (!expiresAt) return

    const updateTimer = () => {
      const now = new Date()
      const diff = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000))
      setTimeLeft(diff)

      if (diff === 0) {
        setState('expired')
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [expiresAt])

  // Poll for verification status
  useEffect(() => {
    if (state !== 'code' && state !== 'waiting') return
    if (!code) return

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/auth/code/status?code=${code}`)
        const data = await res.json()

        if (data.status === 'verified') {
          // Store session
          localStorage.setItem('session_token', data.token)
          localStorage.setItem('session_expires', data.expiresAt)
          localStorage.setItem('user', JSON.stringify(data.user))

          setState('success')

          // Redirect after brief delay
          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
        } else if (data.status === 'expired') {
          setState('expired')
        }
      } catch (err) {
        console.error('Status check error:', err)
      }
    }

    const interval = setInterval(checkStatus, 2000) // Poll every 2 seconds

    return () => clearInterval(interval)
  }, [code, state, router])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
            <h1 className="mb-6 text-center text-2xl font-bold text-fasttrack-ocean">
              Login to FastTrack
            </h1>
            <div className="mb-8 space-y-2 text-center">
              <p className="text-sm text-fasttrack-ocean/70">
                <span className="font-semibold text-fasttrack-ocean">Step 1:</span> Open the FastTrack bot on Telegram
              </p>
              <p className="text-sm text-fasttrack-ocean/70">
                <span className="font-semibold text-fasttrack-ocean">Step 2:</span> Send the code below to the bot
              </p>
              <p className="text-sm text-fasttrack-ocean/70">
                <span className="font-semibold text-fasttrack-ocean">Step 3:</span> You&apos;ll be logged in automatically
              </p>
            </div>

            {/* Loading State */}
            {state === 'loading' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <svg
                  className="h-8 w-8 animate-spin text-fasttrack-azure"
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
                <p className="text-fasttrack-ocean/70">Generating code...</p>
              </div>
            )}

            {/* Code Display */}
            {(state === 'code' || state === 'waiting') && code && (
              <div className="flex flex-col items-center gap-6">
                {/* QR Code */}
                <div className="rounded-xl bg-white p-4 shadow-sm border border-fasttrack-mist">
                  <QRCode
                    value={`https://t.me/FastTrackOcBot?start=${code}`}
                    size={180}
                    level="M"
                    fgColor="#1e3a5f"
                  />
                </div>
                <p className="text-sm text-fasttrack-ocean/70">
                  Scan with your phone camera to open Telegram
                </p>

                {/* Divider */}
                <div className="flex w-full items-center gap-4">
                  <div className="h-px flex-1 bg-fasttrack-ocean/20" />
                  <span className="text-sm text-fasttrack-ocean/50">or copy code</span>
                  <div className="h-px flex-1 bg-fasttrack-ocean/20" />
                </div>

                {/* Code Box */}
                <div className="relative w-full rounded-xl bg-fasttrack-mist p-6 text-center">
                  <button
                    onClick={copyCode}
                    className="absolute right-3 top-3 rounded-lg p-2 text-fasttrack-ocean/50 transition-colors hover:bg-fasttrack-ocean/10 hover:text-fasttrack-ocean"
                    aria-label="Copy code"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                  <p className="mb-2 text-sm font-medium uppercase tracking-wider text-fasttrack-ocean/50">
                    Your Login Code
                  </p>
                  <p className="font-mono text-4xl font-bold tracking-[0.3em] text-fasttrack-ocean">
                    {code}
                  </p>
                  <p className="mt-3 text-sm text-fasttrack-ocean/50">
                    {copied ? 'Copied!' : `Expires in ${formatTime(timeLeft)}`}
                  </p>
                </div>

                {/* Open Telegram Button */}
                <a
                  href={`https://t.me/FastTrackOcBot?start=${code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-fasttrack-ocean px-6 py-3 font-medium text-white transition-colors hover:bg-fasttrack-azure"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Open FastTrack Bot
                </a>

                {/* Waiting indicator */}
                <div className="flex items-center gap-2 text-sm text-fasttrack-ocean/50">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-fasttrack-azure" />
                  Waiting for verification...
                </div>
              </div>
            )}

            {/* Success State */}
            {state === 'success' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-fasttrack-ocean">
                  Login successful!
                </p>
                <p className="text-sm text-fasttrack-ocean/70">
                  Redirecting to dashboard...
                </p>
              </div>
            )}

            {/* Expired State */}
            {state === 'expired' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <svg
                    className="h-8 w-8 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-fasttrack-ocean">
                  Code expired
                </p>
                <button
                  onClick={generateCode}
                  className="mt-2 rounded-lg bg-fasttrack-ocean px-6 py-3 font-medium text-white transition-colors hover:bg-fasttrack-azure"
                >
                  Generate New Code
                </button>
              </div>
            )}

            {/* Error State */}
            {state === 'error' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-fasttrack-ocean">
                  Something went wrong
                </p>
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                <button
                  onClick={generateCode}
                  className="mt-2 rounded-lg bg-fasttrack-ocean px-6 py-3 font-medium text-white transition-colors hover:bg-fasttrack-azure"
                >
                  Try Again
                </button>
              </div>
            )}
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
