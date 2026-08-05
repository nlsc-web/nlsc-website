import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { createPortalCourse } from "@/lib/portal/services/admin-mutations";

type CreateCourseBody = {
  id?: string;
  code?: string;
  title?: string;
  duration?: string;
  description?: string;
  instructorId?: string;
  status?: "draft" | "active" | "pending";
};

export async function POST(request: Request) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  let body: CreateCourseBody;
  try {
    body = (await request.json()) as CreateCourseBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const id = body.id?.trim();
  const code = body.code?.trim();
  const title = body.title?.trim();
  const duration = body.duration?.trim();

  if (!id || !code || !title || !duration) {
    return NextResponse.json(
      { error: "ID, code, title, and duration are required." },
      { status: 400 },
    );
  }

  try {
    const course = await createPortalCourse({
      id,
      code,
      title,
      duration,
      description: body.description?.trim(),
      instructorId: body.instructorId?.trim(),
      status: body.status,
    });
    return NextResponse.json({
      success: true,
      course: { id: course.id, code: course.code, title: course.title },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create course.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
