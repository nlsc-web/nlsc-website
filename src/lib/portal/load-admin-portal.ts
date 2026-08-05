import { redirect } from "next/navigation";
import { getAdminPortalData } from "@/lib/portal/services/admin-portal";
import { getPortalSession } from "@/lib/portal/session";

export async function loadAdminPortalPage() {
  const session = await getPortalSession();
  if (!session) redirect("/portal");
  if (session.role !== "admin") redirect("/portal/dashboard");

  const portalData = await getAdminPortalData();

  return {
    session,
    portalData,
  };
}
