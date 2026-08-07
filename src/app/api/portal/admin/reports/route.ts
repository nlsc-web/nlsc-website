import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { createPortalReport } from "@/lib/portal/services/admin-reports";

type CreateReportBody = {
  title?: string;
  category?: "enrollment" | "attendance" | "performance" | "financial";
  period?: string;
  format?: "PDF" | "CSV" | "XLSX";
};

export async function POST(request: Request) {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  let body: CreateReportBody;
  try {
    body = (await request.json()) as CreateReportBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = body.title?.trim();
  const period = body.period?.trim();
  const category = body.category;
  const format = body.format ?? "CSV";

  if (!title || !period || !category) {
    return NextResponse.json(
      { error: "Title, category, and period are required." },
      { status: 400 },
    );
  }

  if (
    category !== "enrollment" &&
    category !== "attendance" &&
    category !== "performance" &&
    category !== "financial"
  ) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  if (format !== "PDF" && format !== "CSV" && format !== "XLSX") {
    return NextResponse.json({ error: "Invalid format." }, { status: 400 });
  }

  try {
    const report = await createPortalReport({
      title,
      category,
      period,
      format,
    });
    return NextResponse.json({
      success: true,
      report: { id: report.id, title: report.title },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate report.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
