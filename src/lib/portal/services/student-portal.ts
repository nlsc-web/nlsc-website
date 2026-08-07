import type { AssignmentStatus as PrismaAssignmentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUnavailable } from "@/lib/portal/db-unavailable";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import {
  getStudentCourseDetailFallback,
  getStudentPortalFallbackData,
} from "@/lib/portal/services/student-portal-fallback";
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
  status: PrismaAssignmentStatus | null,
  dueAt: Date,
): AssignmentStatus {
  if (status === "submitted") return "submitted";
  if (dueAt.getTime() < Date.now()) return "overdue";
  return "pending";
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

function formatNextSession(date: Date | null | undefined) {
  if (!date) return null;
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export async function getStudentPortalData(
  studentId: string,
): Promise<StudentPortalData> {
  try {
    return await loadStudentPortalDataFromDb(studentId);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      console.warn(
        "[student-portal] Database unavailable, using demo fallback data.",
        error instanceof Error ? error.message : error,
      );
      return getStudentPortalFallbackData();
    }

    throw error;
  }
}

async function loadStudentPortalDataFromDb(
  studentId: string,
): Promise<StudentPortalData> {
  const now = new Date();
  const [enrollments, attendanceRows, announcements] = await Promise.all([
    prisma.enrollment.findMany({
      where: { studentId, status: "active" },
      include: {
        moduleProgress: {
          where: { completedAt: { not: null } },
          select: { moduleId: true },
        },
        course: {
          include: {
            instructor: true,
            _count: { select: { modules: true } },
            assignments: {
              include: {
                submissions: {
                  where: { studentId },
                  take: 1,
                },
              },
              orderBy: { dueAt: "asc" },
            },
            sessions: {
              where: { startsAt: { gte: now } },
              orderBy: { startsAt: "asc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { enrolledAt: "asc" },
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

  const courses: StudentCourse[] = enrollments.map((enrollment, index) => {
    const completedModules = enrollment.moduleProgress.length;
    const totalModules = enrollment.course._count.modules;
    const progress =
      totalModules > 0
        ? Math.round((completedModules / totalModules) * 100)
        : enrollment.progressPercent;
    const nextSessionDate = enrollment.course.sessions[0]?.startsAt ?? null;

    return {
      id: enrollment.course.id,
      code: enrollment.course.code,
      name: enrollment.course.title,
      instructor: enrollment.course.instructor?.name ?? "NLSC Faculty",
      progress,
      color: COURSE_COLORS[index % COURSE_COLORS.length],
      duration: enrollment.course.duration,
      modules: totalModules,
      completedModules,
      nextSession:
        formatNextSession(nextSessionDate) ?? enrollment.nextSessionAt,
      status: "active" as const,
    };
  });

  const assignments: StudentAssignment[] = enrollments.flatMap((enrollment) =>
    enrollment.course.assignments.map((assignment) => {
      const submission = assignment.submissions[0] ?? null;
      return {
        id: assignment.id,
        course: enrollment.course.code,
        title: assignment.title,
        due: formatDueDate(assignment.dueAt),
        status: resolveAssignmentStatus(
          submission?.status ?? null,
          assignment.dueAt,
        ),
        type: assignment.type,
        points: assignment.points,
        submitted: submission?.status === "submitted",
      };
    }),
  );

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
  try {
    return await loadStudentCourseDetailFromDb(studentId, courseId);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      console.warn(
        "[student-portal] Database unavailable, using demo course detail.",
        error instanceof Error ? error.message : error,
      );
      return getStudentCourseDetailFallback(courseId);
    }

    throw error;
  }
}

async function loadStudentCourseDetailFromDb(
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
      moduleProgress: true,
    },
  });

  if (!enrollment || enrollment.status !== "active") {
    return null;
  }

  const completedIds = new Set(
    enrollment.moduleProgress
      .filter((item) => item.completedAt)
      .map((item) => item.moduleId),
  );

  const modules: PortalModule[] = enrollment.course.modules.map((module) => ({
    id: module.id,
    title: module.title,
    duration: module.duration,
    type: module.type as PortalModule["type"],
    completed: completedIds.has(module.id),
  }));

  const totalModules = enrollment.course.modules.length;
  const completedModules = completedIds.size;
  const progress =
    totalModules > 0
      ? Math.round((completedModules / totalModules) * 100)
      : 0;

  return {
    id: enrollment.course.id,
    title: enrollment.course.title,
    duration: enrollment.course.duration,
    description: enrollment.course.description,
    progress,
    modules,
  };
}

export async function submitStudentAssignment(
  studentId: string,
  assignmentId: string,
) {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { course: true },
  });

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId: assignment.courseId,
      },
    },
  });

  if (!enrollment || enrollment.status !== "active") {
    throw new Error("You are not enrolled in this course.");
  }

  return prisma.assignmentSubmission.upsert({
    where: {
      assignmentId_studentId: { assignmentId, studentId },
    },
    create: {
      assignmentId,
      studentId,
      status: "submitted",
      submittedAt: new Date(),
    },
    update: {
      status: "submitted",
      submittedAt: new Date(),
    },
  });
}

export async function completeStudentModule(
  studentId: string,
  moduleId: string,
) {
  const module = await prisma.courseModule.findUnique({
    where: { id: moduleId },
  });

  if (!module) {
    throw new Error("Module not found.");
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId: module.courseId,
      },
    },
    include: {
      course: {
        include: { _count: { select: { modules: true } } },
      },
      moduleProgress: true,
    },
  });

  if (!enrollment || enrollment.status !== "active") {
    throw new Error("You are not enrolled in this course.");
  }

  await prisma.moduleProgress.upsert({
    where: {
      enrollmentId_moduleId: {
        enrollmentId: enrollment.id,
        moduleId,
      },
    },
    create: {
      enrollmentId: enrollment.id,
      moduleId,
      completedAt: new Date(),
    },
    update: {
      completedAt: new Date(),
    },
  });

  const progressRows = await prisma.moduleProgress.findMany({
    where: {
      enrollmentId: enrollment.id,
      completedAt: { not: null },
    },
  });

  const totalModules = enrollment.course._count.modules;
  const completedModules = progressRows.length;
  const progressPercent =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      completedModules,
      progressPercent,
    },
  });

  return {
    moduleId,
    completedModules,
    progressPercent,
  };
}
