"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, scaleIn } from "./animations";

export default function CTASection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden bg-fasttrack-mist px-8 py-20 md:py-28"
    >
      {/* Animated background shapes */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-fasttrack-azure/10"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [180, 360, 180],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-fasttrack-ocean/10"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-3xl font-bold uppercase tracking-wide text-fasttrack-ocean md:text-4xl lg:text-5xl"
          >
            START YOUR JOURNEY
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mb-8 text-lg text-fasttrack-ocean/70"
          >
            Join thousands of users who are unlocking their potential every
            day.
          </motion.p>
          <motion.div variants={scaleIn}>
            <motion.a
              href="/start"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block rounded-lg bg-fasttrack-ocean px-8 py-4 text-lg font-semibold uppercase tracking-wide text-white transition-colors hover:bg-fasttrack-azure"
            >
              START TRACKING
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
