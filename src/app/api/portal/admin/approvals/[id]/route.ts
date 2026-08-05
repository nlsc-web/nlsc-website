import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { updateApproval } from "@/lib/portal/services/admin-mutations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type ApprovalBody = {
  action?: "approve" | "reject";
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { id } = await context.params;

  let body: ApprovalBody;
  try {
    body = (await request.json()) as ApprovalBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.action !== "approve" && body.action !== "reject") {
    return NextResponse.json(
      { error: 'Action must be "approve" or "reject".' },
      { status: 400 },
    );
  }

  try {
    const approval = await updateApproval(id, body.action);
    return NextResponse.json({ success: true, approval });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update approval.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
