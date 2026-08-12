import type { ReactNode } from "react";
import { lmsTokens } from "@/lib/portal/lms-tokens";

type DashboardPanelHeadProps = {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  badge?: ReactNode;
  light?: boolean;
};

export default function DashboardPanelHead({
  title,
  icon,
  action,
  badge,
  light = false,
}: DashboardPanelHeadProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <h2
        className="flex min-w-0 items-center gap-2 text-[15px] font-semibold tracking-tight"
        style={{ color: light ? "#fff" : lmsTokens.ink }}
      >
        {icon}
        <span className="truncate">{title}</span>
      </h2>
      <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
        {badge}
        {action ? <div className="w-full min-w-0 sm:w-auto">{action}</div> : null}
      </div>
    </div>
  );
}
