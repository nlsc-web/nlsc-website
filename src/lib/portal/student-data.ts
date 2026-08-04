import { lmsTokens } from "./lms-tokens";

export type AssignmentStatus = "pending" | "submitted" | "overdue";

export const studentCourses = [
  {
    id: "fast-track-4days",
    code: "ACC 4D",
    name: "4 Days Fast Track Course",
    instructor: "NLSC Accounting Faculty",
    progress: 35,
    color: lmsTokens.gold500,
    duration: "4 Days",
    modules: 12,
    completedModules: 4,
    nextSession: "Thu, 10:00 AM",
    status: "active" as const,
  },
  {
    id: "all-inclusive-20days",
    code: "ACC 20D",
    name: "20 Days All Inclusive Course",
    instructor: "NLSC Accounting Faculty",
    progress: 10,
    color: lmsTokens.good,
    duration: "20 Days",
    modules: 28,
    completedModules: 3,
    nextSession: "Wed, 3:00 PM",
    status: "active" as const,
  },
];

export const studentAssignments = [
  {
    id: "a1",
    course: "ACC 4D",
    title: "Invoice Processing — Practical Worksheet",
    due: "Aug 05",
    status: "pending" as AssignmentStatus,
    type: "Worksheet",
    points: 20,
  },
  {
    id: "a2",
    course: "ACC 20D",
    title: "Taxation Basics — Module Review",
    due: "Aug 08",
    status: "pending" as AssignmentStatus,
    type: "Review",
    points: 15,
  },
  {
    id: "a3",
    course: "ACC 4D",
    title: "Accounting Software Lab Submission",
    due: "Aug 09",
    status: "submitted" as AssignmentStatus,
    type: "Lab",
    points: 25,
  },
  {
    id: "a4",
    course: "ACC 20D",
    title: "HR & Auditing Case Study",
    due: "Aug 12",
    status: "pending" as AssignmentStatus,
    type: "Case Study",
    points: 30,
  },
];

export const gradeData = [
  { course: "ACC 4D", grade: 82 },
  { course: "ACC 20D", grade: 74 },
];

export const studentAnnouncements = [
  {
    from: "NLSC Admissions",
    text: "4 Days Fast Track batch orientation moved to Room 2, 4pm Thursday.",
    time: "2h ago",
  },
  {
    from: "Registrar",
    text: "Course fee deadline extended to August 20 for August intake.",
    time: "1d ago",
  },
  {
    from: "NLSC Faculty",
    text: "Practical accounting worksheet rubric updated — check your course notes.",
    time: "2d ago",
  },
];

export const weekSchedule = [
  "Tue — Practical Accounting Lab, 10:00 AM",
  "Wed — Taxation revision session, 3:00 PM",
  "Fri — Career guidance workshop, 4:00 PM",
];

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export const studentAttendanceSummary = {
  overall: 92,
  required: 80,
  present: 23,
  absent: 2,
  late: 1,
  totalSessions: 26,
};

export const studentAttendanceRecords: Array<{
  id: string;
  date: string;
  course: string;
  session: string;
  time: string;
  status: AttendanceStatus;
}> = [
  {
    id: "att1",
    date: "Aug 04",
    course: "ACC 4D",
    session: "Practical Accounting Lab",
    time: "10:00 AM",
    status: "present",
  },
  {
    id: "att2",
    date: "Aug 03",
    course: "ACC 20D",
    session: "Taxation Basics",
    time: "3:00 PM",
    status: "present",
  },
  {
    id: "att3",
    date: "Aug 02",
    course: "ACC 4D",
    session: "Accounting Software Intro",
    time: "10:00 AM",
    status: "late",
  },
  {
    id: "att4",
    date: "Aug 01",
    course: "ACC 20D",
    session: "HR & Auditing Overview",
    time: "3:00 PM",
    status: "present",
  },
  {
    id: "att5",
    date: "Jul 31",
    course: "ACC 4D",
    session: "Invoice Processing Workshop",
    time: "10:00 AM",
    status: "absent",
  },
  {
    id: "att6",
    date: "Jul 30",
    course: "ACC 20D",
    session: "Career Guidance Seminar",
    time: "4:00 PM",
    status: "present",
  },
];

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
