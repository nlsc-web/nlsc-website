export type AssignmentStatus = "pending" | "submitted" | "overdue";

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type StudentCourse = {
  id: string;
  code: string;
  name: string;
  instructor: string;
  progress: number;
  color: string;
  duration: string;
  modules: number;
  completedModules: number;
  nextSession: string | null;
  status: "active";
};

export type StudentAssignment = {
  id: string;
  course: string;
  title: string;
  due: string;
  status: AssignmentStatus;
  type: string;
  points: number;
};

export type StudentAnnouncement = {
  from: string;
  text: string;
  time: string;
};

export type StudentAttendanceRecord = {
  id: string;
  date: string;
  course: string;
  session: string;
  time: string;
  status: AttendanceStatus;
};

export type StudentAttendanceSummary = {
  overall: number;
  required: number;
  present: number;
  absent: number;
  late: number;
  totalSessions: number;
};

export type StudentPortalData = {
  courses: StudentCourse[];
  assignments: StudentAssignment[];
  announcements: StudentAnnouncement[];
  attendance: {
    summary: StudentAttendanceSummary;
    records: StudentAttendanceRecord[];
  };
};

export type PortalModule = {
  id: string;
  title: string;
  duration: string;
  type: "video" | "document" | "quiz";
};

export type PortalCourseDetail = {
  id: string;
  title: string;
  duration: string;
  description: string;
  progress: number;
  modules: PortalModule[];
};
