"use client";

import { lmsTokens } from "@/lib/portal/lms-tokens";
import { useState } from "react";

type EnrollmentTrendChartProps = {
  data: Array<{ month: string; students: number }>;
};

function smoothPath(
  points: Array<{ x: number; y: number }>,
): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export default function EnrollmentTrendChart({ data }: EnrollmentTrendChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const max = Math.max(...data.map((p) => p.students));
  const min = Math.min(...data.map((p) => p.students));
  const paddedMax = max + Math.ceil((max - min) * 0.08);
  const paddedMin = Math.max(0, min - Math.ceil((max - min) * 0.08));
  const range = paddedMax - paddedMin || 1;

  const width = 560;
  const height = 200;
  const padLeft = 36;
  const padRight = 12;
  const padTop = 16;
  const padBottom = 8;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const points = data.map((point, index) => {
    const x = padLeft + (index / (data.length - 1)) * chartW;
    const y = padTop + chartH - ((point.students - paddedMin) / range) * chartH;
    return { x, y, ...point, index };
  });

  const linePath = smoothPath(points);
  const curveOnly = linePath.replace(/^M [\d.]+,[\d.]+ /, "");
  const bottom = padTop + chartH;
  const areaPath = `M ${points[0].x},${bottom} L ${points[0].x},${points[0].y} ${curveOnly} L ${points[points.length - 1].x},${bottom} Z`;

  const yTicks = [0, 1, 2, 3].map((i) => {
    const value = Math.round(paddedMax - (i / 3) * (paddedMax - paddedMin));
    const y = padTop + (i / 3) * chartH;
    return { value, y };
  });

  const active = activeIndex !== null ? points[activeIndex] : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[220px] w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Enrollment trend from March to August"
      >
        <defs>
          <linearGradient id="enrollmentFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lmsTokens.gold500} stopOpacity="0.22" />
            <stop offset="85%" stopColor={lmsTokens.gold500} stopOpacity="0.04" />
          </linearGradient>
          <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor={lmsTokens.gold500} floodOpacity="0.35" />
          </filter>
        </defs>

        {yTicks.map(({ value, y }) => (
          <g key={value}>
            <line
              x1={padLeft}
              x2={width - padRight}
              y1={y}
              y2={y}
              stroke={lmsTokens.line}
              strokeWidth="1"
              strokeDasharray={value === paddedMin ? "0" : "4 4"}
            />
            <text
              x={padLeft - 8}
              y={y + 4}
              textAnchor="end"
              fill={lmsTokens.slate}
              fontSize="10"
              fontFamily="system-ui, sans-serif"
            >
              {value}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#enrollmentFill)" />
        <path
          d={linePath}
          fill="none"
          stroke={lmsTokens.gold500}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point) => {
          const isActive = activeIndex === point.index;
          return (
            <g key={point.month}>
              {isActive && (
                <line
                  x1={point.x}
                  x2={point.x}
                  y1={padTop}
                  y2={padTop + chartH}
                  stroke={lmsTokens.gold500}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity={0.5}
                />
              )}
              <circle
                cx={point.x}
                cy={point.y}
                r={isActive ? 6 : 4.5}
                fill={lmsTokens.gold500}
                stroke="#fff"
                strokeWidth="2"
                filter={isActive ? "url(#dotGlow)" : undefined}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setActiveIndex(point.index)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(point.index)}
                onBlur={() => setActiveIndex(null)}
                tabIndex={0}
                role="button"
                aria-label={`${point.month}: ${point.students} students`}
              />
            </g>
          );
        })}
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border bg-white px-2.5 py-1.5 text-center shadow-md"
          style={{
            borderColor: lmsTokens.line,
            left: `${(active.index / (data.length - 1)) * 100}%`,
            top: "8%",
            transform: "translateX(-50%)",
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: lmsTokens.gold500 }}>
            {active.month}
          </p>
          <p className="text-sm font-semibold" style={{ color: lmsTokens.ink, fontFamily: "Georgia, serif" }}>
            {active.students}
          </p>
          <p className="text-[10px]" style={{ color: lmsTokens.slate }}>
            students
          </p>
        </div>
      )}

      <div
        className="grid text-[11px] font-medium"
        style={{
          color: lmsTokens.slate,
          gridTemplateColumns: `repeat(${data.length}, 1fr)`,
          paddingLeft: `${(padLeft / width) * 100}%`,
          paddingRight: `${(padRight / width) * 100}%`,
        }}
      >
        {data.map((point) => (
          <span key={point.month} className="text-center">
            {point.month}
          </span>
        ))}
      </div>
    </div>
  );
}
