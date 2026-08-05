export type {
  AssignmentStatus,
  AttendanceStatus,
  StudentAnnouncement,
  StudentAssignment,
  StudentAttendanceRecord,
  StudentAttendanceSummary,
  StudentCourse,
  StudentPortalData,
} from "@/lib/portal/types/student-portal";

const GENERIC_NAME_PARTS = new Set([
  "nlsc",
  "student",
  "admin",
  "administrator",
  "demo",
  "user",
]);

/** First meaningful given name — skips institutional labels like "NLSC" / "Student". */
export function getGreetingName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  for (const part of parts) {
    if (!GENERIC_NAME_PARTS.has(part.toLowerCase())) {
      return part;
    }
  }
  return null;
}

export function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

/** e.g. "Good Morning, Priya" or "Good Afternoon!" when no personal name is available */
export function getDashboardGreeting(fullName: string, date = new Date()) {
  const time = getTimeGreeting(date);
  const name = getGreetingName(fullName);
  return name ? `${time}, ${name}` : `${time}!`;
}

export function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
