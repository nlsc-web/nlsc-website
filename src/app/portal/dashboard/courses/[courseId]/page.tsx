import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPortalCourse } from "@/lib/portal/courses";
import { getPortalSession } from "@/lib/portal/session";
import { lmsTokens } from "@/lib/portal/lms-tokens";

type CoursePageProps = {
  params: Promise<{ courseId: string }>;
};

const moduleTypeLabels = {
  video: "Video lesson",
  document: "Document",
  quiz: "Assessment",
};

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { courseId } = await params;
  const course = getPortalCourse(courseId);

  return {
    title: course
      ? `${course.title} | NLSC LMS`
      : "Course | Next Level Solutions Campus",
  };
}

export default async function PortalCoursePage({ params }: CoursePageProps) {
  const session = await getPortalSession();
  if (!session) redirect("/portal");

  const { courseId } = await params;
  const course = getPortalCourse(courseId);
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
            style={{ color: lmsTokens.ink, fontFamily: "Georgia, serif" }}
          >
            {course.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: lmsTokens.slate }}>
            {course.description}
          </p>
        </div>

        <div
          className="mb-6 rounded-lg border bg-white p-5"
          style={{ borderColor: lmsTokens.line }}
        >
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold" style={{ color: lmsTokens.ink }}>
              Course progress
            </span>
            <span className="font-bold" style={{ color: lmsTokens.gold500 }}>
              {course.progress}%
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full"
            style={{ backgroundColor: "#EDEFF3" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${course.progress}%`,
                backgroundColor: lmsTokens.gold500,
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold" style={{ color: lmsTokens.ink }}>
            Course modules
          </h2>
          {course.modules.map((module, index) => (
            <article
              key={module.id}
              className="flex items-center justify-between gap-4 rounded-xl border bg-white px-5 py-4"
              style={{ borderColor: lmsTokens.line }}
            >
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: lmsTokens.slate }}
                >
                  Module {index + 1} · {moduleTypeLabels[module.type]}
                </p>
                <h3 className="mt-1 font-semibold" style={{ color: lmsTokens.ink }}>
                  {module.title}
                </h3>
                <p className="mt-1 text-xs" style={{ color: lmsTokens.slate }}>
                  {module.duration}
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-md border px-4 py-2 text-[10px] font-semibold uppercase tracking-wider transition hover:text-white"
                style={{
                  borderColor: lmsTokens.gold500,
                  color: lmsTokens.gold500,
                }}
              >
                Open
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
