"use client";

import {
  BarChartIcon,
  ChevronRightIcon,
  TrendingUpIcon,
} from "@/components/portal/lms/icons";
import EnrollmentTrendChart from "@/components/portal/lms/EnrollmentTrendChart";
import ProgramLoadChart from "@/components/portal/lms/ProgramLoadChart";
import StatCard from "@/components/portal/lms/StatCard";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import type {
  AdminReport,
  EnrollmentTrendPoint,
  ProgramLoadPoint,
  ReportCategory,
} from "@/lib/portal/types/admin-portal";
import { useMemo, useState } from "react";

type FilterKey = "all" | ReportCategory;

const categoryLabels: Record<ReportCategory, string> = {
  enrollment: "Enrollment",
  attendance: "Attendance",
  performance: "Performance",
  financial: "Financial",
};

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Reports" },
  { key: "enrollment", label: "Enrollment" },
  { key: "attendance", label: "Attendance" },
  { key: "performance", label: "Performance" },
  { key: "financial", label: "Financial" },
];

type AdminReportsViewProps = {
  reports: AdminReport[];
  enrollmentTrend: EnrollmentTrendPoint[];
  programLoad: ProgramLoadPoint[];
};

export default function AdminReportsView({
  reports: adminReports,
  enrollmentTrend,
  programLoad,
}: AdminReportsViewProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const byCategory = (cat: ReportCategory) =>
      adminReports.filter((r) => r.category === cat).length;
    return {
      all: adminReports.length,
      enrollment: byCategory("enrollment"),
      attendance: byCategory("attendance"),
      performance: byCategory("performance"),
      financial: byCategory("financial"),
    };
  }, [adminReports]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return adminReports.filter((report) => {
      const matchesFilter = filter === "all" || report.category === filter;
      const matchesQuery =
        !q ||
        report.title.toLowerCase().includes(q) ||
        report.id.toLowerCase().includes(q) ||
        report.period.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, adminReports]);

  return (
    <>
      <div className="mb-6 sm:mb-8">
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
            Reports & Analytics
          </h1>
          <p className="mt-1 text-xs sm:mt-1.5 sm:text-sm" style={{ color: lmsTokens.slate }}>
            Enrollment trends, performance metrics, and downloadable reports.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Total Reports" value={String(counts.all)} />
        <StatCard
          label="Enrollment"
          value={String(counts.enrollment)}
          sub="Registration data"
          accent={lmsTokens.gold500}
        />
        <StatCard
          label="Performance"
          value={String(counts.performance)}
          sub="Course & instructor"
          accent={lmsTokens.good}
          subPill
        />
        <StatCard
          label="This Month"
          value="4"
          sub="Reports generated"
          accent={lmsTokens.good}
          subPill
        />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
          <h2
            className="mb-4 flex items-center gap-2 text-sm font-semibold sm:mb-5"
            style={{ color: lmsTokens.ink }}
          >
            <TrendingUpIcon size={15} color={lmsTokens.gold500} />
            Enrollment Trend
          </h2>
          <EnrollmentTrendChart data={enrollmentTrend} />
        </section>
        <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
          <h2
            className="mb-4 flex items-center gap-2 text-sm font-semibold sm:mb-5"
            style={{ color: lmsTokens.ink }}
          >
            <BarChartIcon size={15} color={lmsTokens.gold500} />
            Courses by Program
          </h2>
          <ProgramLoadChart data={programLoad} />
        </section>
      </div>

      <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <h2
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: lmsTokens.ink }}
          >
            <BarChartIcon size={15} color={lmsTokens.gold500} />
            Generated Reports
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ backgroundColor: lmsTokens.gold100, color: lmsTokens.navy800 }}
            >
              {filtered.length}
            </span>
          </h2>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports..."
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
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr
                className="border-b text-left"
                style={{ borderColor: lmsTokens.line, color: lmsTokens.slate }}
              >
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Report
                </th>
                <th className="hidden pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:table-cell sm:text-[11px]">
                  Category
                </th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Period
                </th>
                <th className="hidden pb-3 text-[10px] font-bold uppercase tracking-[0.1em] md:table-cell sm:text-[11px]">
                  Generated
                </th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Format
                </th>
                <th className="pb-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: lmsTokens.line }}>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-sm"
                    style={{ color: lmsTokens.slate }}
                  >
                    No reports match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((report) => (
                  <ReportRow key={report.id} report={report} />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div
          className="mt-4 flex items-center justify-between border-t pt-4 text-xs"
          style={{ borderColor: lmsTokens.line, color: lmsTokens.slate }}
        >
          <span>{filtered.length} reports available</span>
          <button
            type="button"
            className="flex items-center gap-1 font-semibold transition-opacity hover:opacity-80"
            style={{ color: lmsTokens.gold500 }}
          >
            Generate new report <ChevronRightIcon size={13} />
          </button>
        </div>
      </section>
    </>
  );
}

function ReportRow({ report }: { report: AdminReport }) {
  return (
    <tr className="transition-colors hover:bg-neutral-50/80">
      <td className="py-3 pr-2 sm:py-3.5">
        <div className="min-w-0">
          <div className="text-xs font-medium sm:text-sm" style={{ color: lmsTokens.ink }}>
            {report.title}
          </div>
          <div className="mt-0.5 text-[11px] sm:hidden" style={{ color: lmsTokens.slate }}>
            {categoryLabels[report.category]} · {report.size}
          </div>
        </div>
      </td>
      <td className="hidden py-3.5 sm:table-cell">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: lmsTokens.gold100, color: lmsTokens.navy800 }}
        >
          {categoryLabels[report.category]}
        </span>
      </td>
      <td className="py-3 text-xs sm:py-3.5" style={{ color: lmsTokens.slate }}>
        {report.period}
      </td>
      <td
        className="hidden py-3.5 text-xs md:table-cell"
        style={{ color: lmsTokens.slate }}
      >
        {report.generated}
      </td>
      <td className="py-3 sm:py-3.5">
        <span
          className="rounded border px-2 py-0.5 text-[10px] font-bold"
          style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
        >
          {report.format}
        </span>
      </td>
      <td className="py-3 text-right sm:py-3.5">
        <button
          type="button"
          className="rounded-md px-2.5 py-1 text-[11px] font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: lmsTokens.gold500, color: lmsTokens.navy900 }}
        >
          Download
        </button>
      </td>
    </tr>
  );
}
