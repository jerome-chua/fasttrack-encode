import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-fasttrack-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <Link href="/" className="text-2xl font-bold text-fasttrack-ocean">
          FastTrack
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/#features"
            className="text-fasttrack-ocean transition-colors hover:text-fasttrack-azure"
          >
            Features
          </Link>
          <Link
            href="/about"
            className="text-fasttrack-ocean transition-colors hover:text-fasttrack-azure"
          >
            About
          </Link>
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

      {/* Hackathon Section */}
      <section className="px-8 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-center text-4xl font-bold text-fasttrack-ocean">
            About FastTrack
          </h1>

          <div className="mb-8 overflow-hidden rounded-2xl">
            <Image
              src="/committochange.jpg"
              alt="Commit to Change: An AI Agents Hackathon"
              width={1200}
              height={600}
              className="w-full object-cover"
            />
          </div>

          <div className="text-center">
            <h2 className="mb-4 text-2xl font-semibold text-fasttrack-ocean">
              Commit to Change Hackathon
            </h2>
            <p className="text-lg text-fasttrack-ocean/70">
              This project is part of the Commit to Change Hackathon spanning from{" "}
              <span className="font-semibold">13 Jan 2026</span> to{" "}
              <span className="font-semibold">08 Feb 2026</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-4xl px-8">
        <hr className="border-t-2 border-fasttrack-ocean/20" />
      </div>

      {/* Obesity Code Section */}
      <section className="px-8 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="flex-shrink-0">
              <Image
                src="/obesitycode.jpg"
                alt="The Obesity Code by Dr. Jason Fung"
                width={250}
                height={375}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-fasttrack-ocean">
                Powered by Science
              </h2>
              <p className="text-lg text-fasttrack-ocean/70">
                FastTrack uses principles from{" "}
                <span className="font-semibold">The Obesity Code</span> by{" "}
                <span className="font-semibold">Dr. Jason Fung</span>. This
                groundbreaking book explores why intermittent fasting is the key
                to controlling your weight, unlocking the secrets of weight loss
                through evidence-based approaches to managing insulin and
                metabolic health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-fasttrack-ocean px-8 py-12 text-fasttrack-white">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link href="/" className="text-2xl font-bold">
              FastTrack
            </Link>
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
