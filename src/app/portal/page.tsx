import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PortalLoginForm from "@/components/portal/PortalLoginForm";
import { getPortalSession } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "LMS Portal | Next Level Solutions Campus",
  description:
    "Sign in to the NLSC Learning Management System — Student or Admin Portal.",
};

export default async function PortalLoginPage() {
  const session = await getPortalSession();
  if (session?.role === "admin") redirect("/portal/admin/dashboard");
  if (session) redirect("/portal/dashboard");

  return <PortalLoginForm />;
}
