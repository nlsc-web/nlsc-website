import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import StudentCourseModules from "@/components/portal/lms/StudentCourseModules";
import { getStudentCourseDetail } from "@/lib/portal/services/student-portal";
import { getPortalSession } from "@/lib/portal/session";
import { lmsTokens } from "@/lib/portal/lms-tokens";

type CoursePageProps = {
  params: Promise<{ courseId: string }>;
};

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const session = await getPortalSession();
  const { courseId } = await params;
  const course =
    session && session.role === "student"
      ? await getStudentCourseDetail(session.studentId, courseId)
      : null;

  return {
    title: course
      ? `${course.title} | NLSC LMS`
      : "Course | Next Level Solutions Campus",
  };
}

export default async function PortalCoursePage({ params }: CoursePageProps) {
  const session = await getPortalSession();
  if (!session) redirect("/portal");
  if (session.role === "admin") redirect("/portal/admin/dashboard");

  const { courseId } = await params;
  const course = await getStudentCourseDetail(session.studentId, courseId);
  if (!course) notFound();

  return (
    <div
      className="min-h-screen px-6 py-8 sm:px-8 sm:py-10"
      style={{ backgroundColor: lmsTokens.bg }}
    >
      <div className="mx-auto max-w-4xl">
        <Link
          href="/portal/dashboard"
          className="text-xs font-semibold uppercase tracking-wider hover:underline"
          style={{ color: lmsTokens.gold500 }}
        >
          ← Back to dashboard
        </Link>

        <div className="mb-8 mt-6">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: lmsTokens.gold500 }}
          >
            {course.duration}
          </p>
          <h1
            className="mt-2 text-2xl font-bold sm:text-3xl"
            style={{ color: lmsTokens.ink }}
          >
            {course.title}
          </h1>
          <p
            className="mt-3 max-w-2xl text-sm leading-relaxed"
            style={{ color: lmsTokens.slate }}
          >
            {course.description}
          </p>
        </div>

        <StudentCourseModules
          modules={course.modules}
          initialProgress={course.progress}
        />
      </div>
    </div>
  );
}
