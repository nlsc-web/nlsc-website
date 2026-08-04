import type { Metadata } from "next";
import { redirect } from "next/navigation";
import StudentDashboardView from "@/components/portal/lms/StudentDashboardView";
import { getPortalSession } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "LMS Dashboard | Next Level Solutions Campus",
};

export default async function PortalDashboardPage() {
  const session = await getPortalSession();
  if (!session) redirect("/portal");
  if (session.role === "admin") redirect("/portal/admin/dashboard");

  return (
    <StudentDashboardView
      studentName={session.name}
      studentId={session.studentId}
    />
  );
}
