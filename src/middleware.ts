import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PORTAL_SESSION_COOKIE,
  verifyPortalSessionToken,
  type PortalRole,
} from "@/lib/portal/session-core";

function getSessionRole(session: { role?: PortalRole }): PortalRole {
  return session.role === "admin" ? "admin" : "student";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isStudentArea = pathname.startsWith("/portal/dashboard");
  const isAdminArea = pathname.startsWith("/portal/admin");

  if (!isStudentArea && !isAdminArea) {
    return NextResponse.next();
  }

  const token = request.cookies.get(PORTAL_SESSION_COOKIE)?.value;
  const session = token ? await verifyPortalSessionToken(token) : null;

  if (!session) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  const role = getSessionRole(session);

  if (isStudentArea && role === "admin") {
    return NextResponse.redirect(new URL("/portal/admin/dashboard", request.url));
  }

  if (isAdminArea && role !== "admin") {
    return NextResponse.redirect(new URL("/portal/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/dashboard/:path*", "/portal/admin/:path*"],
};
