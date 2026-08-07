import { PrismaClient, type Prisma } from "@prisma/client";
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

  const instructors = [
    {
      id: "INS-001",
      name: "Ms. N. Perera",
      email: "n.perera@nlsc.lk",
      department: "Accounting Faculty",
      status: "active" as const,
      joinedAt: new Date("2024-01-15"),
    },
    {
      id: "INS-002",
      name: "Mr. R. Jayasuriya",
      email: "r.jayasuriya@nlsc.lk",
      department: "Accounting Faculty",
      status: "pending" as const,
      joinedAt: new Date("2026-07-01"),
    },
    {
      id: "INS-003",
      name: "Dr. Anil Mendis",
      email: "a.mendis@nlsc.lk",
      department: "Finance & Tax",
      status: "active" as const,
      joinedAt: new Date("2023-03-01"),
    },
    {
      id: "INS-004",
      name: "Ms. Chathuri Silva",
      email: "c.silva@nlsc.lk",
      department: "Accounting Faculty",
      status: "active" as const,
      joinedAt: new Date("2024-08-01"),
    },
    {
      id: "INS-005",
      name: "Mr. Kamal Fernando",
      email: "k.fernando@nlsc.lk",
      department: "Corporate Training",
      status: "active" as const,
      joinedAt: new Date("2023-11-01"),
    },
    {
      id: "INS-006",
      name: "Ms. Priya Wickramasekara",
      email: "p.wickramasekara@nlsc.lk",
      department: "Accounting Faculty",
      status: "suspended" as const,
      joinedAt: new Date("2022-06-01"),
    },
  ];

  for (const instructor of instructors) {
    await prisma.user.create({
      data: {
        ...instructor,
        passwordHash: defaultPassword,
        role: "instructor",
      },
    });
  }

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

  // --- Courses + modules ---
  const courses: Prisma.CourseCreateInput[] = [
    {
      id: "fast-track-4days",
      code: "ACC 4D",
      title: "4 Days Fast Track Course",
      description:
        "Hands-on accounting and business operations training designed for fast workplace readiness.",
      duration: "4 Days",
      status: "active",
      instructor: { connect: { id: "INS-001" } },
      updatedAt: new Date("2026-08-02"),
      modules: {
        create: [
          {
            id: "ft-1",
            title: "Introduction to Professional Accounting",
            duration: "45 min",
            type: "video",
            sortOrder: 1,
          },
          {
            id: "ft-2",
            title: "Accounting Software Basics",
            duration: "60 min",
            type: "video",
            sortOrder: 2,
          },
          {
            id: "ft-3",
            title: "Business Documentation Standards",
            duration: "40 min",
            type: "document",
            sortOrder: 3,
          },
          {
            id: "ft-4",
            title: "Practical Workplace Applications",
            duration: "50 min",
            type: "quiz",
            sortOrder: 4,
          },
        ],
      },
    },
    {
      id: "all-inclusive-20days",
      code: "ACC 20D",
      title: "20 Days All Inclusive Course",
      description:
        "Comprehensive program covering taxation, auditing, HR, and professional workplace standards.",
      duration: "20 Days",
      status: "active",
      instructor: { connect: { id: "INS-004" } },
      updatedAt: new Date("2026-07-30"),
      modules: {
        create: [
          {
            id: "ai-1",
            title: "Financial Accounting Foundations",
            duration: "90 min",
            type: "video",
            sortOrder: 1,
          },
          {
            id: "ai-2",
            title: "Taxation Essentials",
            duration: "75 min",
            type: "video",
            sortOrder: 2,
          },
          {
            id: "ai-3",
            title: "HR Management & Auditing",
            duration: "80 min",
            type: "document",
            sortOrder: 3,
          },
          {
            id: "ai-4",
            title: "Ratio Analysis & Reporting",
            duration: "70 min",
            type: "video",
            sortOrder: 4,
          },
          {
            id: "ai-5",
            title: "Standard Operating Procedures (SOPs)",
            duration: "60 min",
            type: "document",
            sortOrder: 5,
          },
          {
            id: "ai-6",
            title: "Final Assessment",
            duration: "120 min",
            type: "quiz",
            sortOrder: 6,
          },
        ],
      },
    },
    {
      id: "corporate-training",
      code: "CORP-01",
      title: "Corporate Training Program",
      description: "Custom corporate accounting and operations training.",
      duration: "Custom",
      status: "active",
      instructor: { connect: { id: "INS-005" } },
      updatedAt: new Date("2026-07-15"),
    },
    {
      id: "weekend-batch",
      code: "WKND-01",
      title: "Weekend Batch — Accounting Basics",
      description: "Weekend accounting fundamentals for working professionals.",
      duration: "8 Weeks",
      status: "draft",
      instructor: { connect: { id: "INS-003" } },
      updatedAt: new Date("2026-08-01"),
    },
    {
      id: "taxation-module-3",
      code: "TAX-M3",
      title: "Taxation Module 3",
      description: "Advanced taxation module pending material approval.",
      duration: "2 Weeks",
      status: "pending",
      instructor: { connect: { id: "INS-003" } },
      updatedAt: new Date("2026-07-28"),
    },
    {
      id: "financial-reporting",
      code: "FIN-RPT",
      title: "Financial Reporting & Analysis",
      description: "Financial reporting and ratio analysis program.",
      duration: "10 Days",
      status: "active",
      instructor: { connect: { id: "INS-001" } },
      updatedAt: new Date("2026-06-20"),
    },
  ];

  for (const course of courses) {
    await prisma.course.create({ data: course });
  }

  // --- Enrollments (demo student + sample students) ---
  const enrollFastTrack = await prisma.enrollment.create({
    data: {
      studentId: demoStudent.id,
      courseId: "fast-track-4days",
      status: "active",
      progressPercent: 50,
      completedModules: 2,
      nextSessionAt: "Thu, 10:00 AM",
      enrolledAt: new Date("2026-06-15"),
    },
  });

  const enrollAllInclusive = await prisma.enrollment.create({
    data: {
      studentId: demoStudent.id,
      courseId: "all-inclusive-20days",
      status: "active",
      progressPercent: 17,
      completedModules: 1,
      nextSessionAt: "Wed, 3:00 PM",
      enrolledAt: new Date("2026-06-20"),
    },
  });

  const studentProgramMap: Record<string, string> = {
    "STU-1042": "fast-track-4days",
    "STU-1038": "all-inclusive-20days",
    "STU-1035": "fast-track-4days",
    "STU-1029": "all-inclusive-20days",
    "STU-1021": "all-inclusive-20days",
    "STU-1015": "fast-track-4days",
    "STU-1008": "all-inclusive-20days",
    "STU-1001": "fast-track-4days",
  };

  for (const [studentId, courseId] of Object.entries(studentProgramMap)) {
    const student = students.find((s) => s.id === studentId)!;
    await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        status: student.status === "pending" ? "pending" : "active",
        progressPercent: student.status === "active" ? 40 : 0,
        completedModules: student.status === "active" ? 2 : 0,
        enrolledAt: student.joinedAt,
      },
    });
  }

  // Demo progress: 2/4 fast-track modules, 1/6 all-inclusive modules
  for (const moduleId of ["ft-1", "ft-2"]) {
    await prisma.moduleProgress.create({
      data: {
        enrollmentId: enrollFastTrack.id,
        moduleId,
        completedAt: new Date("2026-07-15"),
      },
    });
  }

  await prisma.moduleProgress.create({
    data: {
      enrollmentId: enrollAllInclusive.id,
      moduleId: "ai-1",
      completedAt: new Date("2026-07-18"),
    },
  });

  // --- Assignments ---
  await prisma.assignment.createMany({
    data: [
      {
        id: "a1",
        courseId: "fast-track-4days",
        title: "Invoice Processing — Practical Worksheet",
        type: "Worksheet",
        dueAt: new Date("2026-08-05"),
        points: 20,
      },
      {
        id: "a2",
        courseId: "all-inclusive-20days",
        title: "Taxation Basics — Module Review",
        type: "Review",
        dueAt: new Date("2026-08-08"),
        points: 15,
      },
      {
        id: "a3",
        courseId: "fast-track-4days",
        title: "Accounting Software Lab Submission",
        type: "Lab",
        dueAt: new Date("2026-08-09"),
        points: 25,
      },
      {
        id: "a4",
        courseId: "all-inclusive-20days",
        title: "HR & Auditing Case Study",
        type: "Case Study",
        dueAt: new Date("2026-08-12"),
        points: 30,
      },
    ],
  });

  await prisma.assignmentSubmission.createMany({
    data: [
      { assignmentId: "a1", studentId: demoStudent.id, status: "pending" },
      { assignmentId: "a2", studentId: demoStudent.id, status: "pending" },
      {
        assignmentId: "a3",
        studentId: demoStudent.id,
        status: "submitted",
        submittedAt: new Date("2026-08-03"),
      },
      { assignmentId: "a4", studentId: demoStudent.id, status: "pending" },
    ],
  });

  // --- Grades ---
  await prisma.grade.createMany({
    data: [
      {
        studentId: demoStudent.id,
        courseId: "fast-track-4days",
        grade: 82,
      },
      {
        studentId: demoStudent.id,
        courseId: "all-inclusive-20days",
        grade: 74,
      },
    ],
  });

  // --- Class sessions + attendance ---
  const sessions: Array<{
    id: string;
    courseId: string;
    title: string;
    startsAt: Date;
    status: "present" | "absent" | "late" | "excused" | null;
  }> = [
    {
      id: "sess-1",
      courseId: "fast-track-4days",
      title: "Practical Accounting Lab",
      startsAt: new Date("2026-08-04T10:00:00"),
      status: "present",
    },
    {
      id: "sess-2",
      courseId: "all-inclusive-20days",
      title: "Taxation Basics",
      startsAt: new Date("2026-08-03T15:00:00"),
      status: "present",
    },
    {
      id: "sess-3",
      courseId: "fast-track-4days",
      title: "Accounting Software Intro",
      startsAt: new Date("2026-08-02T10:00:00"),
      status: "late",
    },
    {
      id: "sess-4",
      courseId: "all-inclusive-20days",
      title: "HR & Auditing Overview",
      startsAt: new Date("2026-08-01T15:00:00"),
      status: "present",
    },
    {
      id: "sess-5",
      courseId: "fast-track-4days",
      title: "Invoice Processing Workshop",
      startsAt: new Date("2026-07-31T10:00:00"),
      status: "absent",
    },
    {
      id: "sess-6",
      courseId: "all-inclusive-20days",
      title: "Career Guidance Seminar",
      startsAt: new Date("2026-07-30T16:00:00"),
      status: "present",
    },
    {
      id: "sess-upcoming-1",
      courseId: "fast-track-4days",
      title: "Day 3 — Ledgers & Trial Balance",
      startsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: null,
    },
    {
      id: "sess-upcoming-2",
      courseId: "all-inclusive-20days",
      title: "Week 2 — Financial Reporting",
      startsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      status: null,
    },
  ];

  for (const session of sessions) {
    await prisma.classSession.create({
      data: {
        id: session.id,
        courseId: session.courseId,
        title: session.title,
        startsAt: session.startsAt,
      },
    });
    if (session.status) {
      await prisma.attendanceRecord.create({
        data: {
          id: `att-${session.id}`,
          studentId: demoStudent.id,
          sessionId: session.id,
          status: session.status,
        },
      });
    }
  }

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
        authorId: "INS-001",
        fromLabel: "Ms. N. Perera",
        postedAt: new Date("2026-08-03T14:30:00"),
      },
      {
        id: "ANN-003",
        title: "Taxation Module 3 — material review",
        body: "Updated course materials for Taxation Module 3 are pending admin approval before release.",
        audience: "Instructors",
        status: "draft",
        authorId: "INS-003",
        fromLabel: "Dr. Anil Mendis",
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
