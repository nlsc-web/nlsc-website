import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { updatePortalUserStatus } from "@/lib/portal/services/admin-mutations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UserPatchBody = {
  status?: "active" | "pending" | "suspended";
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { id } = await context.params;

  let body: UserPatchBody;
  try {
    body = (await request.json()) as UserPatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    body.status !== "active" &&
    body.status !== "pending" &&
    body.status !== "suspended"
  ) {
    return NextResponse.json(
      { error: 'Status must be "active", "pending", or "suspended".' },
      { status: 400 },
    );
  }

  try {
    const user = await updatePortalUserStatus(id, body.status);
    return NextResponse.json({
      success: true,
      user: { id: user.id, status: user.status },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update user.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
