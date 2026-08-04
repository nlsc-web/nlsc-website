export type UserStatus = "active" | "pending" | "suspended";

export const enrollmentTrend = [
  { month: "Mar", students: 42 },
  { month: "Apr", students: 58 },
  { month: "May", students: 71 },
  { month: "Jun", students: 89 },
  { month: "Jul", students: 104 },
  { month: "Aug", students: 118 },
];

export const programLoad = [
  { program: "4 Days Fast Track", courses: 12 },
  { program: "20 Days All Inclusive", courses: 8 },
  { program: "Corporate Training", courses: 5 },
  { program: "Weekend Batch", courses: 4 },
];

export const recentUsers = [
  {
    name: "Nimasha Silva",
    role: "Student",
    program: "ACC 4D",
    status: "active" as UserStatus,
    joined: "Aug 01",
  },
  {
    name: "Kasun Fernando",
    role: "Student",
    program: "ACC 20D",
    status: "active" as UserStatus,
    joined: "Jul 29",
  },
  {
    name: "Tharindu Perera",
    role: "Student",
    program: "ACC 4D",
    status: "pending" as UserStatus,
    joined: "Jul 28",
  },
  {
    name: "Ms. N. Perera",
    role: "Instructor",
    program: "Accounting Faculty",
    status: "active" as UserStatus,
    joined: "Jul 25",
  },
  {
    name: "Isuru Bandara",
    role: "Student",
    program: "ACC 20D",
    status: "suspended" as UserStatus,
    joined: "Jul 20",
  },
];

export const pendingApprovals = [
  {
    title: "New student enrollment — S. Kumarasinghe (ACC 20D)",
    type: "Enrollment",
  },
  {
    title: "Course material update — Taxation Module 3",
    type: "Course",
  },
  {
    title: "Instructor access request — R. Jayasuriya",
    type: "Staff",
  },
];

export const systemAnnouncements = [
  {
    text: "August intake registration closes on August 15.",
    time: "5h ago",
  },
  {
    text: "New ACC 4D lab schedule published for all batches.",
    time: "1d ago",
  },
];

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
