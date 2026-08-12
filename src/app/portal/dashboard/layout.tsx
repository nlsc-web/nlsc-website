import { redirect } from "next/navigation";
import { getPortalSession } from "@/lib/portal/session";
import { STUDENT_PORTAL_PATH } from "@/lib/site-config";

export default async function PortalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getPortalSession();
  if (!session) redirect(STUDENT_PORTAL_PATH);

  return children;
}
