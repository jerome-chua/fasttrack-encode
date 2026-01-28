"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "./animations";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const features: Feature[] = [
  {
    icon: (
      <svg
        className="h-8 w-8 text-fasttrack-azure"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: "Snap Your Meals",
    description:
      "Take a photo of your food and our AI will automatically estimate and record the calories for you.",
    delay: 0.2,
  },
  {
    icon: (
      <svg
        className="h-8 w-8 text-fasttrack-azure"
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
    ),
    title: "Track Fasting Periods",
    description:
      "Get prompted to update your fasting windows and stay on track with intermittent fasting schedules.",
    delay: 0.3,
  },
  {
    icon: (
      <svg
        className="h-8 w-8 text-fasttrack-azure"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: "Personalized Insights",
    description:
      "Receive tailored insights and recommendations based on your weight loss goals and progress.",
    delay: 0.4,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="p-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-12 text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-3xl font-bold uppercase tracking-wide text-fasttrack-ocean md:text-4xl"
          >
            How It Works
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-lg text-fasttrack-ocean/70"
          >
            FastTrack uses a Telegram bot to make tracking your health journey
            simple and seamless.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="rounded-2xl bg-fasttrack-mist p-8 text-center transition-shadow hover:shadow-xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: feature.delay,
                  type: "spring",
                  stiffness: 200,
                }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-fasttrack-azure/20"
              >
                {feature.icon}
              </motion.div>
              <h3 className="mb-3 text-xl font-semibold text-fasttrack-ocean">
                {feature.title}
              </h3>
              <p className="text-fasttrack-ocean/70">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
