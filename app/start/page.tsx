export default function StartPage() {
  return (
    <div className="min-h-screen bg-fasttrack-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <a href="/" className="text-2xl font-bold text-fasttrack-ocean">
          FastTrack
        </a>
      </nav>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-88px)] flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          {/* Tagline */}
          <h1 className="mb-4 text-3xl font-bold text-fasttrack-ocean">
            Start Your Journey
          </h1>
          <p className="mb-10 text-lg text-fasttrack-ocean/70">
            Track your meals, monitor your fasting, and reach your health goals with FastTrack.
          </p>

          {/* Primary CTA - Telegram Bot */}
          <a
            href="https://t.me/FastTrackOcBot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-fasttrack-ocean px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-fasttrack-azure"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Open Telegram Bot
          </a>

          {/* Secondary - Dashboard Login */}
          <div className="mt-12 rounded-xl border border-fasttrack-ocean/10 bg-fasttrack-mist/50 p-6">
            <p className="mb-4 text-fasttrack-ocean/70">
              Already tracking? Unlock your personalized dashboard to view insights, charts, and your full progress history.
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 font-medium text-fasttrack-azure transition-colors hover:text-fasttrack-ocean"
            >
              Login to Dashboard
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          {/* Footer links */}
          <div className="mt-8 text-sm text-fasttrack-ocean/50">
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
