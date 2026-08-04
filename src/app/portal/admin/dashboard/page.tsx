import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminDashboardView from "@/components/portal/lms/AdminDashboardView";
import { getPortalSession } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Admin Dashboard | Next Level Solutions Campus",
};

export default async function AdminDashboardPage() {
  const session = await getPortalSession();
  if (!session) redirect("/portal");
  if (session.role !== "admin") redirect("/portal/dashboard");

  return (
    <AdminDashboardView
      adminName={session.name}
      adminId={session.studentId}
    />
  );
}
