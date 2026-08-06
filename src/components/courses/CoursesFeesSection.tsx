import SectionHeader from "@/components/SectionHeader";
import { courseFees } from "@/lib/courses/course-fees";

function parsePrice(price: string) {
  const match = price.match(/^(Rs\.)\s*(.+)$/);
  if (!match) return { currency: "", amount: price };
  return { currency: match[1], amount: match[2] };
}

function CourseFeeCard({
  title,
  subtitle,
  duration,
  price,
  includes,
  priceBreakdown,
  discount,
  featured = false,
}: (typeof courseFees)[number]) {
  const { currency, amount } = parsePrice(price);

  return (
    <article
      className={`nlsc-card-popup group relative flex h-full flex-col overflow-hidden rounded-xl border p-6 shadow-[0_2px_12px_rgba(15,23,42,0.06)] sm:p-7 ${
        featured
          ? "border-nlsc-gold/50 bg-nlsc-surface ring-1 ring-nlsc-gold/20"
          : "border-nlsc-border/80 bg-nlsc-surface"
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 ${
          featured
            ? "bg-gradient-to-r from-nlsc-gold/60 via-nlsc-gold to-nlsc-gold/60"
            : "origin-left scale-x-0 bg-nlsc-gold transition-transform duration-300 group-hover:scale-x-100"
        }`}
      />

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex rounded-md border border-nlsc-border bg-nlsc-beige/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-nlsc-muted">
            {duration}
          </span>
          {featured ? (
            <span className="inline-flex rounded-md border border-nlsc-gold/40 bg-nlsc-gold/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-nlsc-gold-text">
              Best value
            </span>
          ) : null}
        </div>

        <div className="mt-4">
          <h3 className="text-base font-semibold leading-snug tracking-tight text-nlsc-text sm:text-lg">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-2 text-sm leading-relaxed text-nlsc-muted">{subtitle}</p>
          ) : null}
        </div>

        {includes && includes.length > 0 ? (
          <ul className="mt-4 flex-1 list-disc space-y-1.5 pl-4 marker:text-nlsc-gold-text">
            {includes.map((item) => (
              <li key={item} className="text-sm leading-snug text-nlsc-text">
                {item}
              </li>
            ))}
          </ul>
        ) : !priceBreakdown ? (
          <div className="flex-1" aria-hidden />
        ) : null}

        {priceBreakdown ? (
          <div className="mt-4 rounded-lg border border-nlsc-border/60 bg-nlsc-beige/50 px-3 py-2.5 sm:px-4 sm:py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-nlsc-muted">
              Fee breakdown
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="min-w-0 text-xs font-semibold leading-tight tabular-nums text-nlsc-text">
                {priceBreakdown}
              </p>
              {discount ? (
                <div className="shrink-0 rounded border border-nlsc-gold/45 bg-nlsc-gold/10 px-2 py-1 text-center leading-none shadow-[0_0_0_1px_rgb(212_175_55_/_0.08)]">
                  <span className="block text-[8px] font-bold uppercase tracking-[0.1em] text-nlsc-gold-text">
                    Discount
                  </span>
                  <span className="mt-0.5 block text-[10px] font-semibold tabular-nums text-nlsc-gold-text">
                    {discount}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {!includes?.length && priceBreakdown ? (
          <div className="flex-1" aria-hidden />
        ) : null}
      </div>

      <div className="mt-auto border-t border-nlsc-border/80 pt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-nlsc-gold-text">
          Course Fees
        </p>
        <p className="mt-2 flex items-baseline gap-2 tabular-nums">
          {currency ? (
            <span className="text-sm font-medium text-nlsc-muted">{currency}</span>
          ) : null}
          <span className="text-3xl font-semibold tracking-tight text-nlsc-text">
            {amount}
          </span>
        </p>
      </div>
    </article>
  );
}

export default function CoursesFeesSection() {
  return (
    <section className="relative overflow-hidden border-t border-nlsc-border bg-nlsc-beige px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.08),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nlsc-gold/40 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeader eyebrow="Investment" title="Course Fees" />

        <p className="mx-auto -mt-4 mb-12 max-w-2xl text-center text-base leading-relaxed text-nlsc-muted">
          Clear, Upfront Programme Pricing to Help You Choose the Learning path
          that fits Your Career Goals.
        </p>

        <div className="grid items-stretch gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {courseFees.map((fee) => (
            <CourseFeeCard key={fee.title} {...fee} />
          ))}
        </div>
      </div>
    </section>
  );
}
