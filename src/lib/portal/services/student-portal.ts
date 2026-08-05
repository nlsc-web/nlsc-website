import type { AssignmentStatus as PrismaAssignmentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import type {
  AssignmentStatus,
  AttendanceStatus,
  PortalCourseDetail,
  PortalModule,
  StudentAnnouncement,
  StudentAssignment,
  StudentAttendanceRecord,
  StudentAttendanceSummary,
  StudentCourse,
  StudentPortalData,
} from "@/lib/portal/types/student-portal";

const COURSE_COLORS = [lmsTokens.gold500, lmsTokens.good];
const ATTENDANCE_REQUIRED = 80;

function formatDueDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

function formatSessionDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

function formatSessionTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
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

function resolveAssignmentStatus(
  status: PrismaAssignmentStatus,
  dueAt: Date,
): AssignmentStatus {
  if (status === "submitted") return "submitted";
  if (dueAt.getTime() < Date.now()) return "overdue";
  return status === "overdue" ? "overdue" : "pending";
}

function buildAttendanceSummary(
  records: StudentAttendanceRecord[],
): StudentAttendanceSummary {
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;
  const totalSessions = records.length;
  const overall =
    totalSessions > 0
      ? Math.round(((present + late) / totalSessions) * 100)
      : 0;

  return {
    overall,
    required: ATTENDANCE_REQUIRED,
    present,
    absent,
    late,
    totalSessions,
  };
}

export async function getStudentPortalData(
  studentId: string,
): Promise<StudentPortalData> {
  const [enrollments, submissions, attendanceRows, announcements] =
    await Promise.all([
      prisma.enrollment.findMany({
        where: { studentId, status: "active" },
        include: {
          course: {
            include: {
              instructor: true,
              _count: { select: { modules: true } },
            },
          },
        },
        orderBy: { enrolledAt: "asc" },
      }),
      prisma.assignmentSubmission.findMany({
        where: { studentId },
        include: {
          assignment: { include: { course: true } },
        },
      }),
      prisma.attendanceRecord.findMany({
        where: { studentId },
        include: {
          session: { include: { course: true } },
        },
        orderBy: { session: { startsAt: "desc" } },
      }),
      prisma.announcement.findMany({
        where: {
          status: "published",
          audience: { in: ["All", "Students"] },
        },
        orderBy: { postedAt: "desc" },
        take: 10,
      }),
    ]);

  const courses: StudentCourse[] = enrollments.map((enrollment, index) => ({
    id: enrollment.course.id,
    code: enrollment.course.code,
    name: enrollment.course.title,
    instructor: enrollment.course.instructor?.name ?? "NLSC Faculty",
    progress: enrollment.progressPercent,
    color: COURSE_COLORS[index % COURSE_COLORS.length],
    duration: enrollment.course.duration,
    modules: enrollment.course._count.modules,
    completedModules: enrollment.completedModules,
    nextSession: enrollment.nextSessionAt,
    status: "active",
  }));

  const assignments: StudentAssignment[] = submissions.map((submission) => ({
    id: submission.id,
    course: submission.assignment.course.code,
    title: submission.assignment.title,
    due: formatDueDate(submission.assignment.dueAt),
    status: resolveAssignmentStatus(
      submission.status,
      submission.assignment.dueAt,
    ),
    type: submission.assignment.type,
    points: submission.assignment.points,
  }));

  const records: StudentAttendanceRecord[] = attendanceRows.map((row) => ({
    id: row.id,
    date: formatSessionDate(row.session.startsAt),
    course: row.session.course.code,
    session: row.session.title,
    time: formatSessionTime(row.session.startsAt),
    status: row.status as AttendanceStatus,
  }));

  const mappedAnnouncements: StudentAnnouncement[] = announcements.map(
    (item) => ({
      from: item.fromLabel ?? "NLSC",
      text: item.body,
      time: formatRelativeTime(item.postedAt),
    }),
  );

  return {
    courses,
    assignments,
    announcements: mappedAnnouncements,
    attendance: {
      summary: buildAttendanceSummary(records),
      records,
    },
  };
}

export async function getStudentCourseDetail(
  studentId: string,
  courseId: string,
): Promise<PortalCourseDetail | null> {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: { studentId, courseId },
    },
    include: {
      course: {
        include: {
          modules: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  if (!enrollment || enrollment.status !== "active") {
    return null;
  }

  const modules: PortalModule[] = enrollment.course.modules.map((module) => ({
    id: module.id,
    title: module.title,
    duration: module.duration,
    type: module.type as PortalModule["type"],
  }));

  return {
    id: enrollment.course.id,
    title: enrollment.course.title,
    duration: enrollment.course.duration,
    description: enrollment.course.description,
    progress: enrollment.progressPercent,
    modules,
  };
}
