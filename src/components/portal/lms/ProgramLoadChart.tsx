import { lmsTokens } from "@/lib/portal/lms-tokens";

type ProgramLoadChartProps = {
  data: Array<{ program: string; courses: number }>;
};

export default function ProgramLoadChart({ data }: ProgramLoadChartProps) {
  const max = Math.max(...data.map((item) => item.courses));

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.program}>
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span style={{ color: lmsTokens.ink }}>{item.program}</span>
            <span className="font-semibold" style={{ color: lmsTokens.slate }}>
              {item.courses}
            </span>
          </div>
          <div
            className="h-2 w-full rounded-full"
            style={{ backgroundColor: lmsTokens.gold100 }}
          >
            <div
              className="h-2 rounded-full"
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
