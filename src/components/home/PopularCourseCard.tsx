import Image from "next/image";
import Link from "next/link";

type PopularCourseCardProps = {
  title: string;
  duration: string;
  description: string;
  features: string[];
  imageSrc: string;
  imageAlt: string;
};

export default function PopularCourseCard({
  title,
  duration,
  description,
  features,
  imageSrc,
  imageAlt,
}: PopularCourseCardProps) {
  return (
    <article className="nlsc-card-popup group flex h-full flex-col overflow-hidden rounded-lg border border-nlsc-border bg-nlsc-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-nlsc-card-placeholder">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nlsc-black/75 via-nlsc-black/20 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-md border border-nlsc-gold bg-nlsc-black/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-nlsc-gold backdrop-blur-sm">
            {duration}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="text-xl font-semibold tracking-tight text-nlsc-text">
          {title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-nlsc-muted">
          {description}
        </p>

        <ul className="mt-5 space-y-2.5 border-t border-nlsc-border pt-5">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm text-nlsc-text"
            >
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-nlsc-gold/15 text-nlsc-gold-text"
                aria-hidden
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="h-2.5 w-2.5"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <Link
          href="/courses"
          className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-nlsc-gold-text transition-colors hover:text-nlsc-text dark:hover:text-white"
        >
          View program details
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
