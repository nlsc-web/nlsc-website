import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { searchAdminPortal } from "@/lib/portal/services/admin-mutations";

export async function GET(request: Request) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  try {
    const results = await searchAdminPortal(q);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: "Unable to perform search." },
      { status: 500 },
    );
  }
}
