import { redirect } from "next/navigation";
import { getStudentPortalData } from "@/lib/portal/services/student-portal";
import { getPortalSession } from "@/lib/portal/session";

export async function loadStudentPortalPage() {
  const session = await getPortalSession();
  if (!session) redirect("/portal");
  if (session.role === "admin") redirect("/portal/admin/dashboard");

  const portalData = await getStudentPortalData(session.studentId);

  return {
    session,
    portalData,
  };
}
