import { redirect } from "next/navigation";
import { getStudentPortalData } from "@/lib/portal/services/student-portal";
import { getPortalSession } from "@/lib/portal/session";
import { STUDENT_PORTAL_PATH } from "@/lib/site-config";

export async function loadStudentPortalPage() {
  const session = await getPortalSession();
  if (!session) redirect(STUDENT_PORTAL_PATH);
  if (session.role === "admin") redirect("/portal/admin/dashboard");

  const portalData = await getStudentPortalData(session.studentId);

  return {
    session,
    portalData,
  };
}
