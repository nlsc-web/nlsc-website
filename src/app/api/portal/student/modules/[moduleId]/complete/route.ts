import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { completeStudentModule } from "@/lib/portal/services/student-portal";

type RouteContext = {
  params: Promise<{ moduleId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requirePortalSession("student");
  if (auth.error) return auth.error;

  const { moduleId } = await context.params;

  try {
    const result = await completeStudentModule(
      auth.session.studentId,
      moduleId,
    );
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to complete module.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
