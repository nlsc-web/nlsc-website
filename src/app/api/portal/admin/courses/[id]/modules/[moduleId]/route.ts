import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { deleteCourseModule } from "@/lib/portal/services/admin-mutations";

type RouteContext = {
  params: Promise<{ id: string; moduleId: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { moduleId } = await context.params;

  try {
    const result = await deleteCourseModule(moduleId);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete module.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
