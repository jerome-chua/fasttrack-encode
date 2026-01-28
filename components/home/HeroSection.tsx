"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { staggerContainer, fadeInUp } from "./animations";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <>
      {/* Header Section - White background with headline */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="px-8 py-16 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h1
              variants={fadeInUp}
              className="mb-6 text-4xl font-bold tracking-tight text-fasttrack-ocean md:text-5xl lg:text-6xl"
            >
              KNOW YOUR
              <br />
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-fasttrack-azure"
              >
                POTENTIAL
              </motion.span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="max-w-xl text-lg text-fasttrack-ocean/70"
            >
              Track your daily activities, optimize your performance, and unlock
              your full potential with FastTrack&apos;s intelligent activity
              monitoring.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
