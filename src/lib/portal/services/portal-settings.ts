import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export type PortalSettingsData = {
  profile: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "admin" | "student" | "instructor";
  };
  notifications: {
    emailAlerts: boolean;
    portalAlerts: boolean;
    weeklyDigest: boolean;
  };
  campus: {
    campusDisplayName: string;
    academicYear: string;
    requireEnrollmentApproval: boolean;
  } | null;
};

export type UpdatePortalSettingsInput = {
  email?: string;
  phone?: string | null;
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
};

export async function getPortalSettings(
  userId: string,
  role: "admin" | "student",
): Promise<PortalSettingsData> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { notificationPrefs: true },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  let campus: PortalSettingsData["campus"] = null;
  if (role === "admin") {
    const settings =
      (await prisma.campusSettings.findFirst()) ??
      (await prisma.campusSettings.create({
        data: { id: 1 },
      }));
    campus = {
      campusDisplayName: settings.campusDisplayName,
      academicYear: settings.academicYear,
      requireEnrollmentApproval: settings.requireEnrollmentApproval,
    };
  }

  return {
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      role: user.role,
    },
    notifications: {
      emailAlerts: user.notificationPrefs?.emailAlerts ?? true,
      portalAlerts: user.notificationPrefs?.portalAlerts ?? true,
      weeklyDigest: user.notificationPrefs?.weeklyDigest ?? role === "admin",
    },
    campus,
  };
}

export async function updatePortalSettings(
  userId: string,
  role: "admin" | "student",
  input: UpdatePortalSettingsInput,
): Promise<PortalSettingsData> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { notificationPrefs: true },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (input.newPassword) {
    if (!input.currentPassword) {
      throw new Error("Current password is required to set a new password.");
    }
    if (input.newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters.");
    }
    const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!valid) {
      throw new Error("Current password is incorrect.");
    }
  }

  if (input.email && input.email !== user.email) {
    const emailTaken = await prisma.user.findFirst({
      where: { email: input.email, NOT: { id: userId } },
    });
    if (emailTaken) {
      throw new Error(`Email "${input.email}" is already registered.`);
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      email: input.email?.trim() || undefined,
      phone:
        input.phone === undefined
          ? undefined
          : input.phone === null
            ? null
            : input.phone.trim() || null,
      passwordHash: input.newPassword
        ? await bcrypt.hash(input.newPassword, 10)
        : undefined,
    },
  });

  if (input.notifications) {
    await prisma.userNotificationPrefs.upsert({
      where: { userId },
      create: {
        userId,
        emailAlerts: input.notifications.emailAlerts ?? true,
        portalAlerts: input.notifications.portalAlerts ?? true,
        weeklyDigest: input.notifications.weeklyDigest ?? false,
      },
      update: {
        emailAlerts: input.notifications.emailAlerts,
        portalAlerts: input.notifications.portalAlerts,
        weeklyDigest: input.notifications.weeklyDigest,
      },
    });
  }

  if (role === "admin" && input.campus) {
    await prisma.campusSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        campusDisplayName:
          input.campus.campusDisplayName?.trim() ||
          "Next Level Solutions Campus",
        academicYear: input.campus.academicYear?.trim() || "2026",
        requireEnrollmentApproval:
          input.campus.requireEnrollmentApproval ?? true,
      },
      update: {
        campusDisplayName: input.campus.campusDisplayName?.trim(),
        academicYear: input.campus.academicYear?.trim(),
        requireEnrollmentApproval: input.campus.requireEnrollmentApproval,
      },
    });
  }

  return getPortalSettings(userId, role);
}
