"use client";

import { CalendarCheckIcon } from "@/components/portal/lms/icons";
import DashboardPanelHead from "@/components/portal/lms/DashboardPanelHead";
import StatCard from "@/components/portal/lms/StatCard";
import { useMemo, useState } from "react";
import { lmsBrandPill, lmsTokens } from "@/lib/portal/lms-tokens";
import type {
  AttendanceStatus,
  StudentPortalData,
} from "@/lib/portal/types/student-portal";

type FilterKey = "all" | AttendanceStatus;

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "present", label: "Present" },
  { key: "late", label: "Late" },
  { key: "absent", label: "Absent" },
];

const statusStyles: Record<
  AttendanceStatus,
  { bg: string; fg: string; label: string }
> = {
  present: { bg: "#e6f2ec", fg: lmsTokens.good, label: "Present" },
  late: { bg: "#fbf0df", fg: lmsTokens.warn, label: "Late" },
  absent: { bg: "#fbe6e1", fg: lmsTokens.bad, label: "Absent" },
  excused: { bg: "#f4f4f4", fg: lmsTokens.slate, label: "Excused" },
};

function AttendanceBadge({ status }: { status: AttendanceStatus }) {
  const config = statusStyles[status];
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: config.bg, color: config.fg }}
    >
      {config.label}
    </span>
  );
}

type StudentAttendanceViewProps = {
  attendance: StudentPortalData["attendance"];
};

export default function StudentAttendanceView({
  attendance,
}: StudentAttendanceViewProps) {
  const { summary, records } = attendance;
  const [filter, setFilter] = useState<FilterKey>("all");

  const counts = useMemo(
    () => ({
      all: records.length,
      present: records.filter((r) => r.status === "present").length,
      late: records.filter((r) => r.status === "late").length,
      absent: records.filter((r) => r.status === "absent").length,
      excused: records.filter((r) => r.status === "excused").length,
    }),
    [records],
  );

  const filtered = useMemo(() => {
    if (filter === "all") return records;
    return records.filter((r) => r.status === filter);
  }, [filter, records]);

  const { overall, required, present, absent, late, totalSessions } = summary;

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <div className="mb-8">
        <div
          className="border-l-[3px] pl-5"
          style={{ borderColor: lmsTokens.gold500 }}
        >
          <p
            className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: lmsTokens.gold500 }}
          >
            Student Portal
          </p>
          <h1
            className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]"
            style={{ color: lmsTokens.ink }}
          >
            Attendance
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: lmsTokens.slate }}>
            Monitor your session attendance across all enrolled programs.
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-4">
        <StatCard
          label="Overall Attendance"
          value={`${overall}%`}
          sub={`Required ${required}%`}
          accent={overall >= required ? lmsTokens.good : lmsTokens.warn}
          subPill
        />
        <StatCard
          label="Present"
          value={String(present)}
          sub={`of ${totalSessions} sessions`}
          accent={lmsTokens.good}
          subPill
        />
        <StatCard
          label="Late"
          value={String(late)}
          sub="Arrivals after start"
          accent={lmsTokens.warn}
        />
        <StatCard
          label="Absent"
          value={String(absent)}
          sub={absent > 0 ? "Contact faculty" : "Great record"}
          accent={absent > 0 ? lmsTokens.bad : lmsTokens.good}
          subPill={absent === 0}
        />
      </div>

      <section className="lms-panel-card p-5 sm:p-6">
        <DashboardPanelHead
          title="Attendance History"
          icon={<CalendarCheckIcon size={16} color={lmsTokens.gold500} />}
          badge={
            overall >= required ? (
              <span
                className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: lmsBrandPill.bg,
                  color: lmsBrandPill.fg,
                }}
              >
                Above required
              </span>
            ) : undefined
          }
        />

        <div className="mb-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: filter === key ? lmsTokens.gold500 : "transparent",
                color: filter === key ? lmsTokens.navy900 : lmsTokens.slate,
                border: `1px solid ${filter === key ? lmsTokens.gold500 : lmsTokens.line}`,
              }}
            >
              {label}
              {key !== "all" ? ` (${counts[key]})` : ""}
            </button>
          ))}
        </div>

        <ul className="space-y-2.5">
          {filtered.length === 0 ? (
            <li className="py-10 text-center text-sm" style={{ color: lmsTokens.slate }}>
              No records for this filter.
            </li>
          ) : (
            filtered.map((record) => (
              <li
                key={record.id}
                className="flex flex-col gap-2 rounded-lg border border-nlsc-gold/15 px-4 py-3 transition-colors hover:bg-nlsc-gold/5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-medium leading-tight"
                    style={{ color: lmsTokens.ink }}
                  >
                    {record.session}
                  </p>
                  <p
                    className="mt-0.5 text-xs leading-tight"
                    style={{ color: lmsTokens.slate }}
                  >
                    {record.course} · {record.date} · {record.time}
                  </p>
                </div>
                <div className="shrink-0 self-start sm:self-center">
                  <AttendanceBadge status={record.status} />
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
