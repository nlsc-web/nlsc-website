import type { ReportCategory, ReportFormat } from "@prisma/client";
import { prisma } from "@/lib/db";

export type CreateReportInput = {
  title: string;
  category: ReportCategory;
  period: string;
  format?: ReportFormat;
};

function csvEscape(value: string | number | null | undefined) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(headers: string[], rows: Array<Array<string | number>>) {
  const lines = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ];
  return `${lines.join("\n")}\n`;
}

export async function createPortalReport(input: CreateReportInput) {
  const title = input.title.trim();
  const period = input.period.trim();
  if (!title || !period) {
    throw new Error("Title and period are required.");
  }

  const format = input.format ?? "CSV";
  const id = `RPT-${Date.now().toString().slice(-6)}`;
  const csv = await buildReportCsv(input.category);
  const sizeKb = Math.max(1, Math.round(Buffer.byteLength(csv, "utf8") / 1024));

  return prisma.report.create({
    data: {
      id,
      title,
      category: input.category,
      period,
      generatedAt: new Date(),
      format,
      size: `${sizeKb} KB`,
      fileUrl: null,
    },
  });
}

export async function getReportDownload(id: string) {
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) {
    throw new Error("Report not found.");
  }

  const csv = await buildReportCsv(report.category);
  const filename = `${report.id}-${report.category}.csv`;

  return {
    report,
    csv,
    filename,
  };
}

export async function buildReportCsv(category: ReportCategory) {
  switch (category) {
    case "enrollment":
      return buildEnrollmentCsv();
    case "attendance":
      return buildAttendanceCsv();
    case "performance":
      return buildPerformanceCsv();
    case "financial":
      return buildFinancialCsv();
    default:
      return buildEnrollmentCsv();
  }
}

async function buildEnrollmentCsv() {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      student: { select: { id: true, name: true, email: true } },
      course: { select: { code: true, title: true } },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return toCsv(
    ["Student ID", "Student Name", "Email", "Course Code", "Course Title", "Status", "Enrolled At"],
    enrollments.map((row) => [
      row.student.id,
      row.student.name,
      row.student.email,
      row.course.code,
      row.course.title,
      row.status,
      row.enrolledAt.toISOString(),
    ]),
  );
}

async function buildAttendanceCsv() {
  const records = await prisma.attendanceRecord.findMany({
    include: {
      student: { select: { id: true, name: true } },
      session: {
        select: {
          title: true,
          startsAt: true,
          course: { select: { code: true, title: true } },
        },
      },
    },
    orderBy: { session: { startsAt: "desc" } },
    take: 500,
  });

  return toCsv(
    ["Student ID", "Student Name", "Course", "Session", "Starts At", "Status"],
    records.map((row) => [
      row.student.id,
      row.student.name,
      row.session.course.code,
      row.session.title,
      row.session.startsAt.toISOString(),
      row.status,
    ]),
  );
}

async function buildPerformanceCsv() {
  const grades = await prisma.grade.findMany({
    include: {
      student: { select: { id: true, name: true } },
      course: { select: { code: true, title: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return toCsv(
    ["Student ID", "Student Name", "Course Code", "Course Title", "Grade", "Period"],
    grades.map((row) => [
      row.student.id,
      row.student.name,
      row.course.code,
      row.course.title,
      row.grade,
      row.period ?? "",
    ]),
  );
}

async function buildFinancialCsv() {
  const courses = await prisma.course.findMany({
    include: {
      _count: { select: { enrollments: true } },
    },
    orderBy: { title: "asc" },
  });

  return toCsv(
    ["Course Code", "Course Title", "Status", "Enrollments", "Duration"],
    courses.map((row) => [
      row.code,
      row.title,
      row.status,
      row._count.enrollments,
      row.duration,
    ]),
  );
}
