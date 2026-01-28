"use client";

import { motion } from "framer-motion";

interface ActivityCardProps {
  label: string;
  duration: string;
  timeRange: string;
}

export default function ActivityCard({
  label,
  duration,
  timeRange,
}: ActivityCardProps) {
  return (
    <motion.div
      whileHover={{ x: 5, transition: { duration: 0.2 } }}
      className="flex items-center gap-4 rounded-xl bg-[#1a1a1a] p-4 transition-colors hover:bg-[#252525]"
    >
      {/* Icon Circle with badge */}
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3a3a3a]">
          <div className="h-6 w-6 rounded-full bg-fasttrack-azure/30" />
        </div>
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-fasttrack-azure text-[10px] font-bold text-white">
          ✓
        </div>
      </div>

      {/* Activity Info */}
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
        <p className="text-lg font-semibold text-white">{duration}</p>
      </div>

      {/* Time Range */}
      <div className="text-right">
        <p className="text-sm text-white/50">{timeRange}</p>
      </div>
    </motion.div>
  );
}
