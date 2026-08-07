import { NextResponse } from "next/server";
import { requirePortalSession } from "@/lib/portal/auth";
import {
  getPortalSettings,
  updatePortalSettings,
} from "@/lib/portal/services/portal-settings";

export async function GET() {
  const auth = await requirePortalSession();
  if (auth.error) return auth.error;

  const role = auth.session.role === "admin" ? "admin" : "student";

  try {
    const settings = await getPortalSettings(auth.session.studentId, role);
    return NextResponse.json(settings);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load settings.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

type SettingsPatchBody = {
  email?: string;
  phone?: string;
  notifications?: {
    emailAlerts?: boolean;
    portalAlerts?: boolean;
    weeklyDigest?: boolean;
  };
  campus?: {
    campusDisplayName?: string;
    academicYear?: string;
    requireEnrollmentApproval?: boolean;
  };
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export async function PATCH(request: Request) {
  const auth = await requirePortalSession();
  if (auth.error) return auth.error;

  const role = auth.session.role === "admin" ? "admin" : "student";

  let body: SettingsPatchBody;
  try {
    body = (await request.json()) as SettingsPatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.newPassword) {
    if (body.newPassword !== body.confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation do not match." },
        { status: 400 },
      );
    }
  }

  try {
    const settings = await updatePortalSettings(auth.session.studentId, role, {
      email: body.email?.trim(),
      phone: body.phone,
      notifications: body.notifications,
      campus: role === "admin" ? body.campus : undefined,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save settings.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
