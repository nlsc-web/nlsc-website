import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await requirePortalSession("admin");
  if (auth.error) return auth.error;

  try {
    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      inquiries: inquiries.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        subject: item.subject ?? "General inquiry",
        message: item.message,
        status: item.status,
        createdAt: item.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Admin inquiries list error:", error);
    return NextResponse.json(
      { error: "Unable to load messages." },
      { status: 500 },
    );
  }
}
