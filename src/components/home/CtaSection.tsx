import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-28">
      <div className="nlsc-brand-surface absolute inset-0" aria-hidden />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nlsc-gold/70 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(212,175,55,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-nlsc-gold-text">
          Take the next step
        </p>

        <h2 className="mb-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Ready to Start your Journey?
        </h2>

        <div className="mx-auto mb-8 h-px w-12 bg-nlsc-gold/50" />

        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
          Get in touch with our admissions team and find the program that fits
          your career goals.
        </p>

        <Link
          href="/contact"
          className="inline-flex items-center gap-3 rounded-md border border-nlsc-gold bg-nlsc-gold px-9 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-nlsc-black transition-all duration-300 hover:bg-transparent hover:text-nlsc-gold-text"
        >
          Contact us
          <span aria-hidden="true" className="text-lg leading-none">
            →
          </span>
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-nlsc-gold/0 via-nlsc-gold/50 to-nlsc-gold/0" />
    </section>
  );
}
