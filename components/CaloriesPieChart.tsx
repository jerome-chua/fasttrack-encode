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
  period: string;
}

type Period = "1d" | "7d" | "30d";

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

const PERIOD_LABELS: Record<Period, string> = {
  "1d": "today",
  "7d": "(7 days)",
  "30d": "(30 days)",
};

const TAB_OPTIONS: { value: Period; label: string }[] = [
  { value: "1d", label: "1 Day" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
];

// Accessors
const getValue = (d: CalorieData) => d.calories;
const getLabel = (d: CalorieData) => MEAL_TYPE_LABELS[d.mealType] || d.mealType;
const getColor = (d: CalorieData) => MEAL_TYPE_COLORS[d.mealType] || MEAL_TYPE_COLORS.other;

function CaloriesPieChartInner({ width, height, data, totalCalories, period }: PieChartProps) {
  const radius = Math.min(width, height) / 2;
  const centerX = width / 2;
  const centerY = height / 2;
  const donutThickness = radius * 0.4;

  const colorScale = scaleOrdinal({
    domain: data.map((d) => d.mealType),
    range: data.map(getColor),
  });

  const periodLabel = PERIOD_LABELS[period as Period] || "today";
  const isAverage = period !== "1d";

  if (width < 100 || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-fasttrack-ocean/50">
        No meals logged {period === "1d" ? "today" : `in the last ${period === "7d" ? "7" : "30"} days`}
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
            {isAverage ? "avg kcal " : "kcal "}{periodLabel}
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

function PeriodTabs({
  selectedPeriod,
  onPeriodChange
}: {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
      {TAB_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onPeriodChange(option.value)}
          className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
            selectedPeriod === option.value
              ? "bg-white text-fasttrack-ocean shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function CaloriesPieChart() {
  const [data, setData] = useState<CalorieData[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("1d");

  useEffect(() => {
    const fetchCalories = async () => {
      const token = localStorage.getItem("session_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/calories/period?period=${period}`, {
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
  }, [period]);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  if (isLoading) {
    return (
      <div className="flex h-[300px] flex-col">
        <div className="flex justify-end">
          <PeriodTabs selectedPeriod={period} onPeriodChange={handlePeriodChange} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-fasttrack-ocean/50">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[300px] flex-col">
        <div className="flex justify-end">
          <PeriodTabs selectedPeriod={period} onPeriodChange={handlePeriodChange} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <div className="flex justify-end">
        <PeriodTabs selectedPeriod={period} onPeriodChange={handlePeriodChange} />
      </div>
      <ParentSize>
        {({ width, height }) => (
          <CaloriesPieChartInner
            width={width}
            height={height - 60}
            data={data}
            totalCalories={totalCalories}
            period={period}
          />
        )}
      </ParentSize>
    </div>
  );
}
