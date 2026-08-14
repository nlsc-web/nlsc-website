import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { enrollPortalStudent } from "@/lib/portal/services/admin-mutations";

type EnrollBody = {
  studentId?: string;
  courseId?: string;
};

export async function POST(request: Request) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  let body: EnrollBody;
  try {
    body = (await request.json()) as EnrollBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const studentId = body.studentId?.trim();
  const courseId = body.courseId?.trim();

  if (!studentId || !courseId) {
    return NextResponse.json(
      { error: "Student and course are required." },
      { status: 400 },
    );
  }

  try {
    const enrollment = await enrollPortalStudent(studentId, courseId);
    return NextResponse.json({
      success: true,
      enrollment: {
        id: enrollment.id,
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to enroll student.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
