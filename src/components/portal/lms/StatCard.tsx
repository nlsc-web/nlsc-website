import { lmsBrandPill, lmsTokens } from "@/lib/portal/lms-tokens";

type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  /** Renders sub as a colored pill badge (growth metrics) */
  subPill?: boolean;
  compact?: boolean;
};

export default function StatCard({
  label,
  value,
  sub,
  accent,
  subPill = false,
  compact = false,
}: StatCardProps) {
  const subColor = accent || lmsTokens.slate;

  return (
    <div
      className={`lms-stat-card relative flex flex-col gap-2 overflow-hidden p-4 sm:p-5 ${
        compact
          ? "min-h-[100px] lg:min-h-0 lg:gap-1 lg:p-4"
          : "min-h-[120px] lg:min-h-[132px] lg:p-6"
      }`}
    >
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${lmsTokens.gold500}, transparent)`,
        }}
        aria-hidden
      />
      <span
        className="text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[11px]"
        style={{ color: lmsTokens.slate }}
      >
        {label}
      </span>
      <span
        className={`font-semibold tracking-tight ${
          compact
            ? "text-2xl sm:text-[1.75rem] lg:text-[1.65rem]"
            : "text-2xl sm:text-[1.75rem] lg:text-3xl"
        }`}
        style={{ color: lmsTokens.ink }}
      >
        {value}
      </span>
      {sub &&
        (subPill ? (
          <span
            className="mt-0.5 inline-flex w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{
              backgroundColor:
                subColor === lmsTokens.gold500 ||
                subColor === lmsTokens.good ||
                subColor === lmsTokens.warn
                  ? lmsBrandPill.bg
                  : `${subColor}18`,
              color:
                subColor === lmsTokens.good
                  ? lmsTokens.gold600
                  : subColor === lmsTokens.gold500 || subColor === lmsTokens.warn
                    ? lmsBrandPill.fg
                    : subColor,
            }}
          >
            {sub}
          </span>
        ) : (
          <span className="mt-0.5 text-xs font-medium" style={{ color: subColor }}>
            {sub}
          </span>
        ))}
    </div>
  );
}
