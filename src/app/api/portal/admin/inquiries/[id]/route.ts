import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import {
  deleteContactInquiry,
  updateContactInquiryStatus,
} from "@/lib/portal/services/admin-mutations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type InquiryPatchBody = {
  status?: "unread" | "read";
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { id } = await context.params;

  let body: InquiryPatchBody;
  try {
    body = (await request.json()) as InquiryPatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.status !== "unread" && body.status !== "read") {
    return NextResponse.json(
      { error: 'Status must be "unread" or "read".' },
      { status: 400 },
    );
  }

  try {
    const inquiry = await updateContactInquiryStatus(id, body.status);
    return NextResponse.json({
      success: true,
      inquiry: { id: inquiry.id, status: inquiry.status },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update message.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { id } = await context.params;

  try {
    await deleteContactInquiry(id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete message.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
