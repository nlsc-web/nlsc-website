import { lmsTokens } from "@/lib/portal/lms-tokens";

type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
};

export default function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className="lms-stat-card relative flex flex-col gap-1 overflow-hidden p-5">
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${lmsTokens.gold500}, transparent)`,
        }}
        aria-hidden
      />
      <span
        className="text-[11px] font-bold uppercase tracking-[0.12em]"
        style={{ color: lmsTokens.slate }}
      >
        {label}
      </span>
      <span
        className="text-3xl font-semibold tracking-tight"
        style={{
          color: lmsTokens.ink,
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {value}
      </span>
      {sub && (
        <span
          className="mt-1 text-xs font-medium"
          style={{ color: accent || lmsTokens.slate }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}
