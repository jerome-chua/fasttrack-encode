"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, scaleIn } from "./animations";
import WeightChart from "@/components/WeightChart";

export default function WeightProgressSection() {
  return (
    <section className="p-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-center text-3xl font-bold uppercase tracking-wide text-fasttrack-ocean md:text-4xl"
          >
            Track Your Progress
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto mb-8 max-w-2xl text-center text-lg text-fasttrack-ocean/70"
          >
            Monitor your weight journey with our interactive chart. Focus on
            the trend, not daily fluctuations.
          </motion.p>
          <motion.div variants={scaleIn}>
            <WeightChart />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
