"use client";

import { ManageModulesModal } from "@/components/portal/lms/AdminActionModals";
import {
  ChevronRightIcon,
  FolderKanbanIcon,
  MoreHorizontalIcon,
} from "@/components/portal/lms/icons";
import StatCard from "@/components/portal/lms/StatCard";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import {
  type AdminCourse,
  type CourseStatus,
} from "@/lib/portal/admin-data";
import {
  deleteAdminCourse,
  patchAdminCourseStatus,
} from "@/lib/portal/admin-api";
import { useMemo, useState } from "react";

type FilterKey = "all" | CourseStatus;

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Courses" },
  { key: "active", label: "Active" },
  { key: "draft", label: "Draft" },
  { key: "pending", label: "Pending" },
];

const statusStyles: Record<
  CourseStatus,
  { bg: string; fg: string; label: string }
> = {
  active: { bg: "#e6f2ec", fg: lmsTokens.good, label: "Active" },
  draft: { bg: "#f4f4f4", fg: lmsTokens.slate, label: "Draft" },
  pending: { bg: "#fbf0df", fg: lmsTokens.warn, label: "Pending" },
};

function CourseStatusBadge({ status }: { status: CourseStatus }) {
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

export default function AdminCoursesView({
  courses: adminCourses,
  onNewCourse,
  onChanged,
}: {
  courses: AdminCourse[];
  onNewCourse?: () => void;
  onChanged?: () => Promise<void> | void;
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [managingModules, setManagingModules] = useState<AdminCourse | null>(
    null,
  );

  const counts = useMemo(
    () => ({
      all: adminCourses.length,
      active: adminCourses.filter((c) => c.status === "active").length,
      draft: adminCourses.filter((c) => c.status === "draft").length,
      pending: adminCourses.filter((c) => c.status === "pending").length,
    }),
    [adminCourses],
  );

  const totalEnrolled = useMemo(
    () => adminCourses.reduce((sum, c) => sum + c.enrolled, 0),
    [adminCourses],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return adminCourses.filter((course) => {
      const matchesFilter = filter === "all" || course.status === filter;
      const matchesQuery =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.code.toLowerCase().includes(q) ||
        course.instructor.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, adminCourses]);

  async function handleStatusChange(id: string, status: CourseStatus) {
    setBusyId(id);
    setMenuOpenId(null);
    try {
      await patchAdminCourseStatus(id, status);
      await onChanged?.();
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    setMenuOpenId(null);
    try {
      await deleteAdminCourse(id);
      await onChanged?.();
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      {managingModules && (
        <ManageModulesModal
          course={{ id: managingModules.id, title: managingModules.title }}
          onClose={() => setManagingModules(null)}
          onChanged={async () => {
            await onChanged?.();
          }}
        />
      )}
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
            Course Management
          </h1>
          <p
            className="mt-1 text-xs sm:mt-1.5 sm:text-sm"
            style={{ color: lmsTokens.slate }}
          >
            Create, edit, and manage programs across all NLSC batches.
          </p>
        </div>
        <button
          type="button"
          onClick={onNewCourse}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-nlsc-gold bg-nlsc-gold px-4 py-2.5 text-xs font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text sm:flex-none"
        >
          <FolderKanbanIcon size={14} />
          New Course
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:mb-8 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Total Courses" value={String(counts.all)} />
        <StatCard
          label="Active"
          value={String(counts.active)}
          sub="Live programs"
          accent={lmsTokens.good}
          subPill
        />
        <StatCard
          label="Draft"
          value={String(counts.draft)}
          sub="Not published"
          accent={lmsTokens.slate}
        />
        <StatCard
          label="Total Enrolled"
          value={String(totalEnrolled)}
          sub="Across all courses"
          accent={lmsTokens.gold500}
        />
      </div>

      <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <h2
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: lmsTokens.ink }}
          >
            <FolderKanbanIcon size={15} color={lmsTokens.gold500} />
            All Courses
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
            placeholder="Search by title, code, or instructor..."
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-nlsc-gold/50 sm:max-w-xs"
            style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
          />
        </div>

        <div className="mb-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
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

        <div className="lms-table-scroll -mx-1 px-1">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr
                className="border-b text-left"
                style={{ borderColor: lmsTokens.line, color: lmsTokens.slate }}
              >
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Course
                </th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Code
                </th>
                <th className="hidden pb-3 text-[10px] font-bold uppercase tracking-[0.1em] md:table-cell sm:text-[11px]">
                  Duration
                </th>
                <th className="hidden pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:table-cell sm:text-[11px]">
                  Instructor
                </th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Enrolled
                </th>
                <th className="hidden pb-3 text-[10px] font-bold uppercase tracking-[0.1em] lg:table-cell sm:text-[11px]">
                  Modules
                </th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Status
                </th>
                <th className="pb-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: lmsTokens.line }}>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-sm"
                    style={{ color: lmsTokens.slate }}
                  >
                    No courses match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((course) => (
                  <CourseRow
                    key={course.id}
                    course={course}
                    busy={busyId === course.id}
                    menuOpen={menuOpenId === course.id}
                    onToggleMenu={() =>
                      setMenuOpenId((current) =>
                        current === course.id ? null : course.id,
                      )
                    }
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onManageModules={() => {
                      setMenuOpenId(null);
                      setManagingModules(course);
                    }}
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
            Showing {filtered.length} of {adminCourses.length} courses
          </span>
          <span
            className="flex items-center gap-1 font-semibold"
            style={{ color: lmsTokens.gold500 }}
          >
            Course catalog <ChevronRightIcon size={13} />
          </span>
        </div>
      </section>
    </>
  );
}

function CourseRow({
  course,
  busy,
  menuOpen,
  onToggleMenu,
  onStatusChange,
  onDelete,
  onManageModules,
}: {
  course: AdminCourse;
  busy: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onStatusChange: (id: string, status: CourseStatus) => void;
  onDelete: (id: string) => void;
  onManageModules: () => void;
}) {
  return (
    <tr className="transition-colors hover:bg-neutral-50/80">
      <td className="py-3 pr-2 sm:py-3.5">
        <div className="min-w-0">
          <div
            className="truncate text-xs font-medium sm:text-sm"
            style={{ color: lmsTokens.ink }}
          >
            {course.title}
          </div>
          <div
            className="mt-0.5 truncate text-[11px] md:hidden"
            style={{ color: lmsTokens.slate }}
          >
            {course.duration} · {course.instructor}
          </div>
          <div
            className="mt-0.5 hidden truncate text-[11px] sm:block md:hidden"
            style={{ color: lmsTokens.slate }}
          >
            Updated {course.updated}
          </div>
        </div>
      </td>
      <td className="py-3 sm:py-3.5">
        <span
          className="rounded px-2 py-0.5 text-[11px] font-semibold"
          style={{
            backgroundColor: lmsTokens.gold100,
            color: lmsTokens.navy800,
          }}
        >
          {course.code}
        </span>
      </td>
      <td
        className="hidden py-3.5 text-xs md:table-cell"
        style={{ color: lmsTokens.slate }}
      >
        {course.duration}
      </td>
      <td
        className="hidden py-3.5 text-xs sm:table-cell"
        style={{ color: lmsTokens.slate }}
      >
        {course.instructor}
      </td>
      <td
        className="py-3 font-semibold sm:py-3.5"
        style={{ color: lmsTokens.ink }}
      >
        {course.enrolled}
      </td>
      <td
        className="hidden py-3.5 text-xs lg:table-cell"
        style={{ color: lmsTokens.slate }}
      >
        {course.modules} modules
      </td>
      <td className="py-3 sm:py-3.5">
        <CourseStatusBadge status={course.status} />
      </td>
      <td className="relative py-3 text-right sm:py-3.5">
        <button
          type="button"
          disabled={busy}
          onClick={onToggleMenu}
          className="rounded p-1 hover:bg-neutral-100 disabled:opacity-60"
          aria-label={`Actions for ${course.title}`}
        >
          <MoreHorizontalIcon size={16} color={lmsTokens.slate} />
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 z-20 mt-1 w-36 rounded-lg border bg-white py-1 text-left shadow-lg"
            style={{ borderColor: lmsTokens.line }}
          >
            {course.status !== "active" && (
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-xs font-semibold hover:bg-nlsc-gold/5"
                style={{ color: lmsTokens.ink }}
                onClick={() => onStatusChange(course.id, "active")}
              >
                Set active
              </button>
            )}
            {course.status !== "draft" && (
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-xs font-semibold hover:bg-nlsc-gold/5"
                style={{ color: lmsTokens.ink }}
                onClick={() => onStatusChange(course.id, "draft")}
              >
                Set draft
              </button>
            )}
            {course.status !== "pending" && (
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-xs font-semibold hover:bg-nlsc-gold/5"
                style={{ color: lmsTokens.ink }}
                onClick={() => onStatusChange(course.id, "pending")}
              >
                Set pending
              </button>
            )}
            <button
              type="button"
              className="block w-full px-3 py-2 text-left text-xs font-semibold hover:bg-nlsc-gold/5"
              style={{ color: lmsTokens.ink }}
              onClick={onManageModules}
            >
              Manage modules
            </button>
            <button
              type="button"
              className="block w-full px-3 py-2 text-left text-xs font-semibold text-red-700 hover:bg-red-50"
              onClick={() => onDelete(course.id)}
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
