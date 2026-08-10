import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hash(password: string) {
  return bcrypt.hash(password, 10);
}

async function main() {
  // Wipe in FK-safe order for re-seeding
  await prisma.moduleProgress.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.classSession.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.report.deleteMany();
  await prisma.contactInquiry.deleteMany();
  await prisma.course.deleteMany();
  await prisma.userNotificationPrefs.deleteMany();
  await prisma.user.deleteMany();
  await prisma.campusSettings.deleteMany();

  const studentPassword = await hash(
    process.env.PORTAL_DEMO_PASSWORD ?? "nlsc@student",
  );
  const adminPassword = await hash(
    process.env.PORTAL_DEMO_ADMIN_PASSWORD ?? "nlsc@admin",
  );
  const defaultPassword = await hash("nlsc@demo");

  // --- Users ---
  const admin = await prisma.user.create({
    data: {
      id: process.env.PORTAL_DEMO_ADMIN_ID ?? "NLSC-ADMIN",
      email: "admin@nlsc.lk",
      passwordHash: adminPassword,
      name: process.env.PORTAL_DEMO_ADMIN_NAME ?? "NLSC Administrator",
      role: "admin",
      status: "active",
      joinedAt: new Date("2024-01-01"),
      notificationPrefs: {
        create: {
          emailAlerts: true,
          portalAlerts: true,
          weeklyDigest: true,
        },
      },
    },
  });

  const demoStudent = await prisma.user.create({
    data: {
      id: process.env.PORTAL_DEMO_STUDENT_ID ?? "NLSC2026",
      email: "priya.f@student.nlsc.lk",
      passwordHash: studentPassword,
      name: process.env.PORTAL_DEMO_STUDENT_NAME ?? "Priya Fernando",
      role: "student",
      status: "active",
      joinedAt: new Date("2026-06-01"),
      notificationPrefs: {
        create: {
          emailAlerts: true,
          portalAlerts: true,
          weeklyDigest: false,
        },
      },
    },
  });

  const students = [
    {
      id: "STU-1042",
      name: "Nimasha Silva",
      email: "nimasha.s@student.nlsc.lk",
      status: "active" as const,
      joinedAt: new Date("2026-08-01"),
    },
    {
      id: "STU-1038",
      name: "Kasun Fernando",
      email: "kasun.f@student.nlsc.lk",
      status: "active" as const,
      joinedAt: new Date("2026-07-29"),
    },
    {
      id: "STU-1035",
      name: "Tharindu Perera",
      email: "tharindu.p@student.nlsc.lk",
      status: "pending" as const,
      joinedAt: new Date("2026-07-28"),
    },
    {
      id: "STU-1029",
      name: "Isuru Bandara",
      email: "isuru.b@student.nlsc.lk",
      status: "suspended" as const,
      joinedAt: new Date("2026-07-20"),
    },
    {
      id: "STU-1021",
      name: "S. Kumarasinghe",
      email: "s.kumarasinghe@student.nlsc.lk",
      status: "pending" as const,
      joinedAt: new Date("2026-07-18"),
    },
    {
      id: "STU-1015",
      name: "Dilani Jayawardena",
      email: "dilani.j@student.nlsc.lk",
      status: "active" as const,
      joinedAt: new Date("2026-07-12"),
    },
    {
      id: "STU-1008",
      name: "Ravindu Wickramasinghe",
      email: "ravindu.w@student.nlsc.lk",
      status: "active" as const,
      joinedAt: new Date("2026-07-05"),
    },
    {
      id: "STU-1001",
      name: "Amaya Rodrigo",
      email: "amaya.r@student.nlsc.lk",
      status: "active" as const,
      joinedAt: new Date("2026-06-28"),
    },
  ];

  for (const student of students) {
    await prisma.user.create({
      data: {
        ...student,
        passwordHash: defaultPassword,
        role: "student",
      },
    });
  }

  // --- Campus settings ---
  await prisma.campusSettings.create({
    data: {
      id: 1,
      campusDisplayName: "Next Level Solutions Campus",
      academicYear: "2026",
      requireEnrollmentApproval: true,
    },
  });

  // Courses are managed via Admin → New Course (no demo catalog seed).

  // --- Announcements ---
  await prisma.announcement.createMany({
    data: [
      {
        id: "ANN-001",
        title: "August intake registration closes soon",
        body: "August intake registration closes on August 15. Please complete pending enrollments before the deadline.",
        audience: "All",
        status: "published",
        authorId: admin.id,
        fromLabel: "NLSC Admin",
        postedAt: new Date("2026-08-04T09:00:00"),
      },
      {
        id: "ANN-002",
        title: "ACC 4D lab schedule update",
        body: "New ACC 4D lab schedule published for all batches. Check your course portal for updated session times.",
        audience: "Students",
        status: "published",
        authorId: admin.id,
        fromLabel: "NLSC Admin",
        postedAt: new Date("2026-08-03T14:30:00"),
      },
      {
        id: "ANN-003",
        title: "Taxation Module 3 — material review",
        body: "Updated course materials for Taxation Module 3 are pending admin approval before release.",
        audience: "Instructors",
        status: "draft",
        authorId: admin.id,
        fromLabel: "NLSC Admin",
        postedAt: null,
      },
      {
        id: "ANN-004",
        title: "Campus maintenance — August 10",
        body: "Campus will undergo scheduled maintenance on August 10. Online sessions will continue as normal.",
        audience: "All",
        status: "scheduled",
        authorId: admin.id,
        fromLabel: "NLSC Admin",
        postedAt: new Date("2026-08-10T08:00:00"),
      },
      {
        id: "ANN-005",
        title: "Career fair registration open",
        body: "Students can register for the NLSC Career Fair through the student portal until August 20.",
        audience: "Students",
        status: "published",
        authorId: admin.id,
        fromLabel: "NLSC Admin",
        postedAt: new Date("2026-08-01T11:00:00"),
      },
      {
        id: "ANN-STU-1",
        title: "Orientation room change",
        body: "4 Days Fast Track batch orientation moved to Room 2, 4pm Thursday.",
        audience: "Students",
        status: "published",
        fromLabel: "NLSC Admissions",
        postedAt: new Date("2026-08-04T13:00:00"),
      },
      {
        id: "ANN-STU-2",
        title: "Fee deadline extension",
        body: "Course fee deadline extended to August 20 for August intake.",
        audience: "Students",
        status: "published",
        fromLabel: "Registrar",
        postedAt: new Date("2026-08-03T10:00:00"),
      },
      {
        id: "ANN-STU-3",
        title: "Worksheet rubric update",
        body: "Practical accounting worksheet rubric updated — check your course notes.",
        audience: "Students",
        status: "published",
        fromLabel: "NLSC Faculty",
        postedAt: new Date("2026-08-02T09:00:00"),
      },
    ],
  });

  // --- Approvals ---
  await prisma.approval.createMany({
    data: [
      {
        title: "New student enrollment — S. Kumarasinghe (ACC 20D)",
        type: "Enrollment",
        status: "pending",
      },
      {
        title: "Course material update — Taxation Module 3",
        type: "Course",
        status: "pending",
      },
      {
        title: "Instructor access request — R. Jayasuriya",
        type: "Staff",
        status: "pending",
      },
    ],
  });

  // --- Reports metadata ---
  await prisma.report.createMany({
    data: [
      {
        id: "RPT-001",
        title: "Monthly Enrollment Summary",
        category: "enrollment",
        period: "August 2026",
        generatedAt: new Date("2026-08-04"),
        format: "PDF",
        size: "1.2 MB",
      },
      {
        id: "RPT-002",
        title: "Student Attendance by Program",
        category: "attendance",
        period: "Jul – Aug 2026",
        generatedAt: new Date("2026-08-03"),
        format: "XLSX",
        size: "840 KB",
      },
      {
        id: "RPT-003",
        title: "Course Completion Rates",
        category: "performance",
        period: "Q2 2026",
        generatedAt: new Date("2026-07-28"),
        format: "PDF",
        size: "2.1 MB",
      },
      {
        id: "RPT-004",
        title: "Instructor Workload Report",
        category: "performance",
        period: "August 2026",
        generatedAt: new Date("2026-08-01"),
        format: "CSV",
        size: "320 KB",
      },
      {
        id: "RPT-005",
        title: "Fee Collection Summary",
        category: "financial",
        period: "July 2026",
        generatedAt: new Date("2026-07-31"),
        format: "XLSX",
        size: "560 KB",
      },
      {
        id: "RPT-006",
        title: "New Student Registrations",
        category: "enrollment",
        period: "Last 30 days",
        generatedAt: new Date("2026-08-04"),
        format: "CSV",
        size: "180 KB",
      },
    ],
  });

  await prisma.contactInquiry.createMany({
    data: [
      {
        name: "W.T. Bhagya",
        email: "bhagya@gmail.com",
        subject: "Course information",
        message: "I need to know the courses fees.",
        status: "unread",
        createdAt: new Date("2026-08-06T09:00:00.000Z"),
      },
      {
        name: "Kasun Perera",
        email: "kasun@example.com",
        subject: "General inquiry",
        message: "What are the office hours for admissions?",
        status: "read",
        createdAt: new Date("2026-08-05T04:30:00.000Z"),
      },
    ],
  });

  console.log("Seed complete.");
  console.log(`  Admin:    ${admin.id} / (PORTAL_DEMO_ADMIN_PASSWORD)`);
  console.log(`  Student:  ${demoStudent.id} / (PORTAL_DEMO_PASSWORD)`);
  console.log("  Others:   password nlsc@demo");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
