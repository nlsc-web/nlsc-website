import { NextResponse } from "next/server";
import { getPortalSession } from "@/lib/portal/session";
import type { PortalSession } from "@/lib/portal/session-core";

type AuthResult =
  | { session: PortalSession; error?: never }
  | { session?: never; error: NextResponse };

export async function requirePortalSession(
  role?: "student" | "admin",
): Promise<AuthResult> {
  const session = await getPortalSession();

  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }

  if (role && session.role !== role) {
    return {
      error: NextResponse.json({ error: "Forbidden." }, { status: 403 }),
    };
  }

  return { session };
}
