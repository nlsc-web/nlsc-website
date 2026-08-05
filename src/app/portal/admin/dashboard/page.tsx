import type { Metadata } from "next";
import AdminDashboardView from "@/components/portal/lms/AdminDashboardView";
import { loadAdminPortalPage } from "@/lib/portal/load-admin-portal";

export const metadata: Metadata = {
  title: "Admin Dashboard | Next Level Solutions Campus",
};

export default async function AdminDashboardPage() {
  const { session, portalData } = await loadAdminPortalPage();

  return (
    <AdminDashboardView
      adminName={session.name}
      adminId={session.studentId}
      portalData={portalData}
    />
  );
}
