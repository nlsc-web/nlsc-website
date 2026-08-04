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

export type ReportCategory = "enrollment" | "attendance" | "performance" | "financial";

export type AdminReport = {
  id: string;
  title: string;
  category: ReportCategory;
  period: string;
  generated: string;
  format: "PDF" | "CSV" | "XLSX";
  size: string;
};

export const adminReports: AdminReport[] = [
  {
    id: "RPT-001",
    title: "Monthly Enrollment Summary",
    category: "enrollment",
    period: "August 2026",
    generated: "Aug 04, 2026",
    format: "PDF",
    size: "1.2 MB",
  },
  {
    id: "RPT-002",
    title: "Student Attendance by Program",
    category: "attendance",
    period: "Jul – Aug 2026",
    generated: "Aug 03, 2026",
    format: "XLSX",
    size: "840 KB",
  },
  {
    id: "RPT-003",
    title: "Course Completion Rates",
    category: "performance",
    period: "Q2 2026",
    generated: "Jul 28, 2026",
    format: "PDF",
    size: "2.1 MB",
  },
  {
    id: "RPT-004",
    title: "Instructor Workload Report",
    category: "performance",
    period: "August 2026",
    generated: "Aug 01, 2026",
    format: "CSV",
    size: "320 KB",
  },
  {
    id: "RPT-005",
    title: "Fee Collection Summary",
    category: "financial",
    period: "July 2026",
    generated: "Jul 31, 2026",
    format: "XLSX",
    size: "560 KB",
  },
  {
    id: "RPT-006",
    title: "New Student Registrations",
    category: "enrollment",
    period: "Last 30 days",
    generated: "Aug 04, 2026",
    format: "CSV",
    size: "180 KB",
  },
];

export type AnnouncementStatus = "published" | "draft" | "scheduled";

export type AdminAnnouncement = {
  id: string;
  title: string;
  body: string;
  audience: "All" | "Students" | "Instructors" | "Staff";
  status: AnnouncementStatus;
  posted: string;
  author: string;
};

export const adminAnnouncements: AdminAnnouncement[] = [
  {
    id: "ANN-001",
    title: "August intake registration closes soon",
    body: "August intake registration closes on August 15. Please complete pending enrollments before the deadline.",
    audience: "All",
    status: "published",
    posted: "Aug 04, 2026 · 9:00 AM",
    author: "NLSC Admin",
  },
  {
    id: "ANN-002",
    title: "ACC 4D lab schedule update",
    body: "New ACC 4D lab schedule published for all batches. Check your course portal for updated session times.",
    audience: "Students",
    status: "published",
    posted: "Aug 03, 2026 · 2:30 PM",
    author: "Ms. N. Perera",
  },
  {
    id: "ANN-003",
    title: "Taxation Module 3 — material review",
    body: "Updated course materials for Taxation Module 3 are pending admin approval before release.",
    audience: "Instructors",
    status: "draft",
    posted: "—",
    author: "Dr. Anil Mendis",
  },
  {
    id: "ANN-004",
    title: "Campus maintenance — August 10",
    body: "Campus will undergo scheduled maintenance on August 10. Online sessions will continue as normal.",
    audience: "All",
    status: "scheduled",
    posted: "Aug 10, 2026 · 8:00 AM",
    author: "NLSC Admin",
  },
  {
    id: "ANN-005",
    title: "Career fair registration open",
    body: "Students can register for the NLSC Career Fair through the student portal until August 20.",
    audience: "Students",
    status: "published",
    posted: "Aug 01, 2026 · 11:00 AM",
    author: "NLSC Admin",
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

export type AdminStudent = {
  id: string;
  name: string;
  email: string;
  program: string;
  status: UserStatus;
  joined: string;
  attendance: string;
};

export const adminStudents: AdminStudent[] = [
  {
    id: "STU-1042",
    name: "Nimasha Silva",
    email: "nimasha.s@student.nlsc.lk",
    program: "ACC 4D",
    status: "active",
    joined: "Aug 01, 2026",
    attendance: "94%",
  },
  {
    id: "STU-1038",
    name: "Kasun Fernando",
    email: "kasun.f@student.nlsc.lk",
    program: "ACC 20D",
    status: "active",
    joined: "Jul 29, 2026",
    attendance: "88%",
  },
  {
    id: "STU-1035",
    name: "Tharindu Perera",
    email: "tharindu.p@student.nlsc.lk",
    program: "ACC 4D",
    status: "pending",
    joined: "Jul 28, 2026",
    attendance: "—",
  },
  {
    id: "STU-1029",
    name: "Isuru Bandara",
    email: "isuru.b@student.nlsc.lk",
    program: "ACC 20D",
    status: "suspended",
    joined: "Jul 20, 2026",
    attendance: "62%",
  },
  {
    id: "STU-1021",
    name: "S. Kumarasinghe",
    email: "s.kumarasinghe@student.nlsc.lk",
    program: "ACC 20D",
    status: "pending",
    joined: "Jul 18, 2026",
    attendance: "—",
  },
  {
    id: "STU-1015",
    name: "Dilani Jayawardena",
    email: "dilani.j@student.nlsc.lk",
    program: "ACC 4D",
    status: "active",
    joined: "Jul 12, 2026",
    attendance: "91%",
  },
  {
    id: "STU-1008",
    name: "Ravindu Wickramasinghe",
    email: "ravindu.w@student.nlsc.lk",
    program: "ACC 20D",
    status: "active",
    joined: "Jul 05, 2026",
    attendance: "96%",
  },
  {
    id: "STU-1001",
    name: "Amaya Rodrigo",
    email: "amaya.r@student.nlsc.lk",
    program: "ACC 4D",
    status: "active",
    joined: "Jun 28, 2026",
    attendance: "90%",
  },
];

export type AdminInstructor = {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: string;
  status: UserStatus;
  joined: string;
};

export const adminInstructors: AdminInstructor[] = [
  {
    id: "INS-001",
    name: "Ms. N. Perera",
    email: "n.perera@nlsc.lk",
    department: "Accounting Faculty",
    courses: "ACC 4D · Taxation",
    status: "active",
    joined: "Jan 2024",
  },
  {
    id: "INS-002",
    name: "Mr. R. Jayasuriya",
    email: "r.jayasuriya@nlsc.lk",
    department: "Accounting Faculty",
    courses: "ACC 20D · Auditing",
    status: "pending",
    joined: "Jul 2026",
  },
  {
    id: "INS-003",
    name: "Dr. Anil Mendis",
    email: "a.mendis@nlsc.lk",
    department: "Finance & Tax",
    courses: "Taxation Module 3",
    status: "active",
    joined: "Mar 2023",
  },
  {
    id: "INS-004",
    name: "Ms. Chathuri Silva",
    email: "c.silva@nlsc.lk",
    department: "Accounting Faculty",
    courses: "ACC 4D · Financial Reporting",
    status: "active",
    joined: "Aug 2024",
  },
  {
    id: "INS-005",
    name: "Mr. Kamal Fernando",
    email: "k.fernando@nlsc.lk",
    department: "Corporate Training",
    courses: "Weekend Batch",
    status: "active",
    joined: "Nov 2023",
  },
  {
    id: "INS-006",
    name: "Ms. Priya Wickramasekara",
    email: "p.wickramasekara@nlsc.lk",
    department: "Accounting Faculty",
    courses: "ACC 20D · HR & SOPs",
    status: "suspended",
    joined: "Jun 2022",
  },
];

export type CourseStatus = "active" | "draft" | "pending";

export type AdminCourse = {
  id: string;
  code: string;
  title: string;
  duration: string;
  instructor: string;
  enrolled: number;
  modules: number;
  status: CourseStatus;
  updated: string;
};

export const adminCourses: AdminCourse[] = [
  {
    id: "fast-track-4days",
    code: "ACC 4D",
    title: "4 Days Fast Track Course",
    duration: "4 Days",
    instructor: "Ms. N. Perera",
    enrolled: 64,
    modules: 4,
    status: "active",
    updated: "Aug 02, 2026",
  },
  {
    id: "all-inclusive-20days",
    code: "ACC 20D",
    title: "20 Days All Inclusive Course",
    duration: "20 Days",
    instructor: "Ms. Chathuri Silva",
    enrolled: 54,
    modules: 6,
    status: "active",
    updated: "Jul 30, 2026",
  },
  {
    id: "corporate-training",
    code: "CORP-01",
    title: "Corporate Training Program",
    duration: "Custom",
    instructor: "Mr. Kamal Fernando",
    enrolled: 12,
    modules: 5,
    status: "active",
    updated: "Jul 15, 2026",
  },
  {
    id: "weekend-batch",
    code: "WKND-01",
    title: "Weekend Batch — Accounting Basics",
    duration: "8 Weeks",
    instructor: "Dr. Anil Mendis",
    enrolled: 0,
    modules: 3,
    status: "draft",
    updated: "Aug 01, 2026",
  },
  {
    id: "taxation-module-3",
    code: "TAX-M3",
    title: "Taxation Module 3",
    duration: "2 Weeks",
    instructor: "Dr. Anil Mendis",
    enrolled: 28,
    modules: 4,
    status: "pending",
    updated: "Jul 28, 2026",
  },
  {
    id: "financial-reporting",
    code: "FIN-RPT",
    title: "Financial Reporting & Analysis",
    duration: "10 Days",
    instructor: "Ms. N. Perera",
    enrolled: 18,
    modules: 5,
    status: "active",
    updated: "Jun 20, 2026",
  },
];
