import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "About | Next Level Solutions Campus",
  description:
    "Learn about Next Level Solutions Campus — Our Mission, Vision, and Commitment to Student Success in Colombo.",
};

const cardClassName =
  "group relative overflow-hidden rounded-xl border border-nlsc-border bg-nlsc-surface p-6 shadow-[0_1px_2px_rgba(17,24,39,0.04),0_8px_24px_rgba(17,24,39,0.05)] transition-all duration-300 hover:border-nlsc-gold/35 hover:shadow-[0_12px_40px_rgba(17,24,39,0.08)] sm:p-8";

export default function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-nlsc-border bg-nlsc-beige px-6 py-24 text-center dark:border-transparent dark:bg-nlsc-black sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.07),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.1),transparent_60%)]" />

        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-nlsc-gold-text">
            About Us
          </p>
          <h1 className="mb-5 text-3xl font-bold tracking-tight text-nlsc-text dark:text-white sm:text-4xl">
            Empowering the next Generation
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-nlsc-muted dark:text-white/65 sm:text-lg">
            Next Level Solutions Campus (NLSC) is a Colombo-based Institution
            committed to delivering industry-relevant Education that bridges the
            gap between Academic Learning and real-world Careers.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-nlsc-gold/0 via-nlsc-gold/40 to-nlsc-gold/0" />
      </section>

      <section className="bg-nlsc-surface px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className={cardClassName}>
              <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-nlsc-gold transition-transform duration-300 group-hover:scale-x-100" />
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-nlsc-gold-text">
                Our mission
              </p>
              <h2 className="mb-4 text-2xl font-bold text-nlsc-text">
                Our Mission
              </h2>
              <p className="text-base leading-relaxed text-nlsc-muted">
                We believe every student deserves access to quality education
                that leads to meaningful employment. Our programs are designed
                in partnership with industry leaders to ensure graduates are
                equipped with the skills employers need today.
              </p>
            </article>

            <article className={cardClassName}>
              <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-nlsc-gold transition-transform duration-300 group-hover:scale-x-100" />
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-nlsc-gold-text">
                Our vision
              </p>
              <h2 className="mb-4 text-2xl font-bold text-nlsc-text">
                Our Vision
              </h2>
              <p className="text-base leading-relaxed text-nlsc-muted">
                To become Sri Lanka&apos;s most trusted career-focused campus,
                recognized for producing job-ready graduates who drive innovation
                and growth across technology, business, and creative industries.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-nlsc-beige px-6 py-20 dark:bg-nlsc-black sm:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeader eyebrow="Our story" title="Our History" />
          <div className="space-y-6 text-base leading-relaxed text-nlsc-muted">
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
