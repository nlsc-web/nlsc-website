import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import {
  deletePortalAnnouncement,
  updatePortalAnnouncementStatus,
} from "@/lib/portal/services/admin-mutations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type AnnouncementPatchBody = {
  status?: "published" | "draft" | "scheduled";
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { id } = await context.params;

  let body: AnnouncementPatchBody;
  try {
    body = (await request.json()) as AnnouncementPatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    body.status !== "published" &&
    body.status !== "draft" &&
    body.status !== "scheduled"
  ) {
    return NextResponse.json(
      { error: 'Status must be "published", "draft", or "scheduled".' },
      { status: 400 },
    );
  }

  try {
    const announcement = await updatePortalAnnouncementStatus(id, body.status);
    return NextResponse.json({
      success: true,
      announcement: { id: announcement.id, status: announcement.status },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update announcement.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { id } = await context.params;

  try {
    await deletePortalAnnouncement(id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete announcement.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
