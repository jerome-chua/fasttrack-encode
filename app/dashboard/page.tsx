'use client'

import { useAuth } from '@/hooks/useAuth'
import WeightChart from '@/components/WeightChart'

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-fasttrack-white">
        <div className="flex items-center gap-3 text-fasttrack-ocean/70">
          <svg
            className="h-6 w-6 animate-spin"
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
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useAuth
  }

  const weightToLose =
    user.current_weight && user.goal_weight
      ? (user.current_weight - user.goal_weight).toFixed(1)
      : null

  return (
    <div className="min-h-screen bg-fasttrack-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-fasttrack-ocean/10 px-8 py-4">
        <a href="/" className="text-2xl font-bold text-fasttrack-ocean">
          FastTrack
        </a>
        <div className="flex items-center gap-6">
          <span className="text-fasttrack-ocean/70">
            Hi, {user.first_name}
          </span>
          <button
            onClick={logout}
            className="rounded-lg border border-fasttrack-ocean/20 px-4 py-2 text-sm font-medium text-fasttrack-ocean transition-colors hover:bg-fasttrack-mist"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fasttrack-ocean">
            Welcome back, {user.first_name}
          </h1>
          <p className="mt-2 text-fasttrack-ocean/70">
            Track your progress and stay on top of your health journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {/* Current Weight */}
          <div className="rounded-2xl bg-fasttrack-mist p-6">
            <p className="text-sm font-medium uppercase tracking-wider text-fasttrack-ocean/50">
              Current Weight
            </p>
            <p className="mt-2 text-3xl font-bold text-fasttrack-ocean">
              {user.current_weight ? `${user.current_weight} kg` : '-- kg'}
            </p>
          </div>

          {/* Goal Weight */}
          <div className="rounded-2xl bg-fasttrack-mist p-6">
            <p className="text-sm font-medium uppercase tracking-wider text-fasttrack-ocean/50">
              Goal Weight
            </p>
            <p className="mt-2 text-3xl font-bold text-fasttrack-ocean">
              {user.goal_weight ? `${user.goal_weight} kg` : '-- kg'}
            </p>
          </div>

          {/* To Lose */}
          <div className="rounded-2xl bg-gradient-to-br from-fasttrack-azure to-fasttrack-ocean p-6">
            <p className="text-sm font-medium uppercase tracking-wider text-white/70">
              To Lose
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {weightToLose ? `${weightToLose} kg` : '-- kg'}
            </p>
          </div>
        </div>

        {/* Weight Chart Section */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-fasttrack-ocean">
            Weight Progress
          </h2>
          <WeightChart />
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-fasttrack-ocean">
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <a
              href="https://t.me/FastTrackOcBot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-fasttrack-ocean/10 bg-white p-4 transition-colors hover:border-fasttrack-azure hover:bg-fasttrack-mist"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fasttrack-azure/20">
                <span className="text-lg">📸</span>
              </div>
              <div>
                <p className="font-medium text-fasttrack-ocean">Log Food</p>
                <p className="text-sm text-fasttrack-ocean/50">
                  Open Telegram bot
                </p>
              </div>
            </a>

            <a
              href="https://t.me/FastTrackOcBot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-fasttrack-ocean/10 bg-white p-4 transition-colors hover:border-fasttrack-azure hover:bg-fasttrack-mist"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fasttrack-azure/20">
                <span className="text-lg">⏰</span>
              </div>
              <div>
                <p className="font-medium text-fasttrack-ocean">Track Fast</p>
                <p className="text-sm text-fasttrack-ocean/50">
                  Start/end fasting
                </p>
              </div>
            </a>

            <a
              href="https://t.me/FastTrackOcBot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-fasttrack-ocean/10 bg-white p-4 transition-colors hover:border-fasttrack-azure hover:bg-fasttrack-mist"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fasttrack-azure/20">
                <span className="text-lg">⚖️</span>
              </div>
              <div>
                <p className="font-medium text-fasttrack-ocean">Log Weight</p>
                <p className="text-sm text-fasttrack-ocean/50">
                  Update your weight
                </p>
              </div>
            </a>

            <a
              href="https://t.me/FastTrackOcBot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-fasttrack-ocean/10 bg-white p-4 transition-colors hover:border-fasttrack-azure hover:bg-fasttrack-mist"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fasttrack-azure/20">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <p className="font-medium text-fasttrack-ocean">Get Insights</p>
                <p className="text-sm text-fasttrack-ocean/50">
                  AI-powered tips
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Onboarding Notice */}
        {user.onboarding_step !== 'completed' && (
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-medium text-amber-800">
                  Complete Your Setup
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  You haven&apos;t finished setting up your profile. Open the
                  Telegram bot to complete onboarding and start tracking your
                  progress.
                </p>
                <a
                  href="https://t.me/FastTrackOcBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                >
                  Complete Setup
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
