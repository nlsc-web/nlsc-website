"use client";

import {
  EditUserModal,
  EnrollStudentModal,
} from "@/components/portal/lms/AdminActionModals";
import {
  ChevronRightIcon,
  GraduationCapIcon,
  MoreHorizontalIcon,
  UserPlusIcon,
} from "@/components/portal/lms/icons";
import StatCard from "@/components/portal/lms/StatCard";
import UserStatusBadge from "@/components/portal/lms/UserStatusBadge";
import { deleteAdminUser } from "@/lib/portal/admin-api";
import {
  getInitials,
  type AdminStudent,
} from "@/lib/portal/admin-data";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import { useMemo, useState } from "react";

type FilterKey = "all" | "active" | "pending" | "suspended";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Students" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "suspended", label: "Suspended" },
];

type AdminStudentsViewProps = {
  students: AdminStudent[];
  courses: Array<{ id: string; code: string; title: string }>;
  onAddStudent?: () => void;
  onChanged?: () => Promise<void> | void;
};

export default function AdminStudentsView({
  students,
  courses,
  onAddStudent,
  onChanged,
}: AdminStudentsViewProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState<AdminStudent | null>(null);
  const [editing, setEditing] = useState<AdminStudent | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      all: students.length,
      active: students.filter((s) => s.status === "active").length,
      pending: students.filter((s) => s.status === "pending").length,
      suspended: students.filter((s) => s.status === "suspended").length,
    }),
    [students],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((student) => {
      const matchesFilter = filter === "all" || student.status === filter;
      const matchesQuery =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.id.toLowerCase().includes(q) ||
        student.program.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, students]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this student permanently?")) return;
    setBusyId(id);
    setMenuOpenId(null);
    try {
      await deleteAdminUser(id);
      await onChanged?.();
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      {enrolling && (
        <EnrollStudentModal
          student={{ id: enrolling.id, name: enrolling.name }}
          courses={courses}
          onClose={() => setEnrolling(null)}
          onEnrolled={async () => {
            await onChanged?.();
          }}
        />
      )}
      {editing && (
        <EditUserModal
          user={{
            id: editing.id,
            name: editing.name,
            email: editing.email,
            role: "student",
          }}
          onClose={() => setEditing(null)}
          onSaved={async () => {
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
            Student Management
          </h1>
          <p className="mt-1 text-xs sm:mt-1.5 sm:text-sm" style={{ color: lmsTokens.slate }}>
            View, search, and manage enrolled students across all programs.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddStudent}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-nlsc-gold bg-nlsc-gold px-4 py-2.5 text-xs font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text sm:flex-none"
        >
          <UserPlusIcon size={14} />
          Add Student
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:mb-8 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Total Students" value={String(counts.all)} />
        <StatCard
          label="Active"
          value={String(counts.active)}
          sub="Currently enrolled"
          accent={lmsTokens.good}
          subPill
        />
        <StatCard
          label="Pending"
          value={String(counts.pending)}
          sub="Awaiting approval"
          accent={lmsTokens.warn}
          subPill
        />
        <StatCard
          label="Suspended"
          value={String(counts.suspended)}
          sub="Access restricted"
          accent={lmsTokens.bad}
        />
      </div>

      <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <GraduationCapIcon size={18} color={lmsTokens.gold500} />
            <h2 className="text-sm font-semibold" style={{ color: lmsTokens.ink }}>
              All Students
            </h2>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ backgroundColor: lmsTokens.gold100, color: lmsTokens.navy800 }}
            >
              {filtered.length}
            </span>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, ID, program..."
            className="w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-nlsc-gold/50 sm:w-64"
            style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {filters.map((item) => {
            const active = filter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className="rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors"
                style={{
                  backgroundColor: active ? lmsTokens.gold500 : lmsTokens.gold100,
                  color: active ? lmsTokens.navy900 : lmsTokens.navy800,
                }}
              >
                {item.label} ({counts[item.key]})
              </button>
            );
          })}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr
                className="border-b text-[10px] font-bold uppercase tracking-wider"
                style={{ borderColor: lmsTokens.line, color: lmsTokens.slate }}
              >
                <th className="pb-3 pr-2 font-bold">Student</th>
                <th className="hidden pb-3 font-bold md:table-cell">ID</th>
                <th className="pb-3 font-bold">Program</th>
                <th className="hidden pb-3 font-bold lg:table-cell">Attendance</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="hidden pb-3 font-bold sm:table-cell">Joined</th>
                <th className="pb-3 text-right font-bold"> </th>
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
                    No students match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    busy={busyId === student.id}
                    menuOpen={menuOpenId === student.id}
                    onToggleMenu={() =>
                      setMenuOpenId((current) =>
                        current === student.id ? null : student.id,
                      )
                    }
                    onEnroll={() => {
                      setMenuOpenId(null);
                      setEnrolling(student);
                    }}
                    onEdit={() => {
                      setMenuOpenId(null);
                      setEditing(student);
                    }}
                    onDelete={() => handleDelete(student.id)}
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
            Showing {filtered.length} of {students.length} students
          </span>
          <button
            type="button"
            className="flex items-center gap-1 font-semibold transition-opacity hover:opacity-80"
            style={{ color: lmsTokens.gold500 }}
          >
            Export list <ChevronRightIcon size={13} />
          </button>
        </div>
      </section>
    </>
  );
}

function StudentRow({
  student,
  busy,
  menuOpen,
  onToggleMenu,
  onEnroll,
  onEdit,
  onDelete,
}: {
  student: AdminStudent;
  busy: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onEnroll: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
            {getInitials(student.name)}
          </div>
          <div className="min-w-0">
            <div
              className="truncate text-xs font-medium sm:text-sm"
              style={{ color: lmsTokens.ink }}
            >
              {student.name}
            </div>
            <div
              className="truncate text-[11px] md:hidden"
              style={{ color: lmsTokens.slate }}
            >
              {student.id}
            </div>
            <div
              className="hidden truncate text-[11px] lg:hidden md:block"
              style={{ color: lmsTokens.slate }}
            >
              {student.email}
            </div>
          </div>
        </div>
      </td>
      <td
        className="hidden py-3.5 font-mono text-xs md:table-cell"
        style={{ color: lmsTokens.slate }}
      >
        {student.id}
      </td>
      <td className="py-3 sm:py-3.5">
        <span
          className="rounded px-2 py-0.5 text-[11px] font-semibold"
          style={{ backgroundColor: lmsTokens.gold100, color: lmsTokens.navy800 }}
        >
          {student.program}
        </span>
      </td>
      <td
        className="hidden py-3.5 font-medium lg:table-cell"
        style={{ color: lmsTokens.ink }}
      >
        {student.attendance}
      </td>
      <td className="py-3 sm:py-3.5">
        <UserStatusBadge status={student.status} />
      </td>
      <td
        className="hidden py-3.5 text-xs sm:table-cell"
        style={{ color: lmsTokens.slate }}
      >
        {student.joined}
      </td>
      <td className="relative py-3 text-right sm:py-3.5">
        <button
          type="button"
          disabled={busy}
          onClick={onToggleMenu}
          className="rounded p-1 hover:bg-neutral-100 disabled:opacity-60"
          aria-label={`Actions for ${student.name}`}
        >
          <MoreHorizontalIcon size={16} color={lmsTokens.slate} />
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 z-20 mt-1 w-40 rounded-lg border bg-white py-1 text-left shadow-lg"
            style={{ borderColor: lmsTokens.line }}
          >
            <button
              type="button"
              className="block w-full px-3 py-2 text-left text-xs font-semibold hover:bg-nlsc-gold/5"
              style={{ color: lmsTokens.ink }}
              onClick={onEnroll}
            >
              Enroll in course
            </button>
            <button
              type="button"
              className="block w-full px-3 py-2 text-left text-xs font-semibold hover:bg-nlsc-gold/5"
              style={{ color: lmsTokens.ink }}
              onClick={onEdit}
            >
              Edit
            </button>
            <button
              type="button"
              className="block w-full px-3 py-2 text-left text-xs font-semibold text-red-700 hover:bg-red-50"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
