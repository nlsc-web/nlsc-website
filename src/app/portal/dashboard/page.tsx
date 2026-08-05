import type { Metadata } from "next";
import StudentDashboardView from "@/components/portal/lms/StudentDashboardView";
import { loadStudentPortalPage } from "@/lib/portal/load-student-portal";

export const metadata: Metadata = {
  title: "LMS Dashboard | Next Level Solutions Campus",
};

export default async function PortalDashboardPage() {
  const { session, portalData } = await loadStudentPortalPage();

  return (
    <StudentDashboardView
      studentName={session.name}
      studentId={session.studentId}
      portalData={portalData}
    />
  );
}
