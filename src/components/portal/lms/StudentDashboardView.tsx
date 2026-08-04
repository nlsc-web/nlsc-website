"use client";

import {
  BookOpenIcon,
  CalendarCheckIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  ClockIcon,
  LayoutDashboardIcon,
  MegaphoneIcon,
} from "@/components/portal/lms/icons";
import GradeSummaryChart from "@/components/portal/lms/GradeSummaryChart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PortalShell from "@/components/portal/lms/PortalShell";
import StatCard from "@/components/portal/lms/StatCard";
import StatusBadge from "@/components/portal/lms/StatusBadge";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import {
  getGreetingName,
  gradeData,
  studentAnnouncements,
  studentAssignments,
  studentCourses,
  weekSchedule,
} from "@/lib/portal/student-data";

type StudentDashboardViewProps = {
  studentName: string;
  studentId: string;
};

export default function StudentDashboardView({
  studentName,
  studentId,
}: StudentDashboardViewProps) {
  const router = useRouter();
  const [active, setActive] = useState("Dashboard");
  const firstName = getGreetingName(studentName);
  const pendingCount = studentAssignments.filter(
    (item) => item.status === "pending",
  ).length;

  const navItems = [
    { icon: LayoutDashboardIcon, label: "Dashboard" },
    { icon: BookOpenIcon, label: "My Courses" },
    { icon: ClipboardListIcon, label: "Assignments" },
    { icon: CalendarCheckIcon, label: "Attendance" },
  ];

  async function handleLogout() {
    await fetch("/api/portal/logout", { method: "POST" });
    router.push("/portal");
    router.refresh();
  }

  return (
    <PortalShell
      userName={studentName}
      userId={studentId}
      navItems={navItems}
      active={active}
      onNavigate={setActive}
      onLogout={handleLogout}
    >
      <div className="mb-6">
        <h1
          className="text-2xl"
          style={{ color: lmsTokens.ink, fontFamily: "Georgia, serif" }}
        >
          Good morning, {firstName}
        </h1>
        <p className="mt-1 text-sm" style={{ color: lmsTokens.slate }}>
          Here&apos;s where things stand for your NLSC programs.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Enrolled Courses" value={String(studentCourses.length)} />
        <StatCard
          label="Pending Assignments"
          value={String(pendingCount)}
          sub="Check due dates below"
          accent={lmsTokens.warn}
        />
        <StatCard
          label="Attendance"
          value="92%"
          sub="Above required 80%"
          accent={lmsTokens.good}
        />
        <StatCard
          label="Average Grade"
          value="78%"
          sub="Across enrolled courses"
          accent={lmsTokens.good}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section
            className="rounded-lg border bg-white p-5"
            style={{ borderColor: lmsTokens.line }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold" style={{ color: lmsTokens.ink }}>
                My Courses
              </h2>
              <span
                className="flex items-center gap-1 text-xs font-medium"
                style={{ color: lmsTokens.gold500 }}
              >
                View all <ChevronRightIcon size={13} />
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {studentCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/portal/dashboard/courses/${course.id}`}
                  className="rounded-md border p-4 transition hover:shadow-sm"
                  style={{ borderColor: lmsTokens.line }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className="rounded px-2 py-0.5 text-[11px] font-semibold"
                      style={{
                        backgroundColor: lmsTokens.gold100,
                        color: lmsTokens.navy800,
                      }}
                    >
                      {course.code}
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: lmsTokens.slate }}
                    >
                      {course.progress}%
                    </span>
                  </div>
                  <div className="text-sm font-semibold" style={{ color: lmsTokens.ink }}>
                    {course.name}
                  </div>
                  <div className="mb-3 mt-0.5 text-xs" style={{ color: lmsTokens.slate }}>
                    {course.instructor}
                  </div>
                  <div
                    className="h-1.5 w-full rounded-full"
                    style={{ backgroundColor: "#EDEFF3" }}
                  >
                    <div
                      className="h-1.5 rounded-full"
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

          <section
            className="rounded-lg border bg-white p-5"
            style={{ borderColor: lmsTokens.line }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold" style={{ color: lmsTokens.ink }}>
                Upcoming Assignments
              </h2>
            </div>
            <div className="flex flex-col divide-y" style={{ borderColor: lmsTokens.line }}>
              {studentAssignments.map((assignment) => (
                <div
                  key={`${assignment.course}-${assignment.title}`}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <div className="text-sm font-medium" style={{ color: lmsTokens.ink }}>
                      {assignment.title}
                    </div>
                    <div className="mt-0.5 text-xs" style={{ color: lmsTokens.slate }}>
                      {assignment.course} · Due {assignment.due}
                    </div>
                  </div>
                  <StatusBadge status={assignment.status} />
                </div>
              ))}
            </div>
          </section>

          <section
            className="rounded-lg border bg-white p-5"
            style={{ borderColor: lmsTokens.line }}
          >
            <h2 className="mb-4 text-sm font-semibold" style={{ color: lmsTokens.ink }}>
              Grade Summary
            </h2>
            <GradeSummaryChart data={gradeData} />
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section
            className="rounded-lg p-5"
            style={{
              backgroundColor: lmsTokens.navy900,
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(198,154,62,0.09) 0px, rgba(198,154,62,0.09) 1px, transparent 1px, transparent 34px)",
            }}
          >
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <MegaphoneIcon size={15} color={lmsTokens.gold500} />
              Announcements
            </h2>
            <div className="flex flex-col gap-4">
              {studentAnnouncements.map((announcement) => (
                <div
                  key={`${announcement.from}-${announcement.time}`}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="text-xs font-semibold"
                    style={{ color: lmsTokens.gold500 }}
                  >
                    {announcement.from}
                  </div>
                  <p
                    className="mt-1 text-xs leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    {announcement.text}
                  </p>
                  <div
                    className="mt-1 text-[10px]"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {announcement.time}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            className="rounded-lg border bg-white p-5"
            style={{ borderColor: lmsTokens.line }}
          >
            <h2 className="mb-4 text-sm font-semibold" style={{ color: lmsTokens.ink }}>
              This Week
            </h2>
            <div className="flex flex-col gap-3 text-sm">
              {weekSchedule.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <ClockIcon size={14} color={lmsTokens.slate} />
                  <span style={{ color: lmsTokens.ink }}>{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PortalShell>
  );
}
