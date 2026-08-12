import SectionHeader from "@/components/SectionHeader";

export default function HistorySection() {
  return (
    <section className="relative overflow-hidden border-t border-nlsc-border bg-nlsc-beige px-6 py-20 dark:bg-nlsc-black sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.07),transparent_55%)]" />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeader eyebrow="Our story" title="Our History" />

        <div className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-nlsc-gold/35 bg-nlsc-surface px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-nlsc-gold-text shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-nlsc-gold" aria-hidden />
            Established January 2025
          </span>
        </div>

        <article className="overflow-hidden rounded-xl border border-nlsc-border bg-nlsc-surface shadow-[0_1px_2px_rgba(17,24,39,0.04),0_12px_40px_rgba(17,24,39,0.06)]">
          <div className="h-1 bg-gradient-to-r from-nlsc-gold/50 via-nlsc-gold to-nlsc-gold/50" />

          <div className="space-y-5 p-6 sm:p-8 md:p-10">
            <p className="text-sm leading-[1.85] text-nlsc-muted sm:text-[15px]">
              Next Level Solutions Campus was established in January 2025 with a
              clear vision of creating a platform where students and professionals
              could gain not only theoretical knowledge, but also the practical
              skills required to succeed in the modern workplace.
            </p>
            <p className="text-sm leading-[1.85] text-nlsc-muted sm:text-[15px]">
              The Campus was founded in response to a growing need for practical,
              industry-oriented education. We recognized that academic
              qualifications alone are often not enough to build a successful
              career. Students and aspiring professionals need hands-on
              experience, professional guidance, and the confidence to apply
              their knowledge in real-world situations.
            </p>
            <p className="text-sm leading-[1.85] text-nlsc-muted sm:text-[15px]">
              From the beginning, Next Level Solutions Campus has focused on
              delivering practical and career-focused training in areas such as
              accounting, taxation, financial management, QuickBooks, HR and
              payroll, internal controls, and business management.
            </p>
            <p className="text-sm leading-[1.85] text-nlsc-muted sm:text-[15px]">
              Since its establishment, the Campus has continued to develop its
              programs with the aim of connecting education with real-world
              business practices. Our training approach emphasizes practical
              application, industry knowledge, and professional development,
              helping learners become more confident and workplace-ready.
            </p>
            <p className="text-sm leading-[1.85] text-nlsc-muted sm:text-[15px]">
              As we continue to grow, our commitment remains unchanged — to
              empower students, professionals, and entrepreneurs with the
              knowledge, skills, and confidence to take their careers and
              businesses to the next level.
            </p>
          </div>
        </article>

        <article className="mt-6 overflow-hidden rounded-xl border border-nlsc-border border-l-[3px] border-l-nlsc-gold bg-nlsc-surface p-6 shadow-[0_1px_2px_rgba(17,24,39,0.04),0_8px_24px_rgba(17,24,39,0.05)] sm:p-8">
          <h3 className="mb-3 text-xl font-semibold tracking-tight text-nlsc-text sm:text-2xl">
            Our Journey Continues
          </h3>
          <p className="text-sm leading-[1.85] text-nlsc-muted sm:text-[15px]">
            Established in January 2025, Next Level Solutions Campus is building
            its future with a commitment to practical learning, professional
            excellence, and continuous development.
          </p>
        </article>

        <div className="mt-10 border-t border-nlsc-gold/25 pt-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-nlsc-gold-text sm:text-xs">
            Learn. Apply. Grow. Reach Your Next Level.
          </p>
        </div>
      </div>
    </section>
  );
}
