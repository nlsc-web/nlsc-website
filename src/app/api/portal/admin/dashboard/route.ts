import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { getAdminPortalData } from "@/lib/portal/services/admin-portal";

export async function GET() {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  try {
    const data = await getAdminPortalData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to load admin dashboard data." },
      { status: 500 },
    );
  }
}
