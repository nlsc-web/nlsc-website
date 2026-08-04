import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import CourseCard from "@/components/home/CourseCard";

export const metadata: Metadata = {
  title: "Courses | Next Level Solutions Campus",
  description:
    "Explore Industry-focused Courses at NLSC Colombo — Software Engineering, Digital Marketing, Business Management, and more.",
};

const courses = [
  {
    title: "Software Engineering",
    description:
      "Master full-stack development with React, Node.js, and cloud deployment. 12-month program with internship placement.",
  },
  {
    title: "Digital Marketing",
    description:
      "Learn SEO, social media strategy, content marketing, and analytics. Includes Google and Meta certifications.",
  },
  {
    title: "Business Management",
    description:
      "Cover leadership, finance, entrepreneurship, and project management. Ideal for aspiring managers and founders.",
  },
  {
    title: "Data Analytics",
    description:
      "Build skills in Python, SQL, data visualization, and machine learning fundamentals for data-driven roles.",
  },
  {
    title: "Graphic Design",
    description:
      "Develop creative skills in branding, UI/UX, and Adobe Creative Suite. Portfolio-focused curriculum.",
  },
  {
    title: "Cybersecurity",
    description:
      "Understand network security, ethical hacking, and compliance. Prepare for industry security certifications.",
  },
];

export default function CoursesPage() {
  return (
    <main>
      <section className="border-b border-nlsc-border bg-nlsc-beige px-6 py-20 text-center dark:border-transparent">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-nlsc-gold-text">
            Our Programs
          </p>
          <h1 className="mb-5 text-3xl font-bold tracking-tight text-nlsc-text sm:text-4xl">
            Courses Designed for Your Career
          </h1>
          <p className="text-base text-nlsc-muted sm:text-lg">
            Choose from a range of Industry-aligned Programs, each Developed
            with input from leading Employers in Colombo and Beyond.
          </p>
        </div>
      </section>

      <section className="bg-nlsc-surface px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="All Programs" title="Available Courses" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.title}
                title={course.title}
                description={course.description}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
