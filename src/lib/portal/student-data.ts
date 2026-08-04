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
  },
  {
    id: "all-inclusive-20days",
    code: "ACC 20D",
    name: "20 Days All Inclusive Course",
    instructor: "NLSC Accounting Faculty",
    progress: 10,
    color: lmsTokens.good,
  },
];

export const studentAssignments = [
  {
    course: "ACC 4D",
    title: "Invoice Processing — Practical Worksheet",
    due: "Aug 05",
    status: "pending" as AssignmentStatus,
  },
  {
    course: "ACC 20D",
    title: "Taxation Basics — Module Review",
    due: "Aug 08",
    status: "pending" as AssignmentStatus,
  },
  {
    course: "ACC 4D",
    title: "Accounting Software Lab Submission",
    due: "Aug 09",
    status: "submitted" as AssignmentStatus,
  },
  {
    course: "ACC 20D",
    title: "HR & Auditing Case Study",
    due: "Aug 12",
    status: "pending" as AssignmentStatus,
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

export function getGreetingName(fullName: string) {
  return fullName.split(" ")[0] ?? fullName;
}

export function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
