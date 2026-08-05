import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
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

function getStudentEnvCredentials() {
  return {
    studentId: process.env.PORTAL_DEMO_STUDENT_ID ?? "NLSC2026",
    password: process.env.PORTAL_DEMO_PASSWORD ?? "nlsc@student",
    name: process.env.PORTAL_DEMO_STUDENT_NAME ?? "Priya Fernando",
  };
}

function getAdminEnvCredentials() {
  return {
    adminId: process.env.PORTAL_DEMO_ADMIN_ID ?? "NLSC-ADMIN",
    password: process.env.PORTAL_DEMO_ADMIN_PASSWORD ?? "nlsc@admin",
    name: process.env.PORTAL_DEMO_ADMIN_NAME ?? "NLSC Administrator",
  };
}

async function authenticateFromDatabase(
  userId: string,
  password: string,
  role: PortalRole,
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== role || user.status === "suspended") {
    return null;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return { id: user.id, name: user.name, role };
}

async function authenticateUser(
  userId: string,
  password: string,
  role: PortalRole,
) {
  try {
    const dbUser = await authenticateFromDatabase(userId, password, role);
    if (dbUser) return dbUser;
  } catch {
    // Database unavailable — fall through to env credentials
  }

  if (role === "admin") {
    const credentials = getAdminEnvCredentials();
    if (userId === credentials.adminId && password === credentials.password) {
      return {
        id: credentials.adminId,
        name: credentials.name,
        role: "admin" as const,
      };
    }
    return null;
  }

  const credentials = getStudentEnvCredentials();
  if (userId === credentials.studentId && password === credentials.password) {
    return {
      id: credentials.studentId,
      name: credentials.name,
      role: "student" as const,
    };
  }

  return null;
}

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const userId = body.studentId?.trim();
  const password = body.password?.trim();
  const role: PortalRole = body.role === "admin" ? "admin" : "student";

  if (!userId || !password) {
    return NextResponse.json(
      { error: "User ID and password are required." },
      { status: 400 },
    );
  }

  const user = await authenticateUser(userId, password, role);

  if (!user) {
    return NextResponse.json(
      {
        error:
          role === "admin"
            ? "Invalid admin ID or password."
            : "Invalid student ID or password.",
      },
      { status: 401 },
    );
  }

  const token = await createPortalSessionToken({
    studentId: user.id,
    name: user.name,
    role: user.role,
  });

  const response = NextResponse.json({ success: true, role: user.role });
  response.cookies.set(PORTAL_SESSION_COOKIE, token, portalSessionCookieOptions);
  return response;
}
