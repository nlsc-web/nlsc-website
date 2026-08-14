import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { setCourseModuleVideoUrl } from "@/lib/portal/services/admin-mutations";
import { prisma } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string; moduleId: string }>;
};

const MAX_BYTES = 80 * 1024 * 1024; // 80MB
const ALLOWED_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
]);

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { id: courseId, moduleId } = await context.params;

  const module = await prisma.courseModule.findFirst({
    where: { id: moduleId, courseId },
  });
  if (!module) {
    return NextResponse.json({ error: "Module not found." }, { status: 404 });
  }

  let body: { videoUrl?: string | null };
  try {
    body = (await request.json()) as { videoUrl?: string | null };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const updated = await setCourseModuleVideoUrl(
      moduleId,
      body.videoUrl ?? null,
    );
    return NextResponse.json({
      success: true,
      module: {
        id: updated.id,
        videoUrl: updated.videoUrl,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save video URL.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { id: courseId, moduleId } = await context.params;

  const module = await prisma.courseModule.findFirst({
    where: { id: moduleId, courseId },
  });
  if (!module) {
    return NextResponse.json({ error: "Module not found." }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid upload request." },
      { status: 400 },
    );
  }

  const file = formData.get("video");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Video file is required." },
      { status: 400 },
    );
  }

  if (file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Video must be between 1 byte and 80MB." },
      { status: 400 },
    );
  }

  const type = file.type || "video/mp4";
  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json(
      { error: "Only MP4, WebM, MOV, or AVI videos are allowed." },
      { status: 400 },
    );
  }

  const ext =
    path.extname(file.name) ||
    (type === "video/webm"
      ? ".webm"
      : type === "video/quicktime"
        ? ".mov"
        : ".mp4");
  const filename = `${moduleId}-${Date.now()}-${sanitizeFilename(path.basename(file.name, path.extname(file.name)))}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "modules");
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  const videoUrl = `/uploads/modules/${filename}`;
  const updated = await setCourseModuleVideoUrl(moduleId, videoUrl);

  return NextResponse.json({
    success: true,
    module: {
      id: updated.id,
      videoUrl: updated.videoUrl,
    },
  });
}
