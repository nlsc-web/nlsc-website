import { redirect } from "next/navigation";
import { getPortalSession } from "@/lib/portal/session";

export default async function PortalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getPortalSession();
  if (!session) redirect("/portal");

  return children;
}
