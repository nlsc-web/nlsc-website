import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import {
  createCourseModule,
  listCourseModules,
} from "@/lib/portal/services/admin-mutations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type CreateModuleBody = {
  title?: string;
  duration?: string;
  type?: "video" | "document" | "quiz";
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { id: courseId } = await context.params;

  try {
    const modules = await listCourseModules(courseId);
    return NextResponse.json({
      modules: modules.map((item) => ({
        id: item.id,
        title: item.title,
        duration: item.duration,
        type: item.type,
        sortOrder: item.sortOrder,
        videoUrl: item.videoUrl,
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load modules.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { id: courseId } = await context.params;

  let body: CreateModuleBody;
  try {
    body = (await request.json()) as CreateModuleBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const module = await createCourseModule(courseId, {
      title: body.title ?? "",
      duration: body.duration ?? "",
      type: body.type ?? "video",
    });
    return NextResponse.json({
      success: true,
      module: {
        id: module.id,
        title: module.title,
        duration: module.duration,
        type: module.type,
        sortOrder: module.sortOrder,
        videoUrl: module.videoUrl,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create module.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
