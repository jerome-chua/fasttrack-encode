"use client";

import { useEffect, useState } from "react";
import { Group } from "@visx/group";
import { Pie } from "@visx/shape";
import { scaleOrdinal } from "@visx/scale";
import { ParentSize } from "@visx/responsive";

// Types
interface CalorieData {
  mealType: string;
  calories: number;
  percentage: number;
}

interface PieChartProps {
  width: number;
  height: number;
  data: CalorieData[];
  totalCalories: number;
}

// Constants
const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  supper: "Supper",
  beverage: "Beverage",
  other: "Other",
};

const MEAL_TYPE_COLORS: Record<string, string> = {
  breakfast: "#f59e0b", // amber
  lunch: "#10b981",     // emerald
  dinner: "#6366f1",    // indigo
  snack: "#ec4899",     // pink
  supper: "#8b5cf6",    // violet
  beverage: "#06b6d4",  // cyan
  other: "#6b7280",     // gray
};

// Accessors
const getValue = (d: CalorieData) => d.calories;
const getLabel = (d: CalorieData) => MEAL_TYPE_LABELS[d.mealType] || d.mealType;
const getColor = (d: CalorieData) => MEAL_TYPE_COLORS[d.mealType] || MEAL_TYPE_COLORS.other;

function CaloriesPieChartInner({ width, height, data, totalCalories }: PieChartProps) {
  const radius = Math.min(width, height) / 2;
  const centerX = width / 2;
  const centerY = height / 2;
  const donutThickness = radius * 0.4;

  const colorScale = scaleOrdinal({
    domain: data.map((d) => d.mealType),
    range: data.map(getColor),
  });

  if (width < 100 || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-fasttrack-ocean/50">
        No meals logged today
      </div>
    );
  }

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <Group top={centerY} left={centerX}>
          <Pie
            data={data}
            pieValue={getValue}
            outerRadius={radius - 20}
            innerRadius={radius - donutThickness}
            padAngle={0.02}
            cornerRadius={4}
          >
            {(pie) =>
              pie.arcs.map((arc, index) => {
                const [centroidX, centroidY] = pie.path.centroid(arc);
                const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.4;
                const arcPath = pie.path(arc) || "";
                const arcFill = colorScale(arc.data.mealType);

                return (
                  <g key={`arc-${arc.data.mealType}-${index}`}>
                    <path
                      d={arcPath}
                      fill={arcFill}
                      className="transition-opacity hover:opacity-80"
                    />
                    {hasSpaceForLabel && (
                      <text
                        x={centroidX}
                        y={centroidY}
                        dy=".33em"
                        fill="#fff"
                        fontSize={12}
                        fontWeight={600}
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {arc.data.percentage}%
                      </text>
                    )}
                  </g>
                );
              })
            }
          </Pie>
          {/* Center text */}
          <text
            textAnchor="middle"
            dy="-0.2em"
            fontSize={24}
            fontWeight={700}
            fill="#1e3a5f"
          >
            {totalCalories}
          </text>
          <text
            textAnchor="middle"
            dy="1.2em"
            fontSize={12}
            fill="#6b7280"
          >
            kcal today
          </text>
        </Group>
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {data.map((item) => (
          <div key={item.mealType} className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getColor(item) }}
            />
            <span className="text-sm text-gray-600">
              {getLabel(item)} ({item.calories})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CaloriesPieChart() {
  const [data, setData] = useState<CalorieData[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalories = async () => {
      const token = localStorage.getItem("session_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/calories/today", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch calories");
        }

        const result = await res.json();
        setData(result.data);
        setTotalCalories(result.totalCalories);
      } catch (err) {
        console.error("Error fetching calories:", err);
        setError("Could not load calorie data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="text-fasttrack-ocean/50">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ParentSize>
        {({ width, height }) => (
          <CaloriesPieChartInner
            width={width}
            height={height - 60}
            data={data}
            totalCalories={totalCalories}
          />
        )}
      </ParentSize>
    </div>
  );
}
