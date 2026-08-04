import {
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  type IconProps,
} from "@/components/portal/lms/icons";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import type { AssignmentStatus } from "@/lib/portal/student-data";

type StatusIcon = (props: IconProps) => React.ReactElement;

const statusMap: Record<
  AssignmentStatus,
  { bg: string; fg: string; label: string; icon: StatusIcon }
> = {
  pending: {
    bg: "#FBF0DF",
    fg: lmsTokens.warn,
    label: "Pending",
    icon: ClockIcon,
  },
  submitted: {
    bg: "#E6F2EC",
    fg: lmsTokens.good,
    label: "Submitted",
    icon: CheckCircleIcon,
  },
  overdue: {
    bg: "#FBE6E1",
    fg: lmsTokens.bad,
    label: "Overdue",
    icon: AlertCircleIcon,
  },
};

export default function StatusBadge({ status }: { status: AssignmentStatus }) {
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
