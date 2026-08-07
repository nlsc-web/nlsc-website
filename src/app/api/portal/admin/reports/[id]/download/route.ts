import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { getReportDownload } from "@/lib/portal/services/admin-reports";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  const { id } = await context.params;

  try {
    const { csv, filename } = await getReportDownload(id);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to download report.";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
