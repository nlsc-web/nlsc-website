"use client";

import { ClipboardListIcon } from "@/components/portal/lms/icons";
import DashboardPanelHead from "@/components/portal/lms/DashboardPanelHead";
import StatCard from "@/components/portal/lms/StatCard";
import StatusBadge from "@/components/portal/lms/StatusBadge";
import { useMemo, useState } from "react";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import type {
  AssignmentStatus,
  StudentAssignment,
} from "@/lib/portal/types/student-portal";

type FilterKey = "all" | AssignmentStatus;

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "submitted", label: "Submitted" },
  { key: "overdue", label: "Overdue" },
];

type StudentAssignmentsViewProps = {
  assignments: StudentAssignment[];
};

export default function StudentAssignmentsView({
  assignments,
}: StudentAssignmentsViewProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      all: assignments.length,
      pending: assignments.filter((a) => a.status === "pending").length,
      submitted: assignments.filter((a) => a.status === "submitted").length,
      overdue: assignments.filter((a) => a.status === "overdue").length,
    }),
    [assignments],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assignments.filter((assignment) => {
      const matchesFilter = filter === "all" || assignment.status === filter;
      const matchesQuery =
        !q ||
        assignment.title.toLowerCase().includes(q) ||
        assignment.course.toLowerCase().includes(q) ||
        assignment.type.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, assignments]);

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
            Assignments
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: lmsTokens.slate }}>
            Track due dates, submissions, and pending work across your courses.
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total" value={String(counts.all)} />
        <StatCard
          label="Pending"
          value={String(counts.pending)}
          sub="Needs action"
          accent={lmsTokens.warn}
          subPill
        />
        <StatCard
          label="Submitted"
          value={String(counts.submitted)}
          sub="Completed"
          accent={lmsTokens.good}
          subPill
        />
        <StatCard
          label="Overdue"
          value={String(counts.overdue)}
          sub={counts.overdue > 0 ? "Submit ASAP" : "None"}
          accent={counts.overdue > 0 ? lmsTokens.bad : lmsTokens.good}
          subPill={counts.overdue > 0}
        />
      </div>

      <section className="lms-panel-card p-5 sm:p-6">
        <DashboardPanelHead
          title="All Assignments"
          icon={<ClipboardListIcon size={16} color={lmsTokens.gold500} />}
          action={
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assignments..."
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-nlsc-gold/50 sm:w-52"
              style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
            />
          }
        />

        <div className="mb-4 flex flex-wrap gap-2">
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
              {label} ({counts[key]})
            </button>
          ))}
        </div>

        <div className="-mx-1 overflow-x-auto px-1">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr
                className="border-b text-left"
                style={{ borderColor: lmsTokens.line, color: lmsTokens.slate }}
              >
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Assignment
                </th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Course
                </th>
                <th className="hidden pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:table-cell sm:text-[11px]">
                  Type
                </th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Due
                </th>
                <th className="hidden pb-3 text-[10px] font-bold uppercase tracking-[0.1em] md:table-cell sm:text-[11px]">
                  Points
                </th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Status
                </th>
                <th className="pb-3 w-24 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: lmsTokens.line }}>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-sm"
                    style={{ color: lmsTokens.slate }}
                  >
                    No assignments match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="transition-colors hover:bg-nlsc-gold/5"
                  >
                    <td className="py-3.5 pr-2">
                      <p
                        className="font-medium leading-tight"
                        style={{ color: lmsTokens.ink }}
                      >
                        {assignment.title}
                      </p>
                    </td>
                    <td className="py-3.5">
                      <span
                        className="rounded px-2 py-0.5 text-[11px] font-semibold"
                        style={{
                          backgroundColor: lmsTokens.gold100,
                          color: lmsTokens.navy800,
                        }}
                      >
                        {assignment.course}
                      </span>
                    </td>
                    <td
                      className="hidden py-3.5 text-xs sm:table-cell"
                      style={{ color: lmsTokens.slate }}
                    >
                      {assignment.type}
                    </td>
                    <td className="py-3.5 text-xs font-medium" style={{ color: lmsTokens.ink }}>
                      {assignment.due}
                    </td>
                    <td
                      className="hidden py-3.5 text-xs md:table-cell"
                      style={{ color: lmsTokens.slate }}
                    >
                      {assignment.points} pts
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={assignment.status} />
                    </td>
                    <td className="py-3.5">
                      {assignment.status === "submitted" ? (
                        <span className="text-xs" style={{ color: lmsTokens.slate }}>
                          View
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="rounded-md border border-nlsc-gold bg-nlsc-gold px-3 py-1.5 text-xs font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text"
                        >
                          Submit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div
          className="mt-4 flex items-center justify-between border-t pt-4 text-xs"
          style={{ borderColor: lmsTokens.line, color: lmsTokens.slate }}
        >
          <span>
            Showing {filtered.length} of {assignments.length} assignments
          </span>
        </div>
      </section>
    </div>
  );
}
