export type UserStatus = "active" | "pending" | "suspended";

export type EnrollmentTrendPoint = {
  month: string;
  students: number;
};

export type ProgramLoadPoint = {
  program: string;
  courses: number;
};

export type RecentUser = {
  name: string;
  role: string;
  program: string;
  status: UserStatus;
  joined: string;
};

export type PendingApproval = {
  id: string;
  title: string;
  type: string;
};

export type SystemAnnouncement = {
  text: string;
  time: string;
};

export type AdminDashboardStats = {
  totalStudents: number;
  studentsThisMonth: number;
  totalInstructors: number;
  instructorsThisMonth: number;
  activeCourses: number;
  activeCoursesLabel: string;
  pendingApprovals: number;
};

export type AdminDashboardData = {
  stats: AdminDashboardStats;
  enrollmentTrend: EnrollmentTrendPoint[];
  enrollmentGrowthLabel: string;
  programLoad: ProgramLoadPoint[];
  recentUsers: RecentUser[];
  pendingApprovals: PendingApproval[];
  systemAnnouncements: SystemAnnouncement[];
};

export type ReportCategory = "enrollment" | "attendance" | "performance" | "financial";

export type AdminReport = {
  id: string;
  title: string;
  category: ReportCategory;
  period: string;
  generated: string;
  generatedAt: string;
  format: "PDF" | "CSV" | "XLSX";
  size: string;
};

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

export type AdminStudent = {
  id: string;
  name: string;
  email: string;
  program: string;
  status: UserStatus;
  joined: string;
  attendance: string;
};

export type AdminInstructor = {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: string;
  status: UserStatus;
  joined: string;
};

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

export type ContactInquiryStatus = "unread" | "read";

export type AdminContactInquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactInquiryStatus;
  createdAt: string;
  receivedAt: string;
};

export type AdminPortalData = {
  campus: {
    name: string;
    academicYear: string;
  };
  dashboard: AdminDashboardData;
  students: AdminStudent[];
  instructors: AdminInstructor[];
  courses: AdminCourse[];
  reports: AdminReport[];
  announcements: AdminAnnouncement[];
  inquiries: AdminContactInquiry[];
};
