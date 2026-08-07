import type { AdminPortalData } from "@/lib/portal/types/admin-portal";
import type { AdminSearchResult } from "@/lib/portal/services/admin-mutations";

export async function fetchAdminDashboard(): Promise<AdminPortalData> {
  const response = await fetch("/api/portal/admin/dashboard");
  if (!response.ok) {
    throw new Error("Unable to refresh dashboard.");
  }
  return response.json() as Promise<AdminPortalData>;
}

export async function patchApproval(
  id: string,
  action: "approve" | "reject",
) {
  const response = await fetch(`/api/portal/admin/approvals/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Approval action failed.");
  }
  return data;
}

export async function postAdminUser(body: {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor";
  courseId?: string;
  department?: string;
}) {
  const response = await fetch("/api/portal/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Unable to create user.");
  }
  return data;
}

export async function postAdminCourse(body: {
  id: string;
  code: string;
  title: string;
  duration: string;
  description?: string;
  instructorId?: string;
  status?: "draft" | "active" | "pending";
}) {
  const response = await fetch("/api/portal/admin/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Unable to create course.");
  }
  return data;
}

export async function postAdminAnnouncement(body: {
  title: string;
  body: string;
  audience?: "All" | "Students" | "Instructors" | "Staff";
  status?: "published" | "draft" | "scheduled";
}) {
  const response = await fetch("/api/portal/admin/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Unable to post announcement.");
  }
  return data;
}

export async function patchAdminAnnouncementStatus(
  id: string,
  status: "published" | "draft" | "scheduled",
) {
  const response = await fetch(`/api/portal/admin/announcements/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Unable to update announcement.");
  }
  return data;
}

export async function deleteAdminAnnouncement(id: string) {
  const response = await fetch(`/api/portal/admin/announcements/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Unable to delete announcement.");
  }
  return data;
}

export async function searchAdminPortal(query: string): Promise<AdminSearchResult> {
  const response = await fetch(
    `/api/portal/admin/search?q=${encodeURIComponent(query)}`,
  );
  if (!response.ok) {
    throw new Error("Search failed.");
  }
  return response.json() as Promise<AdminSearchResult>;
}

export async function patchContactInquiry(
  id: string,
  status: "unread" | "read",
) {
  const response = await fetch(`/api/portal/admin/inquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Unable to update message.");
  }
  return data;
}

export async function deleteContactInquiry(id: string) {
  const response = await fetch(`/api/portal/admin/inquiries/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Unable to delete message.");
  }
  return data;
}

export async function patchAdminUserStatus(
  id: string,
  status: "active" | "pending" | "suspended",
) {
  const response = await fetch(`/api/portal/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Unable to update user.");
  }
  return data;
}

export async function patchAdminCourseStatus(
  id: string,
  status: "draft" | "active" | "pending",
) {
  const response = await fetch(`/api/portal/admin/courses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Unable to update course.");
  }
  return data;
}

export async function postAdminReport(body: {
  title: string;
  category: "enrollment" | "attendance" | "performance" | "financial";
  period: string;
  format?: "PDF" | "CSV" | "XLSX";
}) {
  const response = await fetch("/api/portal/admin/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Unable to generate report.");
  }
  return data;
}

export function getAdminReportDownloadUrl(id: string) {
  return `/api/portal/admin/reports/${id}/download`;
}

export type PortalSettingsResponse = {
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

export async function fetchPortalSettings(): Promise<PortalSettingsResponse> {
  const response = await fetch("/api/portal/settings");
  if (!response.ok) {
    throw new Error("Unable to load settings.");
  }
  return response.json() as Promise<PortalSettingsResponse>;
}

export async function patchPortalSettings(body: {
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
}) {
  const response = await fetch("/api/portal/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Unable to save settings.");
  }
  return data as { success: true; settings: PortalSettingsResponse };
}
