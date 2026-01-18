export default function Home() {
  return (
    <div className="min-h-screen bg-fasttrack-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold text-fasttrack-ocean">FastTrack</div>
        <div className="flex items-center gap-6">
          <a
            href="#features"
            className="text-fasttrack-ocean transition-colors hover:text-fasttrack-azure"
          >
            Features
          </a>
          <a
            href="#about"
            className="text-fasttrack-ocean transition-colors hover:text-fasttrack-azure"
          >
            About
          </a>
          <a
            href="https://t.me/FastTrackOcBot"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-fasttrack-ocean px-4 py-2 font-medium text-white transition-colors hover:bg-fasttrack-azure"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Header Section - White background with headline */}
      <section className="px-8 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-fasttrack-ocean md:text-5xl lg:text-6xl">
            KNOW YOUR
            <br />
            <span className="text-fasttrack-azure">POTENTIAL</span>
          </h1>
          <p className="max-w-xl text-lg text-fasttrack-ocean/70">
            Track your daily activities, optimize your performance, and unlock
            your full potential with FastTrack&apos;s intelligent activity monitoring.
          </p>
        </div>
      </section>

      {/* Hero Section - Dark background with activity tracker */}
      <section className="bg-[#1a1a1a] px-8 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
            {/* Activity Tracker Panel - Left */}
            <div className="flex-1">
              <div className="rounded-2xl bg-[#2a2a2a] p-6">
                {/* MY DAY Header */}
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-white">
                    MY DAY
                  </h2>
                  <span className="text-sm text-white/50">Today</span>
                </div>

                {/* Activity Cards */}
                <div className="space-y-4">
                  <ActivityCard
                    label="Activity One"
                    duration="4:30"
                    timeRange="6:00am - 10:30am"
                  />
                  <ActivityCard
                    label="Activity Two"
                    duration="1:15"
                    timeRange="11:00am - 12:15pm"
                  />
                  <ActivityCard
                    label="Activity Three"
                    duration="2:45"
                    timeRange="1:00pm - 3:45pm"
                  />
                  <ActivityCard
                    label="Activity Four"
                    duration="0:30"
                    timeRange="4:00pm - 4:30pm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 rounded-lg border border-white/20 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
                    + Add Activity
                  </button>
                  <button className="flex-1 rounded-lg bg-fasttrack-azure px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-fasttrack-ocean">
                    Start Activity
                  </button>
                </div>
              </div>
            </div>

            {/* Gradient Panel - Right */}
            <div className="flex-1">
              <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl bg-gradient-to-br from-fasttrack-azure to-fasttrack-ocean">
                <div className="text-center">
                  <div className="mb-4 text-6xl font-bold text-white md:text-8xl">
                    9:00
                  </div>
                  <p className="text-sm uppercase tracking-widest text-white/80">
                    Total Active Hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-fasttrack-mist px-8 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold uppercase tracking-wide text-fasttrack-ocean md:text-4xl lg:text-5xl">
            START YOUR JOURNEY
          </h2>
          <p className="mb-8 text-lg text-fasttrack-ocean/70">
            Join thousands of users who are unlocking their potential every day.
          </p>
          <a
            href="https://t.me/FastTrackOcBot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-fasttrack-ocean px-8 py-4 text-lg font-semibold uppercase tracking-wide text-white transition-colors hover:bg-fasttrack-azure"
          >
            Unlock Yours
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-fasttrack-ocean px-8 py-12 text-fasttrack-white">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-2xl font-bold">FastTrack</div>
            <div className="flex gap-6">
              <a href="#" className="transition-colors hover:text-fasttrack-sky">
                Privacy
              </a>
              <a href="#" className="transition-colors hover:text-fasttrack-sky">
                Terms
              </a>
              <a href="#" className="transition-colors hover:text-fasttrack-sky">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-fasttrack-sky">
            &copy; {new Date().getFullYear()} FastTrack. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function ActivityCard({
  label,
  duration,
  timeRange,
}: {
  label: string;
  duration: string;
  timeRange: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-[#1a1a1a] p-4">
      {/* Icon Circle with badge */}
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3a3a3a]">
          <div className="h-6 w-6 rounded-full bg-fasttrack-azure/30" />
        </div>
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-fasttrack-azure text-[10px] font-bold text-white">
          ✓
        </div>
      </div>

      {/* Activity Info */}
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
        <p className="text-lg font-semibold text-white">{duration}</p>
      </div>

      {/* Time Range */}
      <div className="text-right">
        <p className="text-sm text-white/50">{timeRange}</p>
      </div>
    </div>
  );
}
