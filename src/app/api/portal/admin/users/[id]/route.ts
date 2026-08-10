import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import {
  deletePortalUser,
  updatePortalUser,
  updatePortalUserStatus,
} from "@/lib/portal/services/admin-mutations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UserPatchBody = {
  status?: "active" | "pending" | "suspended";
  name?: string;
  email?: string;
  department?: string;
  password?: string;
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

  try {
    if (
      body.status === "active" ||
      body.status === "pending" ||
      body.status === "suspended"
    ) {
      const user = await updatePortalUserStatus(id, body.status);
      return NextResponse.json({
        success: true,
        user: { id: user.id, status: user.status },
      });
    }

    if (typeof body.name === "string" && typeof body.email === "string") {
      const user = await updatePortalUser(id, {
        name: body.name,
        email: body.email,
        department: body.department,
        password: body.password,
      });
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          department: user.department,
        },
      });
    }

    return NextResponse.json(
      {
        error:
          'Provide a status ("active", "pending", "suspended") or name and email to update.',
      },
      { status: 400 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update user.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { id } = await context.params;

  try {
    await deletePortalUser(id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete user.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
