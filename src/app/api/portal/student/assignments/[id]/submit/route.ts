import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { submitStudentAssignment } from "@/lib/portal/services/student-portal";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requirePortalSession("student");
  if (auth.error) return auth.error;

  const { id } = await context.params;

  try {
    const submission = await submitStudentAssignment(
      auth.session.studentId,
      id,
    );
    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        status: submission.status,
        submittedAt: submission.submittedAt,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to submit assignment.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
