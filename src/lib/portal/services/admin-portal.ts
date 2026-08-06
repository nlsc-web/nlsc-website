import type { ApprovalType, Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import type {
  AdminAnnouncement,
  AdminContactInquiry,
  AdminCourse,
  AdminDashboardData,
  AdminInstructor,
  AdminPortalData,
  AdminReport,
  AdminStudent,
  CourseStatus,
  EnrollmentTrendPoint,
  ReportCategory,
  UserStatus,
} from "@/lib/portal/types/admin-portal";

const APPROVAL_TYPE_LABELS: Record<ApprovalType, string> = {
  Enrollment: "Enrollment",
  Course: "Course",
  Staff: "Staff",
};

function formatJoinedDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatShortJoined(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatPostedDate(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatRelativeTime(date: Date | null) {
  if (!date) return "Recently";
  const diffMs = Date.now() - date.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function mapUserStatus(status: string): UserStatus {
  if (status === "active" || status === "pending" || status === "suspended") {
    return status;
  }
  return "active";
}

function mapCourseStatus(status: string): CourseStatus {
  if (status === "active" || status === "draft" || status === "pending") {
    return status;
  }
  return "draft";
}

function mapReportCategory(category: string): ReportCategory {
  if (
    category === "enrollment" ||
    category === "attendance" ||
    category === "performance" ||
    category === "financial"
  ) {
    return category;
  }
  return "enrollment";
}

function buildEnrollmentTrend(
  students: Array<{ joinedAt: Date }>,
): EnrollmentTrendPoint[] {
  const now = new Date();
  const trend: EnrollmentTrendPoint[] = [];

  for (let i = 5; i >= 0; i -= 1) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    const label = monthStart.toLocaleDateString("en-US", { month: "short" });
    const count = students.filter((s) => s.joinedAt <= monthEnd).length;
    trend.push({ month: label, students: count });
  }

  return trend;
}

function buildEnrollmentGrowthLabel(trend: EnrollmentTrendPoint[]) {
  if (trend.length < 2) return "No trend data";
  const first = trend[0].students;
  const last = trend[trend.length - 1].students;
  if (first === 0) return `+${last} since ${trend[0].month}`;
  const pct = Math.round(((last - first) / first) * 100);
  return `+${pct}% since ${trend[0].month}`;
}

function buildAttendanceMap(
  records: Array<{ studentId: string; status: string }>,
) {
  const map = new Map<string, { total: number; attended: number }>();

  for (const record of records) {
    const current = map.get(record.studentId) ?? { total: 0, attended: 0 };
    current.total += 1;
    if (record.status === "present" || record.status === "late") {
      current.attended += 1;
    }
    map.set(record.studentId, current);
  }

  return map;
}

function formatAttendancePercent(studentId: string, map: Map<string, { total: number; attended: number }>) {
  const stats = map.get(studentId);
  if (!stats || stats.total === 0) return "—";
  return `${Math.round((stats.attended / stats.total) * 100)}%`;
}

function roleLabel(role: Role) {
  if (role === "instructor") return "Instructor";
  if (role === "admin") return "Administrator";
  return "Student";
}

function isThisMonth(date: Date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

export async function getAdminPortalData(): Promise<AdminPortalData> {
  const [
    campusSettings,
    studentRows,
    instructorRows,
    courseRows,
    approvalRows,
    announcementRows,
    reportRows,
    attendanceRows,
    enrollmentRows,
    recentUserRows,
    inquiryRows,
  ] = await Promise.all([
    prisma.campusSettings.findFirst(),
    prisma.user.findMany({
      where: { role: "student" },
      orderBy: { joinedAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "instructor" },
      include: {
        taughtCourses: { select: { code: true, title: true } },
      },
      orderBy: { joinedAt: "desc" },
    }),
    prisma.course.findMany({
      include: {
        instructor: true,
        _count: { select: { enrollments: true, modules: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.approval.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.report.findMany({ orderBy: { generatedAt: "desc" } }),
    prisma.attendanceRecord.findMany({
      select: { studentId: true, status: true },
    }),
    prisma.enrollment.findMany({
      where: { status: { in: ["active", "pending"] } },
      include: { course: { select: { code: true, title: true } } },
    }),
    prisma.user.findMany({
      where: { role: { in: ["student", "instructor"] } },
      orderBy: { joinedAt: "desc" },
      take: 8,
    }),
    prisma.contactInquiry.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const enrollmentByStudent = new Map<string, string>();
  for (const enrollment of enrollmentRows) {
    if (!enrollmentByStudent.has(enrollment.studentId)) {
      enrollmentByStudent.set(enrollment.studentId, enrollment.course.code);
    }
  }

  const attendanceMap = buildAttendanceMap(attendanceRows);
  const enrollmentTrend = buildEnrollmentTrend(studentRows);

  const activeCourses = courseRows.filter((c) => c.status === "active");
  const activeCourseCodes = activeCourses.slice(0, 2).map((c) => c.code);

  const students: AdminStudent[] = studentRows.map((student) => ({
    id: student.id,
    name: student.name,
    email: student.email,
    program: enrollmentByStudent.get(student.id) ?? "—",
    status: mapUserStatus(student.status),
    joined: formatJoinedDate(student.joinedAt),
    attendance: formatAttendancePercent(student.id, attendanceMap),
  }));

  const instructors: AdminInstructor[] = instructorRows.map((instructor) => ({
    id: instructor.id,
    name: instructor.name,
    email: instructor.email,
    department: instructor.department ?? "NLSC Faculty",
    courses:
      instructor.taughtCourses.length > 0
        ? instructor.taughtCourses.map((c) => c.code).join(" · ")
        : "—",
    status: mapUserStatus(instructor.status),
    joined: instructor.joinedAt.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
  }));

  const courses: AdminCourse[] = courseRows.map((course) => ({
    id: course.id,
    code: course.code,
    title: course.title,
    duration: course.duration,
    instructor: course.instructor?.name ?? "Unassigned",
    enrolled: course._count.enrollments,
    modules: course._count.modules,
    status: mapCourseStatus(course.status),
    updated: formatMonthYear(course.updatedAt),
  }));

  const programLoad = [...courses]
    .filter((c) => c.status === "active")
    .sort((a, b) => b.enrolled - a.enrolled)
    .slice(0, 4)
    .map((course) => ({
      program: course.title,
      courses: course.enrolled,
    }));

  const recentUsers = recentUserRows.map((user) => {
    let program = "—";
    if (user.role === "student") {
      program = enrollmentByStudent.get(user.id) ?? "—";
    } else if (user.role === "instructor") {
      const instructor = instructors.find((i) => i.id === user.id);
      program = instructor?.department ?? "NLSC Faculty";
    }

    return {
      name: user.name,
      role: roleLabel(user.role),
      program,
      status: mapUserStatus(user.status),
      joined: formatShortJoined(user.joinedAt),
    };
  });

  const dashboard: AdminDashboardData = {
    stats: {
      totalStudents: studentRows.length,
      studentsThisMonth: studentRows.filter((s) => isThisMonth(s.joinedAt))
        .length,
      totalInstructors: instructorRows.length,
      instructorsThisMonth: instructorRows.filter((i) =>
        isThisMonth(i.joinedAt),
      ).length,
      activeCourses: activeCourses.length,
      activeCoursesLabel:
        activeCourseCodes.length > 0
          ? activeCourseCodes.join(" & ")
          : "No active courses",
      pendingApprovals: approvalRows.length,
    },
    enrollmentTrend,
    enrollmentGrowthLabel: buildEnrollmentGrowthLabel(enrollmentTrend),
    programLoad,
    recentUsers,
    pendingApprovals: approvalRows.map((item) => ({
      id: item.id,
      title: item.title,
      type: APPROVAL_TYPE_LABELS[item.type],
    })),
    systemAnnouncements: announcementRows
      .filter((item) => item.status === "published")
      .slice(0, 5)
      .map((item) => ({
        text: item.body,
        time: formatRelativeTime(item.postedAt),
      })),
  };

  const reports: AdminReport[] = reportRows.map((report) => ({
    id: report.id,
    title: report.title,
    category: mapReportCategory(report.category),
    period: report.period,
    generated: formatMonthYear(report.generatedAt),
    format: report.format as AdminReport["format"],
    size: report.size,
  }));

  const announcements: AdminAnnouncement[] = announcementRows.map((item) => ({
    id: item.id,
    title: item.title,
    body: item.body,
    audience: item.audience as AdminAnnouncement["audience"],
    status: item.status as AdminAnnouncement["status"],
    posted: formatPostedDate(item.postedAt),
    author: item.fromLabel ?? "NLSC Admin",
  }));

  const inquiries: AdminContactInquiry[] = inquiryRows.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    subject: item.subject ?? "General inquiry",
    message: item.message,
    createdAt: formatPostedDate(item.createdAt),
    receivedAt: item.createdAt.toISOString(),
  }));

  return {
    campus: {
      name: campusSettings?.campusDisplayName ?? "Next Level Solutions Campus",
      academicYear: campusSettings?.academicYear ?? "2026",
    },
    dashboard,
    students,
    instructors,
    courses,
    reports,
    announcements,
    inquiries,
  };
}
