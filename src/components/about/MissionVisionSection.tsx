import type { ReactNode } from "react";
import SectionHeader from "@/components/SectionHeader";

function VisionIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="text-nlsc-gold"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MissionIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="text-nlsc-gold"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

type PillarProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

function Pillar({ icon, title, children }: PillarProps) {
  return (
    <article className="group relative w-full overflow-hidden rounded-xl border border-nlsc-border border-l-[3px] border-l-nlsc-gold bg-nlsc-surface shadow-[0_1px_2px_rgba(17,24,39,0.04),0_8px_24px_rgba(17,24,39,0.05)] transition-all duration-300 hover:border-nlsc-gold/35 hover:shadow-[0_12px_40px_rgba(17,24,39,0.08)]">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-nlsc-gold/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex gap-5 p-6 sm:gap-8 sm:p-8 md:p-9">
        <div className="flex shrink-0 items-start">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-lg border border-nlsc-gold/25 bg-gradient-to-br from-nlsc-gold/15 to-nlsc-gold/5 shadow-sm sm:h-14 sm:w-14">
            {icon}
          </div>
        </div>

        <div className="min-w-0 flex-1 border-l border-nlsc-border pl-5 sm:pl-8">
          <h3 className="mb-4 text-xl font-semibold tracking-tight text-nlsc-text sm:text-2xl">
            {title}
          </h3>
          <div className="space-y-4 text-sm leading-[1.75] text-nlsc-muted sm:text-[15px]">
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MissionVisionSection() {
  return (
    <section className="relative overflow-hidden border-y border-nlsc-border bg-nlsc-surface px-6 py-20 dark:border-transparent sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.06),transparent_55%)]" />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeader eyebrow="Our purpose" title="Vision & Mission" />

        <div className="relative space-y-5 md:space-y-6">
          <div
            aria-hidden
            className="absolute bottom-8 left-[38px] top-8 hidden w-px bg-gradient-to-b from-nlsc-gold/40 via-nlsc-gold/20 to-nlsc-gold/40 sm:block"
          />

          <Pillar icon={<VisionIcon />} title="Our Vision">
            <p>
              To empower every learner with accessible, practical, and
              career-oriented education that transforms potential into
              professional excellence and prepares future leaders for the global
              business environment.
            </p>
          </Pillar>

          <Pillar icon={<MissionIcon />} title="Our Mission">
            <p>
              At Next Level Solutions Campus, we are committed to delivering
              high-quality, affordable, and practical education through
              innovative learning methods and experienced industry professionals.
            </p>
            <p>
              Our mission is to bridge the gap between academic knowledge and
              workplace requirements by equipping students, professionals, and
              entrepreneurs with the skills, confidence, and real-world expertise
              needed to excel in accounting, finance, taxation, human resource
              management, auditing, and business management.
            </p>
          </Pillar>
        </div>
      </div>
    </section>
  );
}
