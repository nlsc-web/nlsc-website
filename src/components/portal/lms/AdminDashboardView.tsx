"use client";

import {
  BarChartIcon,
  ChevronRightIcon,
  FolderKanbanIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  MegaphoneIcon,
  MoreHorizontalIcon,
  SettingsIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  UserPlusIcon,
  UsersIcon,
} from "@/components/portal/lms/icons";
import AdminAnnouncementsView from "@/components/portal/lms/AdminAnnouncementsView";
import AdminCoursesView from "@/components/portal/lms/AdminCoursesView";
import AdminInstructorsView from "@/components/portal/lms/AdminInstructorsView";
import PortalSettingsView from "@/components/portal/lms/PortalSettingsView";
import AdminReportsView from "@/components/portal/lms/AdminReportsView";
import AdminStudentsView from "@/components/portal/lms/AdminStudentsView";
import DashboardPanelHead from "@/components/portal/lms/DashboardPanelHead";
import EnrollmentTrendChart from "@/components/portal/lms/EnrollmentTrendChart";
import PortalShell from "@/components/portal/lms/PortalShell";
import ProgramLoadChart from "@/components/portal/lms/ProgramLoadChart";
import StatCard from "@/components/portal/lms/StatCard";
import UserStatusBadge from "@/components/portal/lms/UserStatusBadge";
import { lmsBrandPill, lmsTokens } from "@/lib/portal/lms-tokens";
import {
  enrollmentTrend,
  getInitials,
  pendingApprovals,
  programLoad,
  recentUsers,
  systemAnnouncements,
} from "@/lib/portal/admin-data";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminDashboardViewProps = {
  adminName: string;
  adminId: string;
};

const navItems = [
  { icon: LayoutDashboardIcon, label: "Dashboard" },
  { icon: GraduationCapIcon, label: "Students" },
  { icon: UsersIcon, label: "Instructors" },
  { icon: FolderKanbanIcon, label: "Courses" },
  { icon: BarChartIcon, label: "Reports" },
  { icon: MegaphoneIcon, label: "Announcements" },
  { icon: SettingsIcon, label: "Settings" },
];

function AdminDashboardHome() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div
          className="border-l-[3px] pl-5"
          style={{ borderColor: lmsTokens.gold500 }}
        >
          <p
            className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: lmsTokens.gold500 }}
          >
            Admin Dashboard
          </p>
          <h1
            className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]"
            style={{ color: lmsTokens.ink }}
          >
            Institution Overview
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: lmsTokens.slate }}>
            Next Level Solutions Campus · Colombo · 2026
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-nlsc-gold/25 bg-white px-5 py-2.5 text-sm font-semibold transition-colors hover:border-nlsc-gold/55 hover:bg-nlsc-gold/5"
            style={{ color: lmsTokens.ink }}
          >
            <UserPlusIcon size={15} />
            Add User
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-nlsc-gold bg-nlsc-gold px-5 py-2.5 text-sm font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text"
          >
            <FolderKanbanIcon size={15} />
            New Course
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Students"
          value="118"
          sub="+14 this month"
          accent={lmsTokens.gold500}
          subPill
        />
        <StatCard
          label="Instructors"
          value="6"
          sub="+1 this month"
          accent={lmsTokens.gold500}
          subPill
        />
        <StatCard label="Active Courses" value="2" sub="ACC 4D & ACC 20D" />
        <StatCard
          label="Pending Approvals"
          value={String(pendingApprovals.length)}
          sub="Needs your review"
          accent={lmsTokens.gold500}
        />
      </div>

      {/* Main grid: analytics + sidebar */}
      <div className="grid gap-6 xl:grid-cols-12 xl:items-start">
        <div className="space-y-6 xl:col-span-8">
          <section className="lms-panel-card p-5 sm:p-6">
            <DashboardPanelHead
              title="Enrollment Trend"
              icon={<TrendingUpIcon size={16} color={lmsTokens.gold500} />}
              badge={
                <span
                  className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: lmsBrandPill.bg,
                    color: lmsBrandPill.fg,
                  }}
                >
                  +181% since March
                </span>
              }
            />
            <EnrollmentTrendChart data={enrollmentTrend} />
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="lms-panel-card p-5 sm:p-6">
              <DashboardPanelHead
                title="Recently Added Users"
                action={
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{ color: lmsTokens.gold500 }}
                  >
                    View all <ChevronRightIcon size={13} />
                  </button>
                }
              />
              <ul className="space-y-2.5">
                {recentUsers.slice(0, 4).map((user) => (
                  <li
                    key={user.name}
                    className="flex items-center gap-3 rounded-lg border border-nlsc-gold/15 px-3 py-3 transition-colors hover:bg-nlsc-gold/5"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold"
                      style={{
                        backgroundColor: lmsTokens.gold100,
                        borderColor: "rgb(212 175 55 / 0.45)",
                        color: lmsTokens.gold600,
                      }}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-sm font-medium leading-tight"
                        style={{ color: lmsTokens.ink }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="mt-0.5 truncate text-xs leading-tight"
                        style={{ color: lmsTokens.slate }}
                      >
                        {user.role} · {user.program}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <UserStatusBadge status={user.status} compact />
                      <button
                        type="button"
                        className="rounded p-1 transition-colors hover:bg-nlsc-gold/10"
                        aria-label={`Actions for ${user.name}`}
                      >
                        <MoreHorizontalIcon size={16} color={lmsTokens.slate} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="lms-panel-card p-5 sm:p-6">
              <DashboardPanelHead title="Courses by Program" />
              <ProgramLoadChart data={programLoad} />
            </section>
          </div>
        </div>

        <aside className="space-y-6 xl:col-span-4">
          <section className="lms-panel-card p-5 sm:p-6">
            <DashboardPanelHead
              title="Pending Approvals"
              icon={<ShieldCheckIcon size={16} color={lmsTokens.gold500} />}
              badge={
                <span
                  className="flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold"
                  style={{ backgroundColor: lmsTokens.gold500, color: lmsTokens.navy900 }}
                >
                  {pendingApprovals.length}
                </span>
              }
            />
            <div className="space-y-3">
              {pendingApprovals.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-nlsc-gold/20 bg-nlsc-gold/5 p-4"
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: lmsTokens.gold600 }}
                  >
                    {item.type}
                  </span>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: lmsTokens.ink }}
                  >
                    {item.title}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-nlsc-gold bg-nlsc-gold px-3.5 py-1.5 text-xs font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-nlsc-gold/35 bg-white px-3.5 py-1.5 text-xs font-semibold transition-colors hover:border-nlsc-gold/55 hover:bg-nlsc-gold/5"
                      style={{ color: lmsTokens.ink }}
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="lms-panel-card p-5 sm:p-6">
            <DashboardPanelHead
              title="System Announcements"
              icon={<MegaphoneIcon size={16} color={lmsTokens.gold500} />}
            />
            <div className="space-y-4">
              {systemAnnouncements.map((item) => (
                <div
                  key={item.text}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                  style={{ borderColor: lmsTokens.line }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: lmsTokens.ink }}>
                    {item.text}
                  </p>
                  <span className="mt-1 inline-block text-xs" style={{ color: lmsTokens.slate }}>
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-5 w-full rounded-lg border border-nlsc-gold/30 py-2.5 text-sm font-semibold transition-colors hover:border-nlsc-gold hover:bg-nlsc-gold/5 hover:text-nlsc-gold-text"
              style={{ color: lmsTokens.ink }}
            >
              Post Announcement
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

function AdminMainContent({
  active,
  adminName,
  adminId,
}: {
  active: string;
  adminName: string;
  adminId: string;
}) {
  switch (active) {
    case "Dashboard":
      return <AdminDashboardHome />;
    case "Students":
      return <AdminStudentsView />;
    case "Instructors":
      return <AdminInstructorsView />;
    case "Courses":
      return <AdminCoursesView />;
    case "Reports":
      return <AdminReportsView />;
    case "Announcements":
      return <AdminAnnouncementsView />;
    case "Settings":
      return (
        <PortalSettingsView
          userName={adminName}
          userId={adminId}
          roleLabel="Administrator"
        />
      );
    default:
      return <AdminDashboardHome />;
  }
}

export default function AdminDashboardView({
  adminName,
  adminId,
}: AdminDashboardViewProps) {
  const router = useRouter();
  const [active, setActive] = useState("Dashboard");

  async function handleLogout() {
    await fetch("/api/portal/logout", { method: "POST" });
    router.push("/portal");
    router.refresh();
  }

  return (
    <PortalShell
      userName={adminName}
      userId={adminId}
      roleLabel="Administrator"
      searchPlaceholder="Search students, courses..."
      navItems={navItems}
      active={active}
      onNavigate={setActive}
      onLogout={handleLogout}
    >
      <AdminMainContent active={active} adminName={adminName} adminId={adminId} />
    </PortalShell>
  );
}
