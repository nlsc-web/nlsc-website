"use client";

import { BookOpenIcon, ChevronRightIcon } from "@/components/portal/lms/icons";
import DashboardPanelHead from "@/components/portal/lms/DashboardPanelHead";
import StatCard from "@/components/portal/lms/StatCard";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { lmsBrandPill, lmsTokens } from "@/lib/portal/lms-tokens";
import type { StudentCourse } from "@/lib/portal/types/student-portal";

type StudentCoursesViewProps = {
  courses: StudentCourse[];
};

export default function StudentCoursesView({
  courses: initialCourses,
}: StudentCoursesViewProps) {
  const [courses, setCourses] = useState(initialCourses);
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setCourses(initialCourses);
  }, [initialCourses]);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      setRefreshing(true);
      try {
        const response = await fetch("/api/portal/student/courses");
        if (!response.ok) return;
        const data = (await response.json()) as { courses?: StudentCourse[] };
        if (!cancelled && Array.isArray(data.courses)) {
          setCourses(data.courses);
        }
      } catch {
        // Keep SSR data if refresh fails.
      } finally {
        if (!cancelled) setRefreshing(false);
      }
    }
    void refresh();
    return () => {
      cancelled = true;
    };
  }, []);

  const avgProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce((sum, c) => sum + c.progress, 0) / courses.length,
        )
      : 0;

  const modulesCompleted = courses.reduce(
    (sum, c) => sum + c.completedModules,
    0,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(q) ||
        course.code.toLowerCase().includes(q) ||
        course.instructor.toLowerCase().includes(q),
    );
  }, [query, courses]);

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
            Student Portal
          </p>
          <h1
            className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]"
            style={{ color: lmsTokens.ink }}
          >
            My Courses
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: lmsTokens.slate }}>
            Continue learning across your enrolled NLSC programs.
            {refreshing ? " Updating..." : ""}
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Enrolled Courses"
          value={String(courses.length)}
          sub="Active programs"
          accent={lmsTokens.gold500}
          subPill
        />
        <StatCard
          label="Average Progress"
          value={`${avgProgress}%`}
          sub="Across all courses"
          accent={lmsTokens.gold500}
          subPill
        />
        <StatCard
          label="Modules Completed"
          value={String(modulesCompleted)}
          sub="Keep going!"
          accent={lmsTokens.good}
          subPill
        />
      </div>

      <section className="lms-panel-card p-5 sm:p-6">
        <DashboardPanelHead
          title="All Enrolled Courses"
          icon={<BookOpenIcon size={16} color={lmsTokens.gold500} />}
          badge={
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor: lmsTokens.gold100,
                color: lmsTokens.navy800,
              }}
            >
              {filtered.length}
            </span>
          }
          action={
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-nlsc-gold/50 sm:w-52"
              style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
            />
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.length === 0 ? (
            <p
              className="col-span-full py-10 text-center text-sm"
              style={{ color: lmsTokens.slate }}
            >
              {courses.length === 0
                ? "You are not enrolled in any courses yet."
                : "No courses match your search."}
            </p>
          ) : (
            filtered.map((course) => (
              <Link
                key={course.id}
                href={`/portal/dashboard/courses/${course.id}`}
                className="group flex flex-col rounded-lg border border-nlsc-gold/15 p-5 transition-colors hover:border-nlsc-gold/40 hover:bg-nlsc-gold/5"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
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
                <h3
                  className="text-base font-semibold leading-snug"
                  style={{ color: lmsTokens.ink }}
                >
                  {course.name}
                </h3>
                <p className="mt-1 text-xs" style={{ color: lmsTokens.slate }}>
                  {course.instructor} · {course.duration}
                </p>
                <div
                  className="my-3 h-2 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: lmsTokens.gold100 }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${course.progress}%`,
                      backgroundColor: course.color,
                    }}
                  />
                </div>
                <div className="mt-auto flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                  <span className="min-w-0 leading-relaxed" style={{ color: lmsTokens.slate }}>
                    {course.completedModules}/{course.modules} modules · Next:{" "}
                    {course.nextSession ?? "TBA"}
                  </span>
                  <span
                    className="flex shrink-0 items-center gap-0.5 self-end font-semibold transition-opacity group-hover:opacity-80 sm:self-auto"
                    style={{ color: lmsTokens.gold500 }}
                  >
                    Continue <ChevronRightIcon size={13} />
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
