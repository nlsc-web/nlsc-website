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
    bg: "#FBF0DF",
    fg: lmsTokens.warn,
    label: "Pending",
    icon: ClockIcon,
  },
  active: {
    bg: "#E6F2EC",
    fg: lmsTokens.good,
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

export default function UserStatusBadge({ status }: { status: UserStatus }) {
  const config = statusMap[status];
  const Icon = config.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: config.bg, color: config.fg }}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}
