import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isDatabaseUnavailable } from "@/lib/portal/db-unavailable";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const name = body.name?.trim();
    const email = body.email?.trim();
    const subject = body.subject?.trim() || "General inquiry";
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    await prisma.contactInquiry.create({
      data: { name, email, subject, message },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      console.error("[contact] Database unavailable:", error);
      return NextResponse.json(
        {
          error:
            "Unable to save your message right now. Please try again in a few minutes or call us directly.",
        },
        { status: 503 },
      );
    }

    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }
}
