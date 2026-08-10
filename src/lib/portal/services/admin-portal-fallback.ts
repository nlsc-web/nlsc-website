import type { AdminPortalData } from "@/lib/portal/types/admin-portal";

export function getAdminPortalFallbackData(): AdminPortalData {
  return {
    campus: {
      name: "Next Level Solutions Campus",
      academicYear: "2026",
    },
    dashboard: {
      stats: {
        totalStudents: 9,
        studentsThisMonth: 3,
        totalInstructors: 0,
        instructorsThisMonth: 0,
        activeCourses: 0,
        activeCoursesLabel: "No active courses",
        pendingApprovals: 2,
      },
      enrollmentTrend: [
        { month: "Mar", students: 4 },
        { month: "Apr", students: 5 },
        { month: "May", students: 6 },
        { month: "Jun", students: 7 },
        { month: "Jul", students: 8 },
        { month: "Aug", students: 9 },
      ],
      enrollmentGrowthLabel: "+125% since Mar",
      programLoad: [],
      recentUsers: [
        {
          name: "Nimasha Silva",
          role: "Student",
          program: "ACC 20D",
          status: "active",
          joined: "Aug 01",
        },
        {
          name: "Kasun Fernando",
          role: "Student",
          program: "ACC 4D",
          status: "active",
          joined: "Jul 29",
        },
      ],
      pendingApprovals: [
        {
          id: "apr-1",
          title: "New student enrollment — S. Kumarasinghe (ACC 20D)",
          type: "Enrollment",
        },
        {
          id: "apr-2",
          title: "Course material update — Taxation Module 3",
          type: "Course",
        },
      ],
      systemAnnouncements: [
        {
          text: "August intake registration closes on August 15. Please complete pending enrollments before the deadline.",
          time: "2d ago",
        },
        {
          text: "New ACC 4D lab schedule published for all batches. Check your course portal for updated session times.",
          time: "3d ago",
        },
      ],
    },
    students: [
      {
        id: "STU-1042",
        name: "Nimasha Silva",
        email: "nimasha.s@student.nlsc.lk",
        program: "ACC 20D",
        status: "active",
        joined: "Aug 01, 2026",
        attendance: "92%",
      },
      {
        id: "STU-1038",
        name: "Kasun Fernando",
        email: "kasun.f@student.nlsc.lk",
        program: "ACC 4D",
        status: "active",
        joined: "Jul 29, 2026",
        attendance: "88%",
      },
      {
        id: "STU-1035",
        name: "Tharindu Perera",
        email: "tharindu.p@student.nlsc.lk",
        program: "ACC 20D",
        status: "pending",
        joined: "Jul 28, 2026",
        attendance: "—",
      },
    ],
    instructors: [],
    courses: [],
    reports: [
      {
        id: "RPT-001",
        title: "Monthly Enrollment Summary",
        category: "enrollment",
        period: "August 2026",
        generated: "Aug 04, 2026",
        generatedAt: new Date().toISOString(),
        format: "PDF",
        size: "1.2 MB",
      },
      {
        id: "RPT-002",
        title: "Student Attendance by Program",
        category: "attendance",
        period: "Jul – Aug 2026",
        generated: "Aug 03, 2026",
        generatedAt: new Date().toISOString(),
        format: "XLSX",
        size: "840 KB",
      },
    ],
    announcements: [
      {
        id: "ANN-001",
        title: "August intake registration closes soon",
        body: "August intake registration closes on August 15. Please complete pending enrollments before the deadline.",
        audience: "All",
        status: "published",
        posted: "Aug 04, 2026, 9:00 AM",
        author: "NLSC Admin",
      },
    ],
    inquiries: [
      {
        id: "INQ-demo-1",
        name: "W.T. Bhagya",
        email: "bhagya@gmail.com",
        subject: "Course information",
        message: "I need to know the courses fees.",
        status: "unread",
        createdAt: "Aug 06, 2026, 2:30 PM",
        receivedAt: new Date().toISOString(),
      },
    ],
  };
}
