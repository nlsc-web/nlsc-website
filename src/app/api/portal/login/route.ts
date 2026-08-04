import { NextResponse } from "next/server";
import {
  createPortalSessionToken,
  portalSessionCookieOptions,
  PORTAL_SESSION_COOKIE,
  type PortalRole,
} from "@/lib/portal/session";

type LoginBody = {
  studentId?: string;
  password?: string;
  role?: PortalRole;
};

function getStudentCredentials() {
  return {
    studentId: process.env.PORTAL_DEMO_STUDENT_ID ?? "NLSC2026",
    password: process.env.PORTAL_DEMO_PASSWORD ?? "nlsc@student",
    name: process.env.PORTAL_DEMO_STUDENT_NAME ?? "Priya Fernando",
  };
}

function getAdminCredentials() {
  return {
    adminId: process.env.PORTAL_DEMO_ADMIN_ID ?? "NLSC-ADMIN",
    password: process.env.PORTAL_DEMO_ADMIN_PASSWORD ?? "nlsc@admin",
    name: process.env.PORTAL_DEMO_ADMIN_NAME ?? "NLSC Administrator",
  };
}

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const studentId = body.studentId?.trim();
  const password = body.password?.trim();
  const role: PortalRole = body.role === "admin" ? "admin" : "student";

  if (!studentId || !password) {
    return NextResponse.json(
      { error: "User ID and password are required." },
      { status: 400 },
    );
  }

  if (role === "admin") {
    const credentials = getAdminCredentials();

    if (studentId !== credentials.adminId || password !== credentials.password) {
      return NextResponse.json(
        { error: "Invalid admin ID or password." },
        { status: 401 },
      );
    }

    const token = await createPortalSessionToken({
      studentId: credentials.adminId,
      name: credentials.name,
      role: "admin",
    });

    const response = NextResponse.json({ success: true, role: "admin" });
    response.cookies.set(PORTAL_SESSION_COOKIE, token, portalSessionCookieOptions);
    return response;
  }

  const credentials = getStudentCredentials();

  if (studentId !== credentials.studentId || password !== credentials.password) {
    return NextResponse.json(
      { error: "Invalid student ID or password." },
      { status: 401 },
    );
  }

  const token = await createPortalSessionToken({
    studentId: credentials.studentId,
    name: credentials.name,
    role: "student",
  });

  const response = NextResponse.json({ success: true, role: "student" });
  response.cookies.set(PORTAL_SESSION_COOKIE, token, portalSessionCookieOptions);
  return response;
}
