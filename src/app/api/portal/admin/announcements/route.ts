import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { createPortalAnnouncement } from "@/lib/portal/services/admin-mutations";

type CreateAnnouncementBody = {
  title?: string;
  body?: string;
  audience?: "All" | "Students" | "Instructors" | "Staff";
  status?: "published" | "draft" | "scheduled";
  fromLabel?: string;
};

export async function POST(request: Request) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  let body: CreateAnnouncementBody;
  try {
    body = (await request.json()) as CreateAnnouncementBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = body.title?.trim();
  const announcementBody = body.body?.trim();

  if (!title || !announcementBody) {
    return NextResponse.json(
      { error: "Title and body are required." },
      { status: 400 },
    );
  }

  try {
    const announcement = await createPortalAnnouncement(
      {
        title,
        body: announcementBody,
        audience: body.audience,
        status: body.status,
        fromLabel: body.fromLabel?.trim(),
      },
      auth.session.studentId,
    );
    return NextResponse.json({
      success: true,
      announcement: { id: announcement.id, title: announcement.title },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create announcement.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
