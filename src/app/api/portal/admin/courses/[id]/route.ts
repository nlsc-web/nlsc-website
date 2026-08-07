import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { updatePortalCourseStatus } from "@/lib/portal/services/admin-mutations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type CoursePatchBody = {
  status?: "draft" | "active" | "pending";
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { id } = await context.params;

  let body: CoursePatchBody;
  try {
    body = (await request.json()) as CoursePatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    body.status !== "draft" &&
    body.status !== "active" &&
    body.status !== "pending"
  ) {
    return NextResponse.json(
      { error: 'Status must be "draft", "active", or "pending".' },
      { status: 400 },
    );
  }

  try {
    const course = await updatePortalCourseStatus(id, body.status);
    return NextResponse.json({
      success: true,
      course: { id: course.id, status: course.status },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update course.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
