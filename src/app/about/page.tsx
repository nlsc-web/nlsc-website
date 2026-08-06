import type { Metadata } from "next";
import Image from "next/image";
import MissionVisionSection from "@/components/about/MissionVisionSection";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "About | Next Level Solutions Campus",
  description:
    "Learn about Next Level Solutions Campus — our mission, vision, and commitment to student success in Colombo.",
};

const historyCardClassName =
  "rounded-xl border border-nlsc-border border-l-2 border-l-nlsc-gold bg-nlsc-surface p-6 shadow-[0_1px_2px_rgba(17,24,39,0.04),0_8px_24px_rgba(17,24,39,0.05)] sm:p-8";

export default function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-nlsc-border px-6 py-24 sm:py-28">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/about-hero-bg.png"
            alt=""
            fill
            priority
            className="object-cover object-center brightness-[1.05] contrast-[0.9] saturate-[0.7] sepia-[0.18]"
            sizes="100vw"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-nlsc-beige/45 dark:bg-nlsc-black/50" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[rgba(255,210,170,0.38)] via-nlsc-beige/25 to-nlsc-beige/55 dark:from-[rgba(212,175,55,0.12)] dark:via-nlsc-black/40 dark:to-nlsc-black/65" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(255,195,140,0.42),transparent_52%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,255,255,0.28),transparent_68%)] dark:bg-[radial-gradient(ellipse_at_50%_50%,rgba(17,24,39,0.2),transparent_68%)]" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-nlsc-gold-text drop-shadow-md">
            About Us
          </p>
          <h1 className="mb-5 text-3xl font-bold tracking-tight text-nlsc-text drop-shadow-md dark:text-white sm:text-4xl">
            Empowering the Next Generation
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-nlsc-text drop-shadow-md dark:text-white/90 sm:text-lg">
            Next Level Solutions Campus (NLSC) is a Colombo-based institution
            committed to delivering industry-relevant education that bridges the
            gap between academic learning and real-world careers.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 h-px bg-gradient-to-r from-nlsc-gold/0 via-nlsc-gold/40 to-nlsc-gold/0" />
      </section>

      <MissionVisionSection />

      <section className="bg-nlsc-beige px-6 py-20 dark:bg-nlsc-black sm:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeader eyebrow="Our story" title="Our history" />
          <div
            className={`${historyCardClassName} space-y-5 text-sm leading-relaxed text-nlsc-muted sm:text-base`}
          >
            <p>
              Next Level Solutions Campus was established in Colombo with a clear
              purpose: to give students practical, workplace-ready skills in
              accounting, business, and professional services. What began as a
              focused training initiative has grown into a trusted campus known
              for hands-on learning and real career outcomes.
            </p>
            <p>
              From our early fast-track programs to today&apos;s comprehensive
              courses, NLSC has stayed committed to bridging the gap between
              classroom theory and industry practice. Our graduates go on to
              work with confidence in accounting firms, corporate finance teams,
              and businesses across Sri Lanka.
            </p>
            <p>
              Today, we continue to expand our programs, strengthen industry
              partnerships, and support every student on their path from learning
              to employment — building on a foundation of quality, integrity, and
              professional excellence.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
