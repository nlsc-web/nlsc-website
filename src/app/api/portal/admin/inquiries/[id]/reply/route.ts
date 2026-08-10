import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { replyToContactInquiry } from "@/lib/portal/services/admin-mutations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type ReplyBody = {
  message?: string;
};

export async function POST(request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { id } = await context.params;

  let body: ReplyBody;
  try {
    body = (await request.json()) as ReplyBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const inquiry = await replyToContactInquiry(id, body.message ?? "");
    return NextResponse.json({
      success: true,
      inquiry: { id: inquiry.id, status: inquiry.status },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to send reply.";
    const status = /not configured|Gmail login failed|GMAIL_/i.test(message)
      ? 503
      : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
