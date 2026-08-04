"use client";

import { lmsTokens } from "@/lib/portal/lms-tokens";
import { useMemo, useState } from "react";

type EnrollmentTrendChartProps = {
  data: Array<{ month: string; students: number }>;
};

const SLICE_COLORS = [
  lmsTokens.gold500,
  "#eab64d",
  "#c9a030",
  "#f0d078",
  "#b8922a",
  lmsTokens.navy900,
];

/** Stable SVG coords — avoids server/client float hydration mismatches. */
function roundCoord(value: number) {
  return Math.round(value * 100) / 100;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: roundCoord(cx + r * Math.cos(rad)),
    y: roundCoord(cy + r * Math.sin(rad)),
  };
}

function describeDonutSlice(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
) {
  const startOuter = polarToCartesian(cx, cy, outerR, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerR, startAngle);
  const startInner = polarToCartesian(cx, cy, innerR, startAngle);
  const endInner = polarToCartesian(cx, cy, innerR, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}`,
    "Z",
  ].join(" ");
}

function toMonthlySlices(data: EnrollmentTrendChartProps["data"]) {
  return data.map((point, index) => {
    const previous = index > 0 ? data[index - 1].students : 0;
    const newStudents = index === 0 ? point.students : point.students - previous;
    return {
      month: point.month,
      value: newStudents,
      total: point.students,
    };
  });
}

export default function EnrollmentTrendChart({ data }: EnrollmentTrendChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const slices = useMemo(() => toMonthlySlices(data), [data]);
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const latestTotal = data[data.length - 1]?.students ?? total;

  const cx = 140;
  const cy = 140;
  const innerR = 62;
  const baseOuterR = 104;
  const activeOuterR = 108;

  const arcs = useMemo(() => {
    let cursor = 0;
    return slices.map((slice, index) => {
      const angle = total > 0 ? (slice.value / total) * 360 : 0;
      const startAngle = cursor;
      const endAngle = cursor + angle;
      cursor = endAngle;
      const isActive = activeIndex === index;
      const sliceOuterR = isActive ? activeOuterR : baseOuterR;
      const midAngle = startAngle + angle / 2;
      const labelR = (innerR + sliceOuterR) / 2;
      const labelPos = polarToCartesian(cx, cy, labelR, midAngle);
      const showLabel = angle >= 14;

      return {
        ...slice,
        index,
        startAngle,
        endAngle,
        angle,
        color: SLICE_COLORS[index % SLICE_COLORS.length],
        path: describeDonutSlice(
          cx,
          cy,
          innerR,
          isActive ? sliceOuterR + 4 : sliceOuterR,
          startAngle,
          endAngle,
        ),
        labelPos,
        showLabel,
        percent: total > 0 ? Math.round((slice.value / total) * 100) : 0,
      };
    });
  }, [slices, total, activeIndex]);

  const active = activeIndex !== null ? arcs[activeIndex] : null;

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-start md:gap-10 lg:gap-12">
      <div className="relative shrink-0">
        <svg
          viewBox="0 0 280 280"
          className="h-[260px] w-[260px] sm:h-[280px] sm:w-[280px]"
          role="img"
          aria-label="Enrollment distribution by month"
        >
          {arcs.map((arc) => (
            <path
              key={arc.month}
              d={arc.path}
              fill={arc.color}
              stroke="#fff"
              strokeWidth="2"
              className="cursor-pointer transition-opacity duration-150"
              opacity={activeIndex === null || activeIndex === arc.index ? 1 : 0.45}
              onMouseEnter={() => setActiveIndex(arc.index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() =>
                setActiveIndex((current) => (current === arc.index ? null : arc.index))
              }
              onFocus={() => setActiveIndex(arc.index)}
              onBlur={() => setActiveIndex(null)}
              tabIndex={0}
              role="button"
              aria-label={`${arc.month}: ${arc.value} new enrollments, ${arc.percent}%`}
            />
          ))}
          {arcs.map(
            (arc) =>
              arc.showLabel && (
                <text
                  key={`${arc.month}-label`}
                  x={arc.labelPos.x}
                  y={arc.labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={arc.color === lmsTokens.navy900 ? "#fff" : lmsTokens.navy900}
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="inherit"
                  pointerEvents="none"
                >
                  {arc.percent}%
                </text>
              ),
          )}
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            fill={lmsTokens.ink}
            fontSize="26"
            fontWeight="600"
            fontFamily="inherit"
          >
            {latestTotal}
          </text>
          <text
            x={cx}
            y={cy + 16}
            textAnchor="middle"
            fill={lmsTokens.slate}
            fontSize="11"
            fontWeight="500"
            fontFamily="inherit"
          >
            students
          </text>
        </svg>

        {active && (
          <div
            className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1 rounded-md border bg-white px-3 py-2 text-center shadow-md"
            style={{ borderColor: lmsTokens.line }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wide"
              style={{ color: lmsTokens.gold500 }}
            >
              {active.month}
            </p>
            <p className="text-sm font-semibold" style={{ color: lmsTokens.ink }}>
              +{active.value} new
            </p>
            <p className="text-[10px]" style={{ color: lmsTokens.slate }}>
              {active.total} total · {active.percent}%
            </p>
          </div>
        )}
      </div>

      <div className="w-full min-w-0 md:w-auto md:flex-1 md:max-w-xs lg:max-w-sm">
        <p
          className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em]"
          style={{ color: lmsTokens.slate }}
        >
          New enrollments by month
        </p>
        <ul className="space-y-2.5">
          {arcs.map((arc) => (
            <li key={arc.month}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-md px-1 py-0.5 text-left transition-colors hover:bg-nlsc-gold/10"
                onMouseEnter={() => setActiveIndex(arc.index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() =>
                  setActiveIndex((current) => (current === arc.index ? null : arc.index))
                }
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: arc.color }}
                  aria-hidden
                />
                <span className="flex-1 text-sm font-medium" style={{ color: lmsTokens.ink }}>
                  {arc.month}
                </span>
                <span className="text-sm tabular-nums" style={{ color: lmsTokens.slate }}>
                  {arc.value}
                </span>
                <span
                  className="w-10 text-right text-xs font-semibold tabular-nums"
                  style={{ color: lmsTokens.gold500 }}
                >
                  {arc.percent}%
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
