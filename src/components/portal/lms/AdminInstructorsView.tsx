"use client";

import {
  ChevronRightIcon,
  MoreHorizontalIcon,
  UserPlusIcon,
  UsersIcon,
} from "@/components/portal/lms/icons";
import StatCard from "@/components/portal/lms/StatCard";
import UserStatusBadge from "@/components/portal/lms/UserStatusBadge";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import {
  getInitials,
  type AdminInstructor,
  type UserStatus,
} from "@/lib/portal/admin-data";
import { patchAdminUserStatus } from "@/lib/portal/admin-api";
import { useMemo, useState } from "react";

type FilterKey = "all" | "active" | "pending" | "suspended";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Instructors" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "suspended", label: "Suspended" },
];

type AdminInstructorsViewProps = {
  instructors: AdminInstructor[];
  onAddInstructor?: () => void;
  onChanged?: () => Promise<void> | void;
};

export default function AdminInstructorsView({
  instructors,
  onAddInstructor,
  onChanged,
}: AdminInstructorsViewProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      all: instructors.length,
      active: instructors.filter((i) => i.status === "active").length,
      pending: instructors.filter((i) => i.status === "pending").length,
      suspended: instructors.filter((i) => i.status === "suspended").length,
    }),
    [instructors],
  );

  const totalCourses = useMemo(
    () =>
      instructors
        .filter((i) => i.status === "active")
        .reduce((sum, i) => {
          if (!i.courses || i.courses === "—") return sum;
          return sum + i.courses.split("·").length;
        }, 0),
    [instructors],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return instructors.filter((instructor) => {
      const matchesFilter = filter === "all" || instructor.status === filter;
      const matchesQuery =
        !q ||
        instructor.name.toLowerCase().includes(q) ||
        instructor.id.toLowerCase().includes(q) ||
        instructor.department.toLowerCase().includes(q) ||
        instructor.courses.toLowerCase().includes(q) ||
        instructor.email.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, instructors]);

  async function handleStatusChange(id: string, status: UserStatus) {
    setBusyId(id);
    setMenuOpenId(null);
    try {
      await patchAdminUserStatus(id, status);
      await onChanged?.();
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div
          className="border-l-2 pl-4 sm:pl-5"
          style={{ borderColor: lmsTokens.gold500 }}
        >
          <p
            className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] sm:text-[11px]"
            style={{ color: lmsTokens.gold500 }}
          >
            Admin Portal
          </p>
          <h1
            className="text-xl font-semibold tracking-tight sm:text-2xl lg:text-[1.75rem]"
            style={{ color: lmsTokens.ink }}
          >
            Instructor Management
          </h1>
          <p
            className="mt-1 text-xs sm:mt-1.5 sm:text-sm"
            style={{ color: lmsTokens.slate }}
          >
            Manage faculty, course assignments, and instructor access.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddInstructor}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-nlsc-gold bg-nlsc-gold px-4 py-2.5 text-xs font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text sm:flex-none"
        >
          <UserPlusIcon size={14} />
          Add Instructor
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Total Instructors" value={String(counts.all)} />
        <StatCard
          label="Active"
          value={String(counts.active)}
          sub="Teaching this term"
          accent={lmsTokens.good}
          subPill
        />
        <StatCard
          label="Pending"
          value={String(counts.pending)}
          sub="Access requests"
          accent={lmsTokens.warn}
          subPill
        />
        <StatCard
          label="Course Assignments"
          value={String(totalCourses)}
          sub="Active instructors"
        />
      </div>

      <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <h2
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: lmsTokens.ink }}
          >
            <UsersIcon size={15} color={lmsTokens.gold500} />
            All Instructors
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor: lmsTokens.gold100,
                color: lmsTokens.navy800,
              }}
            >
              {filtered.length}
            </span>
          </h2>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, department, or course..."
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-nlsc-gold/50 sm:max-w-xs"
            style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
              style={{
                backgroundColor:
                  filter === key ? lmsTokens.gold500 : "transparent",
                color: filter === key ? lmsTokens.navy900 : lmsTokens.slate,
                border: `1px solid ${filter === key ? lmsTokens.gold500 : lmsTokens.line}`,
              }}
            >
              {label} ({counts[key]})
            </button>
          ))}
        </div>

        <div className="-mx-1 overflow-x-auto px-1">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr
                className="border-b text-left"
                style={{ borderColor: lmsTokens.line, color: lmsTokens.slate }}
              >
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Instructor
                </th>
                <th className="hidden pb-3 text-[10px] font-bold uppercase tracking-[0.1em] md:table-cell sm:text-[11px]">
                  ID
                </th>
                <th className="hidden pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:table-cell sm:text-[11px]">
                  Department
                </th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Courses
                </th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Status
                </th>
                <th className="hidden pb-3 text-[10px] font-bold uppercase tracking-[0.1em] lg:table-cell sm:text-[11px]">
                  Joined
                </th>
                <th className="pb-3 w-10" />
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
                    No instructors match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((instructor) => (
                  <InstructorRow
                    key={instructor.id}
                    instructor={instructor}
                    busy={busyId === instructor.id}
                    menuOpen={menuOpenId === instructor.id}
                    onToggleMenu={() =>
                      setMenuOpenId((current) =>
                        current === instructor.id ? null : instructor.id,
                      )
                    }
                    onStatusChange={handleStatusChange}
                  />
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
            Showing {filtered.length} of {instructors.length} instructors
          </span>
          <span className="flex items-center gap-1 font-semibold" style={{ color: lmsTokens.gold500 }}>
            Faculty roster <ChevronRightIcon size={13} />
          </span>
        </div>
      </section>
    </>
  );
}

function InstructorRow({
  instructor,
  busy,
  menuOpen,
  onToggleMenu,
  onStatusChange,
}: {
  instructor: AdminInstructor;
  busy: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onStatusChange: (id: string, status: UserStatus) => void;
}) {
  return (
    <tr className="transition-colors hover:bg-neutral-50/80">
      <td className="py-3 pr-2 sm:py-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold text-white"
            style={{
              backgroundColor: lmsTokens.navy900,
              borderColor: "rgb(212 175 55 / 0.35)",
            }}
          >
            {getInitials(instructor.name)}
          </div>
          <div className="min-w-0">
            <div
              className="truncate text-xs font-medium sm:text-sm"
              style={{ color: lmsTokens.ink }}
            >
              {instructor.name}
            </div>
            <div
              className="truncate text-[11px] md:hidden"
              style={{ color: lmsTokens.slate }}
            >
              {instructor.id}
            </div>
            <div
              className="hidden truncate text-[11px] sm:block md:hidden lg:block"
              style={{ color: lmsTokens.slate }}
            >
              {instructor.email}
            </div>
          </div>
        </div>
      </td>
      <td
        className="hidden py-3.5 font-mono text-xs md:table-cell"
        style={{ color: lmsTokens.slate }}
      >
        {instructor.id}
      </td>
      <td
        className="hidden py-3.5 text-xs sm:table-cell"
        style={{ color: lmsTokens.slate }}
      >
        {instructor.department}
      </td>
      <td className="py-3 sm:py-3.5">
        <span className="text-xs leading-snug" style={{ color: lmsTokens.ink }}>
          {instructor.courses}
        </span>
      </td>
      <td className="py-3 sm:py-3.5">
        <UserStatusBadge status={instructor.status} />
      </td>
      <td
        className="hidden py-3.5 text-xs lg:table-cell"
        style={{ color: lmsTokens.slate }}
      >
        {instructor.joined}
      </td>
      <td className="relative py-3 text-right sm:py-3.5">
        <button
          type="button"
          disabled={busy}
          onClick={onToggleMenu}
          className="rounded p-1 hover:bg-neutral-100 disabled:opacity-60"
          aria-label={`Actions for ${instructor.name}`}
        >
          <span className="inline-flex">
            <MoreHorizontalIcon size={16} color={lmsTokens.slate} />
          </span>
          {busy && (
            <span className="sr-only">Updating...</span>
          )}
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 z-20 mt-1 w-36 rounded-lg border bg-white py-1 text-left shadow-lg"
            style={{ borderColor: lmsTokens.line }}
          >
            {instructor.status !== "active" && (
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-xs font-semibold hover:bg-nlsc-gold/5"
                style={{ color: lmsTokens.ink }}
                onClick={() => onStatusChange(instructor.id, "active")}
              >
                Activate
              </button>
            )}
            {instructor.status !== "suspended" && (
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-xs font-semibold hover:bg-nlsc-gold/5"
                style={{ color: lmsTokens.ink }}
                onClick={() => onStatusChange(instructor.id, "suspended")}
              >
                Suspend
              </button>
            )}
            {instructor.status === "suspended" && (
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-xs font-semibold hover:bg-nlsc-gold/5"
                style={{ color: lmsTokens.ink }}
                onClick={() => onStatusChange(instructor.id, "pending")}
              >
                Set pending
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}
