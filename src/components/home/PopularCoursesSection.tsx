import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import PopularCourseCard from "./PopularCourseCard";

const courses = [
  {
    title: "4 Days Fast Track Course",
    duration: "4 Days",
    description:
      "Gain hands-on experience through our fast-track program, designed to bridge the gap between theory and real-world practice in accounting and business operations.",
    features: [
      "Industry-standard procedures",
      "Accounting software training",
      "Business documentation",
      "Workplace-ready applications",
    ],
    imageSrc: "/course-4days-practical.png",
    imageAlt: "Practical accounting training with calculator, documents, and financial analysis",
  },
  {
    title: "20 Days All Inclusive Course",
    duration: "20 Days",
    description:
      "Build a strong foundation in accounting and business with our comprehensive program covering taxation, auditing, HR, and professional workplace standards.",
    features: [
      "Taxation & accounting",
      "HR management & auditing",
      "Ratio analysis",
      "Standard operating procedures (SOPs)",
    ],
    imageSrc: "/cand-b.jpg",
    imageAlt: "Comprehensive professional accounting course",
  },
];

export default function PopularCoursesSection() {
  return (
    <section className="relative overflow-hidden border-t border-nlsc-border bg-nlsc-surface px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.06),transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeader eyebrow="Our programs" title="Popular Courses" />

        <p className="mx-auto -mt-4 mb-12 max-w-2xl text-center text-base leading-relaxed text-nlsc-muted">
          Choose a program built for real workplace performance — from intensive
          fast-track learning to a complete professional foundation.
        </p>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {courses.map((course) => (
            <PopularCourseCard key={course.title} {...course} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-3 rounded-md border border-nlsc-gold bg-nlsc-gold px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-nlsc-black transition-all duration-300 hover:bg-transparent hover:text-nlsc-gold-text"
          >
            View all Courses
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
