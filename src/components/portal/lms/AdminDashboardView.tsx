"use client";

import {
  AddUserModal,
  NewCourseModal,
  PostAnnouncementModal,
} from "@/components/portal/lms/AdminActionModals";
import {
  BarChartIcon,
  ChevronRightIcon,
  FolderKanbanIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  MailIcon,
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
import AdminInquiriesView from "@/components/portal/lms/AdminInquiriesView";
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
import {
  fetchAdminDashboard,
  patchApproval,
  searchAdminPortal,
} from "@/lib/portal/admin-api";
import { getInitials } from "@/lib/portal/admin-data";
import { lmsBrandPill, lmsTokens } from "@/lib/portal/lms-tokens";
import type { AdminSearchResult } from "@/lib/portal/services/admin-mutations";
import type { AdminPortalData } from "@/lib/portal/types/admin-portal";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type AdminDashboardViewProps = {
  adminName: string;
  adminId: string;
  portalData: AdminPortalData;
};

type AdminModal = "user" | "course" | "announcement" | null;

const navItems = [
  { icon: LayoutDashboardIcon, label: "Dashboard" },
  { icon: GraduationCapIcon, label: "Students" },
  { icon: UsersIcon, label: "Instructors" },
  { icon: FolderKanbanIcon, label: "Courses" },
  { icon: MailIcon, label: "Messages" },
  { icon: BarChartIcon, label: "Reports" },
  { icon: MegaphoneIcon, label: "Announcements" },
  { icon: SettingsIcon, label: "Settings" },
];

function AdminSearchDropdown({
  results,
  loading,
  onPick,
}: {
  results: AdminSearchResult | null;
  loading: boolean;
  onPick: (section: string) => void;
}) {
  if (loading) {
    return (
      <div
        className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-xl border bg-white p-4 text-sm shadow-lg"
        style={{ borderColor: lmsTokens.line, color: lmsTokens.slate }}
      >
        Searching...
      </div>
    );
  }

  if (!results) return null;

  const total =
    results.students.length + results.instructors.length + results.courses.length;

  if (total === 0) {
    return (
      <div
        className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-xl border bg-white p-4 text-sm shadow-lg"
        style={{ borderColor: lmsTokens.line, color: lmsTokens.slate }}
      >
        No matches found.
      </div>
    );
  }

  return (
    <div
      className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-80 overflow-y-auto rounded-xl border bg-white p-3 shadow-lg"
      style={{ borderColor: lmsTokens.line }}
    >
      {results.students.length > 0 && (
        <div className="mb-3">
          <p
            className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: lmsTokens.gold600 }}
          >
            Students
          </p>
          {results.students.map((student) => (
            <button
              key={student.id}
              type="button"
              onClick={() => onPick("Students")}
              className="block w-full rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-nlsc-gold/5"
            >
              <span className="font-medium" style={{ color: lmsTokens.ink }}>
                {student.name}
              </span>
              <span className="block text-xs" style={{ color: lmsTokens.slate }}>
                {student.id} · {student.program}
              </span>
            </button>
          ))}
        </div>
      )}
      {results.instructors.length > 0 && (
        <div className="mb-3">
          <p
            className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: lmsTokens.gold600 }}
          >
            Instructors
          </p>
          {results.instructors.map((instructor) => (
            <button
              key={instructor.id}
              type="button"
              onClick={() => onPick("Instructors")}
              className="block w-full rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-nlsc-gold/5"
            >
              <span className="font-medium" style={{ color: lmsTokens.ink }}>
                {instructor.name}
              </span>
              <span className="block text-xs" style={{ color: lmsTokens.slate }}>
                {instructor.department}
              </span>
            </button>
          ))}
        </div>
      )}
      {results.courses.length > 0 && (
        <div>
          <p
            className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: lmsTokens.gold600 }}
          >
            Courses
          </p>
          {results.courses.map((course) => (
            <button
              key={course.id}
              type="button"
              onClick={() => onPick("Courses")}
              className="block w-full rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-nlsc-gold/5"
            >
              <span className="font-medium" style={{ color: lmsTokens.ink }}>
                {course.code} — {course.title}
              </span>
              <span className="block text-xs capitalize" style={{ color: lmsTokens.slate }}>
                {course.status}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type AdminDashboardHomeProps = {
  portalData: AdminPortalData;
  onAddUser: () => void;
  onNewCourse: () => void;
  onPostAnnouncement: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewStudents: () => void;
  approvalLoadingId: string | null;
};

function AdminDashboardHome({
  portalData,
  onAddUser,
  onNewCourse,
  onPostAnnouncement,
  onApprove,
  onReject,
  onViewStudents,
  approvalLoadingId,
}: AdminDashboardHomeProps) {
  const {
    campus,
    dashboard: {
      stats,
      enrollmentTrend,
      enrollmentGrowthLabel,
      programLoad,
      recentUsers,
      pendingApprovals,
      systemAnnouncements,
    },
  } = portalData;

  return (
    <div className="mx-auto w-full max-w-[1400px]">
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
            {campus.name} · Colombo · {campus.academicYear}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onAddUser}
            className="inline-flex items-center gap-2 rounded-lg border border-nlsc-gold/25 bg-white px-5 py-2.5 text-sm font-semibold transition-colors hover:border-nlsc-gold/55 hover:bg-nlsc-gold/5"
            style={{ color: lmsTokens.ink }}
          >
            <UserPlusIcon size={15} />
            Add User
          </button>
          <button
            type="button"
            onClick={onNewCourse}
            className="inline-flex items-center gap-2 rounded-lg border border-nlsc-gold bg-nlsc-gold px-5 py-2.5 text-sm font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text"
          >
            <FolderKanbanIcon size={15} />
            New Course
          </button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Students"
          value={String(stats.totalStudents)}
          sub={
            stats.studentsThisMonth > 0
              ? `+${stats.studentsThisMonth} this month`
              : "No new enrollments"
          }
          accent={lmsTokens.gold500}
          subPill
        />
        <StatCard
          label="Instructors"
          value={String(stats.totalInstructors)}
          sub={
            stats.instructorsThisMonth > 0
              ? `+${stats.instructorsThisMonth} this month`
              : "Stable team"
          }
          accent={lmsTokens.gold500}
          subPill
        />
        <StatCard
          label="Active Courses"
          value={String(stats.activeCourses)}
          sub={stats.activeCoursesLabel}
        />
        <StatCard
          label="Pending Approvals"
          value={String(stats.pendingApprovals)}
          sub="Needs your review"
          accent={lmsTokens.gold500}
        />
      </div>

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
                  {enrollmentGrowthLabel}
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
                    onClick={onViewStudents}
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
              {pendingApprovals.length === 0 && (
                <p className="text-sm" style={{ color: lmsTokens.slate }}>
                  All caught up — no pending items.
                </p>
              )}
              {pendingApprovals.map((item) => {
                const busy = approvalLoadingId === item.id;
                return (
                  <div
                    key={item.id}
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
                        disabled={busy}
                        onClick={() => onApprove(item.id)}
                        className="rounded-md border border-nlsc-gold bg-nlsc-gold px-3.5 py-1.5 text-xs font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text disabled:opacity-60"
                      >
                        {busy ? "..." : "Approve"}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onReject(item.id)}
                        className="rounded-md border border-nlsc-gold/35 bg-white px-3.5 py-1.5 text-xs font-semibold transition-colors hover:border-nlsc-gold/55 hover:bg-nlsc-gold/5 disabled:opacity-60"
                        style={{ color: lmsTokens.ink }}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                );
              })}
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
              onClick={onPostAnnouncement}
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
  portalData,
  onAddUser,
  onNewCourse,
  onPostAnnouncement,
  onApprove,
  onReject,
  onViewStudents,
  approvalLoadingId,
}: {
  active: string;
  adminName: string;
  adminId: string;
  portalData: AdminPortalData;
  onAddUser: () => void;
  onNewCourse: () => void;
  onPostAnnouncement: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewStudents: () => void;
  approvalLoadingId: string | null;
}) {
  switch (active) {
    case "Dashboard":
      return (
        <AdminDashboardHome
          portalData={portalData}
          onAddUser={onAddUser}
          onNewCourse={onNewCourse}
          onPostAnnouncement={onPostAnnouncement}
          onApprove={onApprove}
          onReject={onReject}
          onViewStudents={onViewStudents}
          approvalLoadingId={approvalLoadingId}
        />
      );
    case "Students":
      return <AdminStudentsView students={portalData.students} />;
    case "Instructors":
      return <AdminInstructorsView instructors={portalData.instructors} />;
    case "Courses":
      return <AdminCoursesView courses={portalData.courses} />;
    case "Messages":
      return <AdminInquiriesView inquiries={portalData.inquiries} />;
    case "Reports":
      return (
        <AdminReportsView
          reports={portalData.reports}
          enrollmentTrend={portalData.dashboard.enrollmentTrend}
          programLoad={portalData.dashboard.programLoad}
        />
      );
    case "Announcements":
      return <AdminAnnouncementsView announcements={portalData.announcements} />;
    case "Settings":
      return (
        <PortalSettingsView
          userName={adminName}
          userId={adminId}
          roleLabel="Administrator"
        />
      );
    default:
      return (
        <AdminDashboardHome
          portalData={portalData}
          onAddUser={onAddUser}
          onNewCourse={onNewCourse}
          onPostAnnouncement={onPostAnnouncement}
          onApprove={onApprove}
          onReject={onReject}
          onViewStudents={onViewStudents}
          approvalLoadingId={approvalLoadingId}
        />
      );
  }
}

export default function AdminDashboardView({
  adminName,
  adminId,
  portalData: initialPortalData,
}: AdminDashboardViewProps) {
  const router = useRouter();
  const [active, setActive] = useState("Dashboard");
  const [portalData, setPortalData] = useState(initialPortalData);
  const [modal, setModal] = useState<AdminModal>(null);
  const [approvalLoadingId, setApprovalLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AdminSearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const refreshPortal = useCallback(async () => {
    const data = await fetchAdminDashboard();
    setPortalData(data);
  }, []);

  useEffect(() => {
    setPortalData(initialPortalData);
  }, [initialPortalData]);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults(null);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const results = await searchAdminPortal(trimmed);
        setSearchResults(results);
      } catch {
        setSearchResults({ students: [], instructors: [], courses: [] });
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  async function handleLogout() {
    await fetch("/api/portal/logout", { method: "POST" });
    router.push("/portal");
    router.refresh();
  }

  async function handleApproval(id: string, action: "approve" | "reject") {
    setApprovalLoadingId(id);
    try {
      await patchApproval(id, action);
      await refreshPortal();
    } catch (error) {
      console.error(error);
    } finally {
      setApprovalLoadingId(null);
    }
  }

  function handleSearchPick(section: string) {
    setActive(section);
    setSearchQuery("");
    setSearchResults(null);
  }

  const searchDropdown = searchQuery.trim().length >= 2 ? (
    <AdminSearchDropdown
      results={searchResults}
      loading={searchLoading}
      onPick={handleSearchPick}
    />
  ) : null;

  return (
    <>
      <PortalShell
        userName={adminName}
        userId={adminId}
        roleLabel="Administrator"
        searchPlaceholder="Search students, courses..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchDropdown}
        navItems={navItems}
        active={active}
        onNavigate={setActive}
        onLogout={handleLogout}
      >
        <AdminMainContent
          active={active}
          adminName={adminName}
          adminId={adminId}
          portalData={portalData}
          onAddUser={() => setModal("user")}
          onNewCourse={() => setModal("course")}
          onPostAnnouncement={() => setModal("announcement")}
          onApprove={(id) => handleApproval(id, "approve")}
          onReject={(id) => handleApproval(id, "reject")}
          onViewStudents={() => setActive("Students")}
          approvalLoadingId={approvalLoadingId}
        />
      </PortalShell>

      {modal === "user" && (
        <AddUserModal
          courses={portalData.courses.map((c) => ({
            id: c.id,
            code: c.code,
            title: c.title,
          }))}
          onClose={() => setModal(null)}
          onCreated={refreshPortal}
        />
      )}
      {modal === "course" && (
        <NewCourseModal
          instructors={portalData.instructors.map((i) => ({
            id: i.id,
            name: i.name,
          }))}
          onClose={() => setModal(null)}
          onCreated={refreshPortal}
        />
      )}
      {modal === "announcement" && (
        <PostAnnouncementModal
          onClose={() => setModal(null)}
          onCreated={refreshPortal}
        />
      )}
    </>
  );
}
