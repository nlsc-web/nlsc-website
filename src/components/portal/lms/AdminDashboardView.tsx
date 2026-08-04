"use client";



import {

  BarChartIcon,

  ChevronRightIcon,

  FolderKanbanIcon,

  GraduationCapIcon,

  LayoutDashboardIcon,

  MegaphoneIcon,

  MoreHorizontalIcon,

  ShieldCheckIcon,

  TrendingUpIcon,

  UserPlusIcon,

  UsersIcon,

} from "@/components/portal/lms/icons";

import EnrollmentTrendChart from "@/components/portal/lms/EnrollmentTrendChart";

import PortalShell from "@/components/portal/lms/PortalShell";

import ProgramLoadChart from "@/components/portal/lms/ProgramLoadChart";

import StatCard from "@/components/portal/lms/StatCard";

import UserStatusBadge from "@/components/portal/lms/UserStatusBadge";

import { lmsRuledBackground, lmsTokens } from "@/lib/portal/lms-tokens";

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



export default function AdminDashboardView({

  adminName,

  adminId,

}: AdminDashboardViewProps) {

  const router = useRouter();

  const [active, setActive] = useState("Dashboard");



  const navItems = [

    { icon: LayoutDashboardIcon, label: "Dashboard" },

    { icon: GraduationCapIcon, label: "Students" },

    { icon: UsersIcon, label: "Instructors" },

    { icon: FolderKanbanIcon, label: "Courses" },

    { icon: BarChartIcon, label: "Reports" },

    { icon: MegaphoneIcon, label: "Announcements" },

  ];



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

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">

        <div className="border-l-2 pl-5" style={{ borderColor: lmsTokens.gold500 }}>

          <p

            className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]"

            style={{ color: lmsTokens.gold500 }}

          >

            Admin Dashboard

          </p>

          <h1

            className="text-2xl font-semibold tracking-tight lg:text-[1.75rem]"

            style={{ color: lmsTokens.ink, fontFamily: "Georgia, serif" }}

          >

            Institution Overview

          </h1>

          <p className="mt-1.5 text-sm" style={{ color: lmsTokens.slate }}>

            Next Level Solutions Campus · Colombo · 2026

          </p>

        </div>

        <div className="flex flex-wrap gap-2">

          <button

            type="button"

            className="flex items-center gap-2 rounded-md border bg-white px-4 py-2.5 text-xs font-semibold transition-colors hover:border-nlsc-gold/50"

            style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}

          >

            <UserPlusIcon size={14} />

            Add User

          </button>

          <button

            type="button"

            className="flex items-center gap-2 rounded-md border border-nlsc-gold bg-nlsc-gold px-4 py-2.5 text-xs font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text"

          >

            <FolderKanbanIcon size={14} />

            New Course

          </button>

        </div>

      </div>



      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">

        <StatCard label="Total Students" value="118" sub="+14 this month" accent={lmsTokens.good} />

        <StatCard label="Instructors" value="6" sub="+1 this month" accent={lmsTokens.good} />

        <StatCard label="Active Courses" value="2" sub="ACC 4D & ACC 20D" />

        <StatCard

          label="Pending Approvals"

          value={String(pendingApprovals.length)}

          sub="Needs your review"

          accent={lmsTokens.gold500}

        />

      </div>



      <div className="grid gap-6 lg:grid-cols-3">

        <div className="flex flex-col gap-6 lg:col-span-2">

          <section className="lms-panel-card p-5 lg:p-6">

            <div className="mb-5 flex items-center justify-between gap-3">

              <h2

                className="flex items-center gap-2 text-sm font-semibold"

                style={{ color: lmsTokens.ink }}

              >

                <TrendingUpIcon size={15} color={lmsTokens.gold500} />

                Enrollment Trend

              </h2>

              <span

                className="rounded-full px-2.5 py-1 text-xs font-semibold"

                style={{ backgroundColor: "#e6f2ec", color: lmsTokens.good }}

              >

                +181% since March

              </span>

            </div>

            <EnrollmentTrendChart data={enrollmentTrend} />

          </section>



          <section className="lms-panel-card p-5 lg:p-6">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-sm font-semibold" style={{ color: lmsTokens.ink }}>

                Recently Added Users

              </h2>

              <button

                type="button"

                className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-80"

                style={{ color: lmsTokens.gold500 }}

              >

                View all <ChevronRightIcon size={13} />

              </button>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>

                  <tr

                    className="border-b text-left"

                    style={{ borderColor: lmsTokens.line, color: lmsTokens.slate }}

                  >

                    <th className="pb-3 text-[11px] font-bold uppercase tracking-[0.1em]">

                      Name

                    </th>

                    <th className="pb-3 text-[11px] font-bold uppercase tracking-[0.1em]">

                      Role

                    </th>

                    <th className="hidden pb-3 text-[11px] font-bold uppercase tracking-[0.1em] sm:table-cell">

                      Program

                    </th>

                    <th className="pb-3 text-[11px] font-bold uppercase tracking-[0.1em]">

                      Status

                    </th>

                    <th className="pb-3" />

                  </tr>

                </thead>

                <tbody className="divide-y" style={{ borderColor: lmsTokens.line }}>

                  {recentUsers.map((user) => (

                    <tr key={user.name} className="transition-colors hover:bg-neutral-50/80">

                      <td className="py-3.5 pr-2">

                        <div className="flex items-center gap-2.5">

                          <div

                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold text-white"

                            style={{

                              backgroundColor: lmsTokens.navy900,

                              borderColor: "rgb(212 175 55 / 0.35)",

                            }}

                          >

                            {getInitials(user.name)}

                          </div>

                          <span className="font-medium" style={{ color: lmsTokens.ink }}>

                            {user.name}

                          </span>

                        </div>

                      </td>

                      <td className="py-3.5" style={{ color: lmsTokens.slate }}>

                        {user.role}

                      </td>

                      <td

                        className="hidden py-3.5 sm:table-cell"

                        style={{ color: lmsTokens.slate }}

                      >

                        {user.program}

                      </td>

                      <td className="py-3.5">

                        <UserStatusBadge status={user.status} />

                      </td>

                      <td className="py-3.5 text-right">

                        <button type="button" className="rounded p-1 hover:bg-neutral-100">

                          <MoreHorizontalIcon size={16} color={lmsTokens.slate} />

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>



          <section className="lms-panel-card p-5 lg:p-6">

            <h2 className="mb-5 text-sm font-semibold" style={{ color: lmsTokens.ink }}>

              Courses by Program

            </h2>

            <ProgramLoadChart data={programLoad} />

          </section>

        </div>



        <div className="flex flex-col gap-6">

          <section

            className="relative overflow-hidden rounded-lg p-5 lg:p-6"

            style={{

              backgroundColor: lmsTokens.navy900,

              ...lmsRuledBackground,

            }}

          >

            <div

              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nlsc-gold/60 to-transparent"

              aria-hidden

            />

            <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-white">

              <ShieldCheckIcon size={15} color={lmsTokens.gold500} />

              Pending Approvals

            </h2>

            <div className="flex flex-col gap-4">

              {pendingApprovals.map((item) => (

                <div

                  key={item.title}

                  className="rounded-md border border-white/8 bg-white/5 p-3.5 last:mb-0"

                >

                  <span

                    className="text-[10px] font-bold uppercase tracking-[0.14em]"

                    style={{ color: lmsTokens.gold500 }}

                  >

                    {item.type}

                  </span>

                  <p

                    className="mt-1.5 text-xs leading-relaxed"

                    style={{ color: "rgba(255,255,255,0.85)" }}

                  >

                    {item.title}

                  </p>

                  <div className="mt-3 flex gap-2">

                    <button

                      type="button"

                      className="rounded-md px-3 py-1.5 text-[11px] font-semibold transition-opacity hover:opacity-90"

                      style={{

                        backgroundColor: lmsTokens.gold500,

                        color: lmsTokens.navy900,

                      }}

                    >

                      Approve

                    </button>

                    <button

                      type="button"

                      className="rounded-md border px-3 py-1.5 text-[11px] font-semibold transition-colors hover:border-nlsc-gold/50 hover:text-white"

                      style={{

                        borderColor: "rgba(255,255,255,0.25)",

                        color: "rgba(255,255,255,0.75)",

                      }}

                    >

                      Review

                    </button>

                  </div>

                </div>

              ))}

            </div>

          </section>



          <section className="lms-panel-card p-5 lg:p-6">

            <h2

              className="mb-5 flex items-center gap-2 text-sm font-semibold"

              style={{ color: lmsTokens.ink }}

            >

              <MegaphoneIcon size={15} color={lmsTokens.gold500} />

              System Announcements

            </h2>

            <div className="flex flex-col gap-4">

              {systemAnnouncements.map((item) => (

                <div

                  key={item.text}

                  className="border-b pb-4 text-xs last:border-b-0 last:pb-0"

                  style={{ borderColor: lmsTokens.line }}

                >

                  <p className="leading-relaxed" style={{ color: lmsTokens.ink }}>

                    {item.text}

                  </p>

                  <span className="mt-1 inline-block" style={{ color: lmsTokens.slate }}>

                    {item.time}

                  </span>

                </div>

              ))}

            </div>

            <button

              type="button"

              className="mt-5 w-full rounded-md border py-2.5 text-xs font-semibold transition-colors hover:border-nlsc-gold/50 hover:text-nlsc-gold-text"

              style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}

            >

              Post Announcement

            </button>

          </section>

        </div>

      </div>

    </PortalShell>

  );

}

