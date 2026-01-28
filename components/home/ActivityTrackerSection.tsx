"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "./animations";
import ActivityCard from "./ActivityCard";

export default function ActivityTrackerSection() {
  const activities = [
    { label: "Activity One", duration: "4:30", timeRange: "6:00am - 10:30am" },
    { label: "Activity Two", duration: "1:15", timeRange: "11:00am - 12:15pm" },
    { label: "Activity Three", duration: "2:45", timeRange: "1:00pm - 3:45pm" },
    { label: "Activity Four", duration: "0:30", timeRange: "4:00pm - 4:30pm" },
  ];

  return (
    <section className="bg-[#1a1a1a] px-8 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
          {/* Activity Tracker Panel - Left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex-1"
          >
            <div className="rounded-2xl bg-[#2a2a2a] p-6">
              {/* MY DAY Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-white">
                  MY DAY
                </h2>
                <span className="text-sm text-white/50">Today</span>
              </div>

              {/* Activity Cards */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-4"
              >
                {activities.map((activity, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <ActivityCard
                      label={activity.label}
                      duration={activity.duration}
                      timeRange={activity.timeRange}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-6 flex gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-lg border border-white/20 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  + Add Activity
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-lg bg-fasttrack-azure px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-fasttrack-ocean"
                >
                  Start Activity
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Gradient Panel - Right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex-1"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="flex h-full min-h-[400px] items-center justify-center rounded-2xl bg-gradient-to-br from-fasttrack-azure to-fasttrack-ocean"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
                  className="mb-4 text-6xl font-bold text-white md:text-8xl"
                >
                  9:00
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="text-sm uppercase tracking-widest text-white/80"
                >
                  Total Active Hours
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
