"use client";

import { motion } from "framer-motion";
import { floatingAnimation } from "./animations";

interface MessageBubbleProps {
  text: string;
  time: string;
  delay: number;
  position: "left" | "right";
}

export default function MessageBubble({
  text,
  time,
  delay,
  position,
}: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={`flex ${position === "right" ? "justify-end" : "justify-start"}`}
    >
      <motion.div
        animate={floatingAnimation}
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          position === "right"
            ? "bg-fasttrack-azure text-white rounded-br-md"
            : "bg-white text-fasttrack-ocean rounded-bl-md shadow-lg"
        }`}
      >
        <p className="text-sm leading-relaxed">{text}</p>
        <span
          className={`mt-1 block text-xs ${
            position === "right" ? "text-white/60" : "text-fasttrack-ocean/50"
          }`}
        >
          {time}
        </span>
      </motion.div>
    </motion.div>
  );
}
