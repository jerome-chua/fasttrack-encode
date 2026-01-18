"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Group } from "@visx/group";
import { LinePath, AreaClosed, Bar, Line } from "@visx/shape";
import { scaleTime, scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { curveMonotoneX } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { Brush } from "@visx/brush";
import { Bounds } from "@visx/brush/lib/types";
import BaseBrush from "@visx/brush/lib/BaseBrush";
import { useTooltip, TooltipWithBounds } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { bisector } from "d3-array";
import { ParentSize } from "@visx/responsive";
import { WeightData, generateMockData, GOAL_WEIGHT } from "@/lib/mock/weightData";

// Accessors
const getDate = (d: WeightData) => d.date;
const getWeight = (d: WeightData) => d.weight;
const bisectDate = bisector<WeightData, Date>((d) => d.date).left;

// Colors
const colors = {
  primary: "#1e3a5f", // fasttrack-ocean
  secondary: "#4a90d9", // fasttrack-azure
  grid: "#e5e7eb",
  text: "#6b7280",
  goalLine: "#10b981",
  areaFill: "rgba(74, 144, 217, 0.1)",
  brush: "rgba(74, 144, 217, 0.3)",
};

interface ChartProps {
  width: number;
  height: number;
}

function WeightChartInner({ width, height }: ChartProps) {
  const data = useMemo(() => generateMockData(), []);

  // Margins
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  const brushHeight = 80;
  const brushMargin = { top: 10, bottom: 20, left: 50, right: 30 };
  const chartSeparation = 30;

  // Dimensions
  const innerHeight = height - margin.top - margin.bottom - brushHeight - chartSeparation;
  const innerWidth = width - margin.left - margin.right;
  const brushInnerHeight = brushHeight - brushMargin.top - brushMargin.bottom;

  // Brush state
  const [filteredData, setFilteredData] = useState(data);
  const brushRef = useRef<BaseBrush | null>(null);

  // Tooltip
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft,
    tooltipTop,
  } = useTooltip<WeightData>();

  // Scales for main chart
  const dateScale = useMemo(
    () =>
      scaleTime({
        domain: [
          Math.min(...filteredData.map((d) => d.date.getTime())),
          Math.max(...filteredData.map((d) => d.date.getTime())),
        ],
        range: [0, innerWidth],
      }),
    [filteredData, innerWidth]
  );

  const weightScale = useMemo(() => {
    const weights = filteredData.map((d) => d.weight);
    const minWeight = Math.min(...weights, GOAL_WEIGHT) - 2;
    const maxWeight = Math.max(...weights) + 2;
    return scaleLinear({
      domain: [minWeight, maxWeight],
      range: [innerHeight, 0],
      nice: true,
    });
  }, [filteredData, innerHeight]);

  // Scales for brush chart
  const brushDateScale = useMemo(
    () =>
      scaleTime({
        domain: [
          Math.min(...data.map((d) => d.date.getTime())),
          Math.max(...data.map((d) => d.date.getTime())),
        ],
        range: [0, innerWidth],
      }),
    [data, innerWidth]
  );

  const brushWeightScale = useMemo(() => {
    const weights = data.map((d) => d.weight);
    return scaleLinear({
      domain: [Math.min(...weights) - 2, Math.max(...weights) + 2],
      range: [brushInnerHeight, 0],
    });
  }, [data, brushInnerHeight]);

  // Brush handlers
  const onBrushChange = useCallback(
    (domain: Bounds | null) => {
      if (!domain) return;
      const { x0, x1 } = domain;
      const filtered = data.filter((d) => {
        const x = d.date.getTime();
        return x >= x0 && x <= x1;
      });
      setFilteredData(filtered.length > 0 ? filtered : data);
    },
    [data]
  );

  // Tooltip handler
  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x - margin.left);
      const index = bisectDate(filteredData, x0, 1);
      const d0 = filteredData[index - 1];
      const d1 = filteredData[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d = x0.getTime() - getDate(d0).getTime() > getDate(d1).getTime() - x0.getTime() ? d1 : d0;
      }
      if (d) {
        showTooltip({
          tooltipData: d,
          tooltipLeft: dateScale(getDate(d)) + margin.left,
          tooltipTop: weightScale(getWeight(d)) + margin.top,
        });
      }
    },
    [dateScale, filteredData, margin.left, margin.top, showTooltip, weightScale]
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: brushDateScale(data[data.length - 30]?.date || data[0].date) },
      end: { x: brushDateScale(data[data.length - 1].date) },
    }),
    [brushDateScale, data]
  );

  if (width < 100) return null;

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <LinearGradient
          id="area-gradient"
          from={colors.secondary}
          to={colors.secondary}
          fromOpacity={0.3}
          toOpacity={0.05}
        />
        <LinearGradient
          id="brush-gradient"
          from={colors.secondary}
          to={colors.secondary}
          fromOpacity={0.2}
          toOpacity={0.05}
        />

        {/* Main Chart */}
        <Group left={margin.left} top={margin.top}>
          {/* Grid */}
          <GridRows
            scale={weightScale}
            width={innerWidth}
            stroke={colors.grid}
            strokeDasharray="3,3"
            numTicks={5}
          />

          {/* Goal weight line */}
          <Line
            from={{ x: 0, y: weightScale(GOAL_WEIGHT) }}
            to={{ x: innerWidth, y: weightScale(GOAL_WEIGHT) }}
            stroke={colors.goalLine}
            strokeWidth={2}
            strokeDasharray="8,4"
          />
          <text
            x={innerWidth - 5}
            y={weightScale(GOAL_WEIGHT) - 8}
            fill={colors.goalLine}
            fontSize={12}
            textAnchor="end"
            fontWeight={600}
          >
            Goal: {GOAL_WEIGHT} kg
          </text>

          {/* Area under moving average */}
          <AreaClosed
            data={filteredData.filter((d) => d.movingAverage !== null)}
            x={(d) => dateScale(getDate(d))}
            y={(d) => weightScale(d.movingAverage!)}
            yScale={weightScale}
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />

          {/* Moving average line */}
          <LinePath
            data={filteredData.filter((d) => d.movingAverage !== null)}
            x={(d) => dateScale(getDate(d))}
            y={(d) => weightScale(d.movingAverage!)}
            stroke={colors.secondary}
            strokeWidth={3}
            curve={curveMonotoneX}
          />

          {/* Daily weight line */}
          <LinePath
            data={filteredData}
            x={(d) => dateScale(getDate(d))}
            y={(d) => weightScale(getWeight(d))}
            stroke={colors.primary}
            strokeWidth={2}
            curve={curveMonotoneX}
          />

          {/* Axes */}
          <AxisLeft
            scale={weightScale}
            stroke={colors.grid}
            tickStroke={colors.grid}
            tickLabelProps={() => ({
              fill: colors.text,
              fontSize: 12,
              textAnchor: "end",
              dy: "0.33em",
              dx: -4,
            })}
            numTicks={5}
            label="Weight (kg)"
            labelProps={{
              fill: colors.text,
              fontSize: 12,
              textAnchor: "middle",
            }}
          />
          <AxisBottom
            top={innerHeight}
            scale={dateScale}
            stroke={colors.grid}
            tickStroke={colors.grid}
            tickLabelProps={() => ({
              fill: colors.text,
              fontSize: 11,
              textAnchor: "middle",
            })}
            numTicks={width > 500 ? 8 : 4}
          />

          {/* Tooltip overlay */}
          <Bar
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={hideTooltip}
          />

          {/* Tooltip indicator */}
          {tooltipData && (
            <g>
              <Line
                from={{ x: dateScale(getDate(tooltipData)), y: 0 }}
                to={{ x: dateScale(getDate(tooltipData)), y: innerHeight }}
                stroke={colors.primary}
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <circle
                cx={dateScale(getDate(tooltipData))}
                cy={weightScale(getWeight(tooltipData))}
                r={6}
                fill={colors.primary}
                stroke="white"
                strokeWidth={2}
              />
              {tooltipData.movingAverage && (
                <circle
                  cx={dateScale(getDate(tooltipData))}
                  cy={weightScale(tooltipData.movingAverage)}
                  r={6}
                  fill={colors.secondary}
                  stroke="white"
                  strokeWidth={2}
                />
              )}
            </g>
          )}
        </Group>

        {/* Brush Chart */}
        <Group left={brushMargin.left} top={height - brushHeight - brushMargin.bottom}>
          <AreaClosed
            data={data}
            x={(d) => brushDateScale(getDate(d))}
            y={(d) => brushWeightScale(getWeight(d))}
            yScale={brushWeightScale}
            fill="url(#brush-gradient)"
            curve={curveMonotoneX}
          />
          <LinePath
            data={data}
            x={(d) => brushDateScale(getDate(d))}
            y={(d) => brushWeightScale(getWeight(d))}
            stroke={colors.secondary}
            strokeWidth={1}
            curve={curveMonotoneX}
          />
          <Brush
            xScale={brushDateScale}
            yScale={brushWeightScale}
            width={innerWidth}
            height={brushInnerHeight}
            margin={brushMargin}
            handleSize={8}
            innerRef={brushRef}
            resizeTriggerAreas={["left", "right"]}
            brushDirection="horizontal"
            initialBrushPosition={initialBrushPosition}
            onChange={onBrushChange}
            onClick={() => setFilteredData(data)}
            selectedBoxStyle={{
              fill: colors.brush,
              stroke: colors.secondary,
              strokeWidth: 1,
            }}
            useWindowMoveEvents
            renderBrushHandle={(props) => <BrushHandle {...props} />}
          />
        </Group>
      </svg>

      {/* Tooltip */}
      {tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          className="!bg-white !rounded-lg !shadow-lg !border !border-gray-200 !px-3 !py-2"
        >
          <div className="text-sm">
            <div className="font-semibold text-gray-900">
              {getDate(tooltipData).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium">{getWeight(tooltipData)} kg</span>
            </div>
            {tooltipData.movingAverage && (
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors.secondary }}
                />
                <span className="text-gray-600">7-day avg:</span>
                <span className="font-medium">{tooltipData.movingAverage} kg</span>
              </div>
            )}
          </div>
        </TooltipWithBounds>
      )}

      {/* Legend */}
      <div className="absolute top-2 right-8 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-1 rounded"
            style={{ backgroundColor: colors.primary }}
          />
          <span className="text-gray-600">Daily Weight</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-1 rounded"
            style={{ backgroundColor: colors.secondary }}
          />
          <span className="text-gray-600">7-Day Average</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-0.5 rounded"
            style={{ backgroundColor: colors.goalLine, borderStyle: "dashed" }}
          />
          <span className="text-gray-600">Goal</span>
        </div>
      </div>
    </div>
  );
}

// Brush handle component
function BrushHandle({ x, height, isBrushActive }: { x: number; height: number; isBrushActive: boolean }) {
  const pathWidth = 8;
  const pathHeight = 15;
  if (!isBrushActive) return null;
  return (
    <Group left={x + pathWidth / 2} top={(height - pathHeight) / 2}>
      <path
        fill="#fff"
        stroke={colors.secondary}
        strokeWidth={1}
        d={`M 0 0 L ${pathWidth} 0 L ${pathWidth} ${pathHeight} L 0 ${pathHeight} Z`}
        style={{ cursor: "ew-resize" }}
      />
      <path
        fill={colors.secondary}
        d={`M ${pathWidth / 4} ${pathHeight / 4} L ${pathWidth / 4} ${(pathHeight * 3) / 4}`}
        stroke={colors.secondary}
        strokeWidth={1}
      />
      <path
        fill={colors.secondary}
        d={`M ${(pathWidth * 3) / 4} ${pathHeight / 4} L ${(pathWidth * 3) / 4} ${(pathHeight * 3) / 4}`}
        stroke={colors.secondary}
        strokeWidth={1}
      />
    </Group>
  );
}

// Responsive wrapper
export default function WeightChart() {
  return (
    <div className="w-full h-[500px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
      <ParentSize>
        {({ width, height }) => (
          <WeightChartInner width={width} height={height - 40} />
        )}
      </ParentSize>
    </div>
  );
}
