"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-fasttrack-ocean px-8 py-12 text-fasttrack-white"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-6 md:flex-row"
        >
          <div className="text-2xl font-bold">FastTrack</div>
          <div className="flex gap-6">
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              className="transition-colors hover:text-fasttrack-sky"
            >
              Privacy
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              className="transition-colors hover:text-fasttrack-sky"
            >
              Terms
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              className="transition-colors hover:text-fasttrack-sky"
            >
              Contact
            </motion.a>
          </div>
        </motion.div>
        <div className="mt-8 text-center text-sm text-fasttrack-sky">
          &copy; {new Date().getFullYear()} FastTrack. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
}
