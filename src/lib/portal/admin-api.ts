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

export async function searchAdminPortal(query: string): Promise<AdminSearchResult> {
  const response = await fetch(
    `/api/portal/admin/search?q=${encodeURIComponent(query)}`,
  );
  if (!response.ok) {
    throw new Error("Search failed.");
  }
  return response.json() as Promise<AdminSearchResult>;
}
