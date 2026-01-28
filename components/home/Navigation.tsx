"use client";

import { motion } from "framer-motion";

export default function Navigation() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-fasttrack-white/80 px-8 py-6 backdrop-blur-md"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="text-2xl font-bold text-fasttrack-ocean"
      >
        FastTrack
      </motion.div>
      <div className="flex items-center gap-6">
        <motion.a
          href="#features"
          whileHover={{ y: -2 }}
          className="text-fasttrack-ocean transition-colors hover:text-fasttrack-azure"
        >
          Features
        </motion.a>
        <motion.a
          href="/about"
          whileHover={{ y: -2 }}
          className="text-fasttrack-ocean transition-colors hover:text-fasttrack-azure"
        >
          About
        </motion.a>
        <motion.a
          href="/start"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg bg-fasttrack-ocean px-4 py-2 font-medium text-white transition-colors hover:bg-fasttrack-azure"
        >
          Start Tracking
        </motion.a>
      </div>
    </motion.nav>
  );
}
