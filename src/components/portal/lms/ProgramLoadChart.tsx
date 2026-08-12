import { lmsTokens } from "@/lib/portal/lms-tokens";

type ProgramLoadChartProps = {
  data: Array<{ program: string; courses: number }>;
  compact?: boolean;
};

export default function ProgramLoadChart({ data, compact = false }: ProgramLoadChartProps) {
  const max = Math.max(...data.map((item) => item.courses));

  return (
    <div className={compact ? "space-y-2.5 lg:space-y-2" : "space-y-4 lg:space-y-5"}>
      {data.map((item) => (
        <div key={item.program}>
          <div
            className={`mb-2 flex items-center justify-between gap-3 ${
              compact ? "text-[11px] lg:text-xs" : "text-xs lg:text-sm"
            }`}
          >
            <span className="min-w-0 truncate" style={{ color: lmsTokens.ink }}>
              {item.program}
            </span>
            <span className="font-semibold" style={{ color: lmsTokens.slate }}>
              {item.courses}
            </span>
          </div>
          <div
            className={`w-full rounded-full ${compact ? "h-1.5 lg:h-2" : "h-2 lg:h-2.5"}`}
            style={{ backgroundColor: lmsTokens.gold100 }}
          >
            <div
              className={`rounded-full ${compact ? "h-1.5 lg:h-2" : "h-2 lg:h-2.5"}`}
              style={{
                width: `${(item.courses / max) * 100}%`,
                background: `linear-gradient(90deg, ${lmsTokens.gold500}, #eab64d)`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
