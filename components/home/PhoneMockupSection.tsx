"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { staggerContainer, fadeInUp, floatingAnimation } from "./animations";
import MessageBubble from "./MessageBubble";

export default function PhoneMockupSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const phoneY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const messages = [
    {
      text: "Hey! I just finished my morning run. 5.2km in 28 minutes! 🏃‍♂️",
      time: "8:45 AM",
      delay: 0.2,
      position: "right" as const,
    },
    {
      text: "Great job! That's a new personal best! 🎉 Your pace improved by 12% from last week.",
      time: "8:46 AM",
      delay: 0.4,
      position: "left" as const,
    },
    {
      text: "Lunch: Grilled chicken salad with avocado 🥗",
      time: "12:30 PM",
      delay: 0.6,
      position: "right" as const,
    },
    {
      text: "Logged! That's approximately 450 calories. You're on track with your daily goal. 👍",
      time: "12:31 PM",
      delay: 0.8,
      position: "left" as const,
    },
    {
      text: "Starting my fasting window now ⏰",
      time: "8:00 PM",
      delay: 1.0,
      position: "right" as const,
    },
    {
      text: "Fasting timer started! I'll remind you when your 16-hour window is complete. You've got this! 💪",
      time: "8:01 PM",
      delay: 1.2,
      position: "left" as const,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-fasttrack-white to-fasttrack-mist py-20 md:py-32"
    >
      {/* Background decorative elements */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-10 top-20 h-64 w-64 rounded-full bg-fasttrack-azure/10 blur-3xl"
      />
      <motion.div
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-fasttrack-ocean/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16 text-center"
        >
          <motion.span
            variants={fadeInUp}
            className="mb-4 inline-block rounded-full bg-fasttrack-azure/10 px-4 py-2 text-sm font-medium text-fasttrack-azure"
          >
            Telegram Integration
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-3xl font-bold text-fasttrack-ocean md:text-4xl lg:text-5xl"
          >
            Track With a Simple Message
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-lg text-fasttrack-ocean/70"
          >
            No complicated apps. Just open Telegram, send a message, and let
            FastTrack handle the rest.
          </motion.p>
        </motion.div>

        {/* Phone and Floating Cards Layout */}
        <div className="relative flex items-center justify-center">
          {/* Left floating cards */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute left-0 top-1/4 hidden lg:block"
          >
            <motion.div
              animate={floatingAnimation}
              className="rounded-2xl bg-white p-5 shadow-xl"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-5 w-5 text-green-600"
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
                <div>
                  <p className="text-sm font-semibold text-fasttrack-ocean">
                    Activity Logged
                  </p>
                  <p className="text-xs text-fasttrack-ocean/60">
                    Running - 5.2km
                  </p>
                </div>
              </div>
              <div className="text-xs text-fasttrack-ocean/50">Just now</div>
            </motion.div>
          </motion.div>

          {/* Right floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute right-0 top-1/3 hidden lg:block"
          >
            <motion.div
              animate={{
                y: [8, -8, 8],
                transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="rounded-2xl bg-white p-5 shadow-xl"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fasttrack-azure/20">
                  <svg
                    className="h-5 w-5 text-fasttrack-azure"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-fasttrack-ocean">
                    Weekly Progress
                  </p>
                  <p className="text-xs text-green-600">+12% vs last week</p>
                </div>
              </div>
              <div className="h-12 w-32">
                <svg viewBox="0 0 100 40" className="h-full w-full">
                  <path
                    d="M0,35 Q20,30 30,25 T50,20 T70,15 T100,5"
                    fill="none"
                    stroke="#4A90D9"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </motion.div>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            style={{ y: phoneY }}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 w-full max-w-sm"
          >
            {/* Phone Frame */}
            <div className="relative overflow-hidden rounded-[3rem] border-8 border-fasttrack-ocean bg-fasttrack-ocean shadow-2xl">
              {/* Notch */}
              <div className="absolute left-1/2 top-0 z-20 h-7 w-32 -translate-x-1/2 rounded-b-2xl bg-fasttrack-ocean" />

              {/* Screen Content */}
              <div className="relative h-[600px] overflow-hidden bg-fasttrack-mist">
                {/* Telegram Header */}
                <div className="relative z-10 bg-fasttrack-azure px-4 pb-4 pt-10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                      <span className="text-lg font-bold text-white">F</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">FastTrack Bot</p>
                      <p className="text-xs text-white/70">online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="space-y-4 p-4">
                  {messages.map((message, index) => (
                    <MessageBubble
                      key={index}
                      text={message.text}
                      time={message.time}
                      delay={message.delay}
                      position={message.position}
                    />
                  ))}
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-400">
                      Type a message...
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-fasttrack-azure"
                    >
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Shadow */}
            <div className="absolute -bottom-4 left-1/2 h-4 w-3/4 -translate-x-1/2 rounded-full bg-black/20 blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
