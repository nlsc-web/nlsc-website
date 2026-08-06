import type { Metadata } from "next";
import Image from "next/image";
import CoursesDetailCard from "@/components/courses/CoursesDetailCard";
import SectionHeader from "@/components/SectionHeader";
import { popularCourses } from "@/lib/courses/popular-courses";

export const metadata: Metadata = {
  title: "Courses | Next Level Solutions Campus",
  description:
    "Explore NLSC accounting programmes — 20 Days Theory and 4 Days Fast Track Practical Accounting in Colombo.",
};

export default function CoursesPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-nlsc-border px-6 py-24 sm:py-28">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/courses-hero-bg.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-nlsc-beige/25 dark:bg-nlsc-black/40" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-nlsc-beige/20 via-nlsc-beige/30 to-nlsc-beige/50 dark:from-nlsc-black/30 dark:via-nlsc-black/45 dark:to-nlsc-black/65" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-nlsc-gold-text drop-shadow-md">
            Our Programs
          </p>
          <h1 className="mb-5 text-3xl font-bold tracking-tight text-nlsc-text drop-shadow-md dark:text-white sm:text-4xl">
            Courses Designed for Your Career
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-nlsc-text drop-shadow-md dark:text-white/90 sm:text-lg">
            Choose from a range of Industry-aligned Programs, each Developed
            with input from leading Employers in Colombo and Beyond.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 h-px bg-gradient-to-r from-nlsc-gold/0 via-nlsc-gold/40 to-nlsc-gold/0" />
      </section>

      <section className="bg-nlsc-surface px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="All Programs" title="Available Courses" />
          <div className="space-y-6 md:space-y-8">
            {popularCourses.map(
              (course) =>
                course.coursesPageContent && (
                  <CoursesDetailCard
                    key={course.title}
                    title={course.title}
                    content={course.coursesPageContent}
                  />
                ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
