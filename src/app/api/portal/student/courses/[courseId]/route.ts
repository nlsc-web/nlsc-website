import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { getStudentCourseDetail } from "@/lib/portal/services/student-portal";

type RouteContext = {
  params: Promise<{ courseId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requirePortalSession("student");
  if (auth.error) return auth.error;

  const { courseId } = await context.params;

  try {
    const course = await getStudentCourseDetail(auth.session.studentId, courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }
    return NextResponse.json(course);
  } catch {
    return NextResponse.json(
      { error: "Unable to load course." },
      { status: 500 },
    );
  }
}
