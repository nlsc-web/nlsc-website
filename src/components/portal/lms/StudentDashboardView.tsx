"use client";

import {
  BookOpenIcon,
  CalendarCheckIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  MegaphoneIcon,
  SettingsIcon,
} from "@/components/portal/lms/icons";
import DashboardPanelHead from "@/components/portal/lms/DashboardPanelHead";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import PortalShell from "@/components/portal/lms/PortalShell";
import PortalSettingsView from "@/components/portal/lms/PortalSettingsView";
import StatCard from "@/components/portal/lms/StatCard";
import StatusBadge from "@/components/portal/lms/StatusBadge";
import StudentAssignmentsView from "@/components/portal/lms/StudentAssignmentsView";
import StudentAttendanceView from "@/components/portal/lms/StudentAttendanceView";
import StudentCoursesView from "@/components/portal/lms/StudentCoursesView";
import { lmsBrandPill, lmsTokens } from "@/lib/portal/lms-tokens";
import { getDashboardGreeting } from "@/lib/portal/student-data";
import type { StudentPortalData } from "@/lib/portal/types/student-portal";

type StudentDashboardViewProps = {
  studentName: string;
  studentId: string;
  portalData: StudentPortalData;
};

const navItems = [
  { icon: LayoutDashboardIcon, label: "Dashboard" },
  { icon: BookOpenIcon, label: "My Courses" },
  { icon: ClipboardListIcon, label: "Assignments" },
  { icon: CalendarCheckIcon, label: "Attendance" },
  { icon: SettingsIcon, label: "Settings" },
];

function StudentDashboardHome({
  greeting,
  portalData,
  onNavigate,
}: {
  greeting: string;
  portalData: StudentPortalData;
  onNavigate: (label: string) => void;
}) {
  const { courses, assignments, announcements, attendance } = portalData;

  const pendingCount = assignments.filter(
    (item) => item.status === "pending",
  ).length;

  const sortedAssignments = [...assignments].sort((a, b) => {
    const order = { pending: 0, overdue: 1, submitted: 2 };
    return order[a.status] - order[b.status];
  });

  const attendanceSub =
    attendance.summary.overall >= attendance.summary.required
      ? `Above required ${attendance.summary.required}%`
      : `Required ${attendance.summary.required}%`;

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      {/* Page header — admin-style with actions */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div
          className="border-l-[3px] pl-5"
          style={{ borderColor: lmsTokens.gold500 }}
        >
          <p
            className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: lmsTokens.gold500 }}
          >
            Student Dashboard
          </p>
          <h1
            className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]"
            style={{ color: lmsTokens.ink }}
            suppressHydrationWarning
          >
            {greeting}
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: lmsTokens.slate }}>
            Here&apos;s where things stand for your NLSC programs.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate("My Courses")}
            className="inline-flex items-center gap-2 rounded-lg border border-nlsc-gold/25 bg-white px-5 py-2.5 text-sm font-semibold transition-colors hover:border-nlsc-gold/55 hover:bg-nlsc-gold/5"
            style={{ color: lmsTokens.ink }}
          >
            <BookOpenIcon size={15} />
            My Courses
          </button>
          <button
            type="button"
            onClick={() => onNavigate("Assignments")}
            className="inline-flex items-center gap-2 rounded-lg border border-nlsc-gold bg-nlsc-gold px-5 py-2.5 text-sm font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text"
          >
            <ClipboardListIcon size={15} />
            Assignments
          </button>
        </div>
      </div>

      {/* KPI row — full stat cards like admin */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Enrolled Courses"
          value={String(courses.length)}
          sub="Active programs"
          accent={lmsTokens.gold500}
          subPill
        />
        <StatCard
          label="Pending Assignments"
          value={String(pendingCount)}
          sub={pendingCount > 0 ? "Check due dates below" : "All caught up"}
          accent={pendingCount > 0 ? lmsTokens.warn : lmsTokens.good}
          subPill
        />
        <StatCard
          label="Attendance"
          value={`${attendance.summary.overall}%`}
          sub={attendanceSub}
          accent={lmsTokens.good}
          subPill
        />
      </div>

      {/* Main grid — admin 8+4 layout */}
      <div className="grid gap-6 xl:grid-cols-12 xl:items-start">
        <div className="space-y-6 xl:col-span-8">
          {/* My Courses — full-width panel */}
          <section className="lms-panel-card p-5 sm:p-6">
            <DashboardPanelHead
              title="My Courses"
              icon={<BookOpenIcon size={16} color={lmsTokens.gold500} />}
              action={
                <button
                  type="button"
                  onClick={() => onNavigate("My Courses")}
                  className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ color: lmsTokens.gold500 }}
                >
                  View all <ChevronRightIcon size={13} />
                </button>
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/portal/dashboard/courses/${course.id}`}
                  className="group rounded-lg border border-nlsc-gold/15 p-4 transition-colors hover:border-nlsc-gold/40 hover:bg-nlsc-gold/5"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span
                      className="rounded px-2 py-0.5 text-[11px] font-semibold"
                      style={{
                        backgroundColor: lmsBrandPill.bg,
                        color: lmsBrandPill.fg,
                      }}
                    >
                      {course.code}
                    </span>
                    <span
                      className="text-xs font-semibold tabular-nums"
                      style={{ color: lmsTokens.gold600 }}
                    >
                      {course.progress}%
                    </span>
                  </div>
                  <p
                    className="text-sm font-semibold leading-snug"
                    style={{ color: lmsTokens.ink }}
                  >
                    {course.name}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: lmsTokens.slate }}>
                    {course.instructor}
                  </p>
                  <div
                    className="mt-3 h-1.5 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: lmsTokens.gold100 }}
                  >
                    <div
                      className="h-full rounded-full transition-all group-hover:opacity-90"
                      style={{
                        width: `${course.progress}%`,
                        backgroundColor: course.color,
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Upcoming Assignments */}
          <section className="lms-panel-card p-5 sm:p-6">
            <DashboardPanelHead
              title="Upcoming Assignments"
              icon={<ClipboardListIcon size={16} color={lmsTokens.gold500} />}
              badge={
                pendingCount > 0 ? (
                  <span
                    className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: lmsBrandPill.bg,
                      color: lmsBrandPill.fg,
                    }}
                  >
                    {pendingCount} pending
                  </span>
                ) : undefined
              }
              action={
                <button
                  type="button"
                  onClick={() => onNavigate("Assignments")}
                  className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ color: lmsTokens.gold500 }}
                >
                  View all <ChevronRightIcon size={13} />
                </button>
              }
            />
            <ul className="space-y-2.5">
              {sortedAssignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="flex items-center gap-3 rounded-lg border border-nlsc-gold/15 px-3 py-3 transition-colors hover:bg-nlsc-gold/5"
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-sm font-medium leading-tight"
                      style={{ color: lmsTokens.ink }}
                    >
                      {assignment.title}
                    </p>
                    <p
                      className="mt-0.5 truncate text-xs leading-tight"
                      style={{ color: lmsTokens.slate }}
                    >
                      {assignment.course} · Due {assignment.due}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <StatusBadge status={assignment.status} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right sidebar — announcements + schedule */}
        <aside className="space-y-6 xl:col-span-4">
          <section className="lms-panel-card p-5 sm:p-6">
            <DashboardPanelHead
              title="Announcements"
              icon={<MegaphoneIcon size={16} color={lmsTokens.gold500} />}
              badge={
                <span
                  className="flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold"
                  style={{
                    backgroundColor: lmsTokens.gold500,
                    color: lmsTokens.navy900,
                  }}
                >
                  {announcements.length}
                </span>
              }
            />
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div
                  key={`${announcement.from}-${announcement.time}`}
                  className="rounded-lg border border-nlsc-gold/20 bg-nlsc-gold/5 p-4"
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: lmsTokens.gold600 }}
                  >
                    {announcement.from}
                  </span>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: lmsTokens.ink }}
                  >
                    {announcement.text}
                  </p>
                  <span
                    className="mt-2 inline-block text-xs"
                    style={{ color: lmsTokens.slate }}
                  >
                    {announcement.time}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function StudentMainContent({
  active,
  studentName,
  studentId,
  greeting,
  portalData,
  searchQuery,
  onNavigate,
}: {
  active: string;
  studentName: string;
  studentId: string;
  greeting: string;
  portalData: StudentPortalData;
  searchQuery: string;
  onNavigate: (label: string) => void;
}) {
  const q = searchQuery.trim().toLowerCase();
  const filteredCourses = useMemo(() => {
    if (!q) return portalData.courses;
    return portalData.courses.filter(
      (course) =>
        course.name.toLowerCase().includes(q) ||
        course.code.toLowerCase().includes(q) ||
        course.instructor.toLowerCase().includes(q),
    );
  }, [portalData.courses, q]);

  const filteredAssignments = useMemo(() => {
    if (!q) return portalData.assignments;
    return portalData.assignments.filter(
      (assignment) =>
        assignment.title.toLowerCase().includes(q) ||
        assignment.course.toLowerCase().includes(q) ||
        assignment.type.toLowerCase().includes(q),
    );
  }, [portalData.assignments, q]);

  switch (active) {
    case "Dashboard":
      return (
        <StudentDashboardHome
          greeting={greeting}
          portalData={portalData}
          onNavigate={onNavigate}
        />
      );
    case "My Courses":
      return <StudentCoursesView courses={filteredCourses} />;
    case "Assignments":
      return <StudentAssignmentsView assignments={filteredAssignments} />;
    case "Attendance":
      return <StudentAttendanceView attendance={portalData.attendance} />;
    case "Settings":
      return (
        <PortalSettingsView
          userName={studentName}
          userId={studentId}
          roleLabel="Student"
        />
      );
    default:
      return (
        <StudentDashboardHome
          greeting={greeting}
          portalData={portalData}
          onNavigate={onNavigate}
        />
      );
  }
}

export default function StudentDashboardView({
  studentName,
  studentId,
  portalData,
}: StudentDashboardViewProps) {
  const router = useRouter();
  const [active, setActive] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const greeting = getDashboardGreeting(studentName);

  async function handleLogout() {
    await fetch("/api/portal/logout", { method: "POST" });
    router.push("/portal");
    router.refresh();
  }

  function handleNavigate(label: string) {
    setActive(label);
    if (label === "Dashboard") {
      setSearchQuery("");
    }
  }

  return (
    <PortalShell
      userName={studentName}
      userId={studentId}
      roleLabel="Student"
      searchPlaceholder="Search courses, assignments..."
      searchValue={searchQuery}
      onSearchChange={(value) => {
        setSearchQuery(value);
        if (value.trim().length >= 2 && active === "Dashboard") {
          setActive("My Courses");
        }
      }}
      navItems={navItems}
      active={active}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      <StudentMainContent
        active={active}
        studentName={studentName}
        studentId={studentId}
        greeting={greeting}
        portalData={portalData}
        searchQuery={searchQuery}
        onNavigate={handleNavigate}
      />
    </PortalShell>
  );
}
