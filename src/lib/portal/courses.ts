export type PortalModule = {
  id: string;
  title: string;
  duration: string;
  type: "video" | "document" | "quiz";
};

export type PortalCourse = {
  id: string;
  title: string;
  duration: string;
  description: string;
  progress: number;
  modules: PortalModule[];
};

export const portalCourses: PortalCourse[] = [
  {
    id: "fast-track-4days",
    title: "4 Days Fast Track Course",
    duration: "4 Days",
    description:
      "Hands-on accounting and business operations training designed for fast workplace readiness.",
    progress: 35,
    modules: [
      {
        id: "ft-1",
        title: "Introduction to Professional Accounting",
        duration: "45 min",
        type: "video",
      },
      {
        id: "ft-2",
        title: "Accounting Software Basics",
        duration: "60 min",
        type: "video",
      },
      {
        id: "ft-3",
        title: "Business Documentation Standards",
        duration: "40 min",
        type: "document",
      },
      {
        id: "ft-4",
        title: "Practical Workplace Applications",
        duration: "50 min",
        type: "quiz",
      },
    ],
  },
  {
    id: "all-inclusive-20days",
    title: "20 Days All Inclusive Course",
    duration: "20 Days",
    description:
      "Comprehensive program covering taxation, auditing, HR, and professional workplace standards.",
    progress: 10,
    modules: [
      {
        id: "ai-1",
        title: "Financial Accounting Foundations",
        duration: "90 min",
        type: "video",
      },
      {
        id: "ai-2",
        title: "Taxation Essentials",
        duration: "75 min",
        type: "video",
      },
      {
        id: "ai-3",
        title: "HR Management & Auditing",
        duration: "80 min",
        type: "document",
      },
      {
        id: "ai-4",
        title: "Ratio Analysis & Reporting",
        duration: "70 min",
        type: "video",
      },
      {
        id: "ai-5",
        title: "Standard Operating Procedures (SOPs)",
        duration: "60 min",
        type: "document",
      },
      {
        id: "ai-6",
        title: "Final Assessment",
        duration: "120 min",
        type: "quiz",
      },
    ],
  },
];

export function getPortalCourse(courseId: string) {
  return portalCourses.find((course) => course.id === courseId) ?? null;
}
