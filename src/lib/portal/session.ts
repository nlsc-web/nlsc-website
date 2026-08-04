import { cookies } from "next/headers";
import {
  PORTAL_SESSION_COOKIE,
  verifyPortalSessionToken,
} from "@/lib/portal/session-core";

export {
  PORTAL_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  portalSessionCookieOptions,
  createPortalSessionToken,
  verifyPortalSessionToken,
  type PortalSession,
  type PortalRole,
} from "@/lib/portal/session-core";

export async function getPortalSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyPortalSessionToken(token);
}
