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
    <div className="mb-5 flex items-start justify-between gap-3">
      <h2
        className="flex items-center gap-2 text-[15px] font-semibold tracking-tight"
        style={{ color: light ? "#fff" : lmsTokens.ink }}
      >
        {icon}
        {title}
      </h2>
      <div className="flex shrink-0 items-center gap-2">
        {badge}
        {action}
      </div>
    </div>
  );
}
