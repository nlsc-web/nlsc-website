import { lmsTokens } from "@/lib/portal/lms-tokens";
import type {
  PortalCourseDetail,
  StudentPortalData,
} from "@/lib/portal/types/student-portal";

export function getStudentPortalFallbackData(): StudentPortalData {
  return {
    courses: [
      {
        id: "fast-track-4days",
        code: "ACC 4D",
        name: "4 Days Fast Track Course",
        instructor: "Ms. N. Perera",
        progress: 50,
        color: lmsTokens.gold500,
        duration: "4 Days",
        modules: 4,
        completedModules: 2,
        nextSession: "Thu, 10:00 AM",
        status: "active",
      },
      {
        id: "all-inclusive-20days",
        code: "ACC 20D",
        name: "20 Days All Inclusive Course",
        instructor: "Dr. Anil Mendis",
        progress: 17,
        color: lmsTokens.good,
        duration: "20 Days",
        modules: 6,
        completedModules: 1,
        nextSession: "Wed, 3:00 PM",
        status: "active",
      },
    ],
    assignments: [
      {
        id: "a1",
        course: "ACC 4D",
        title: "Invoice Processing — Practical Worksheet",
        due: "Aug 05",
        status: "overdue",
        type: "Worksheet",
        points: 20,
        submitted: false,
      },
      {
        id: "a2",
        course: "ACC 20D",
        title: "Taxation Basics — Module Review",
        due: "Aug 08",
        status: "pending",
        type: "Review",
        points: 15,
        submitted: false,
      },
      {
        id: "a3",
        course: "ACC 4D",
        title: "Accounting Software Lab Submission",
        due: "Aug 09",
        status: "submitted",
        type: "Lab",
        points: 25,
        submitted: true,
      },
      {
        id: "a4",
        course: "ACC 20D",
        title: "HR & Auditing Case Study",
        due: "Aug 12",
        status: "pending",
        type: "Case Study",
        points: 30,
        submitted: false,
      },
    ],
    announcements: [
      {
        from: "NLSC Admin",
        text: "August intake registration closes on August 15. Please complete pending enrollments before the deadline.",
        time: "3d ago",
      },
      {
        from: "Ms. N. Perera",
        text: "New ACC 4D lab schedule published for all batches. Check your course portal for updated session times.",
        time: "4d ago",
      },
      {
        from: "NLSC",
        text: "Students can register for the NLSC Career Fair through the student portal until August 20.",
        time: "5d ago",
      },
    ],
    attendance: {
      summary: {
        overall: 80,
        required: 80,
        present: 3,
        absent: 1,
        late: 1,
        totalSessions: 5,
      },
      records: [
        {
          id: "att-sess-1",
          date: "Aug 04",
          course: "ACC 4D",
          session: "Practical Accounting Lab",
          time: "10:00 AM",
          status: "present",
        },
        {
          id: "att-sess-2",
          date: "Aug 03",
          course: "ACC 20D",
          session: "Taxation Basics",
          time: "3:00 PM",
          status: "present",
        },
        {
          id: "att-sess-3",
          date: "Aug 02",
          course: "ACC 4D",
          session: "Accounting Software Intro",
          time: "10:00 AM",
          status: "late",
        },
        {
          id: "att-sess-4",
          date: "Aug 01",
          course: "ACC 20D",
          session: "HR & Auditing Overview",
          time: "3:00 PM",
          status: "present",
        },
        {
          id: "att-sess-5",
          date: "Jul 31",
          course: "ACC 4D",
          session: "Invoice Processing Workshop",
          time: "10:00 AM",
          status: "absent",
        },
      ],
    },
  };
}

const courseDetails: Record<string, PortalCourseDetail> = {
  "fast-track-4days": {
    id: "fast-track-4days",
    title: "4 Days Fast Track Course",
    duration: "4 Days",
    description:
      "Hands-on accounting and business operations training designed for fast workplace readiness.",
    progress: 50,
    modules: [
      {
        id: "ft-1",
        title: "Introduction to Professional Accounting",
        duration: "45 min",
        type: "video",
        completed: true,
      },
      {
        id: "ft-2",
        title: "Accounting Software Basics",
        duration: "60 min",
        type: "video",
        completed: true,
      },
      {
        id: "ft-3",
        title: "Business Documentation Standards",
        duration: "40 min",
        type: "document",
        completed: false,
      },
      {
        id: "ft-4",
        title: "Practical Workplace Applications",
        duration: "50 min",
        type: "quiz",
        completed: false,
      },
    ],
  },
  "all-inclusive-20days": {
    id: "all-inclusive-20days",
    title: "20 Days All Inclusive Course",
    duration: "20 Days",
    description:
      "Comprehensive program covering taxation, auditing, HR, and professional workplace standards.",
    progress: 17,
    modules: [
      {
        id: "ai-1",
        title: "Financial Accounting Foundations",
        duration: "90 min",
        type: "video",
        completed: true,
      },
      {
        id: "ai-2",
        title: "Taxation Essentials",
        duration: "75 min",
        type: "video",
        completed: false,
      },
      {
        id: "ai-3",
        title: "HR Management & Auditing",
        duration: "80 min",
        type: "document",
        completed: false,
      },
      {
        id: "ai-4",
        title: "Ratio Analysis & Reporting",
        duration: "70 min",
        type: "video",
        completed: false,
      },
      {
        id: "ai-5",
        title: "Standard Operating Procedures (SOPs)",
        duration: "60 min",
        type: "document",
        completed: false,
      },
      {
        id: "ai-6",
        title: "Final Assessment",
        duration: "120 min",
        type: "quiz",
        completed: false,
      },
    ],
  },
};

export function getStudentCourseDetailFallback(
  courseId: string,
): PortalCourseDetail | null {
  return courseDetails[courseId] ?? null;
}
