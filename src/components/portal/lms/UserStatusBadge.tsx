import {
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  type IconProps,
} from "@/components/portal/lms/icons";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import type { UserStatus } from "@/lib/portal/admin-data";

type StatusIcon = (props: IconProps) => React.ReactElement;

const statusMap: Record<
  UserStatus,
  { bg: string; fg: string; label: string; icon: StatusIcon }
> = {
  pending: {
    bg: lmsTokens.gold50,
    fg: lmsTokens.warn,
    label: "Pending",
    icon: ClockIcon,
  },
  active: {
    bg: lmsTokens.gold100,
    fg: lmsTokens.gold600,
    label: "Active",
    icon: CheckCircleIcon,
  },
  suspended: {
    bg: "#FBE6E1",
    fg: lmsTokens.bad,
    label: "Suspended",
    icon: AlertCircleIcon,
  },
};

export default function UserStatusBadge({
  status,
  compact = false,
}: {
  status: UserStatus;
  compact?: boolean;
}) {
  const config = statusMap[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full font-medium ${
        compact ? "gap-1 px-2 py-0.5 text-[10px]" : "gap-1.5 px-2.5 py-1 text-xs"
      }`}
      style={{ backgroundColor: config.bg, color: config.fg }}
    >
      <Icon size={compact ? 10 : 12} />
      {config.label}
    </span>
  );
}
