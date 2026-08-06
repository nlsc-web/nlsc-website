import Image from "next/image";

type PopularCourseCardProps = {
  title: string;
  duration: string;
  description: string;
  features?: string[];
  imageSrc: string;
  imageAlt: string;
  overview?: string;
  modules?: string[];
  modulesLabel?: string;
  audience?: string[];
  highlights?: string[];
  highlightsLabel?: string;
  outcome?: string;
  detailed?: boolean;
};

function CheckIcon() {
  return (
    <span
      className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-nlsc-gold/15 text-nlsc-gold-text"
      aria-hidden
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="h-2 w-2"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

export default function PopularCourseCard({
  title,
  duration,
  description,
  features = [],
  imageSrc,
  imageAlt,
  overview,
  modules,
  modulesLabel = "Course Modules",
  audience,
  highlights,
  highlightsLabel = "Why Choose This Programme?",
  outcome,
  detailed = false,
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

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-md border border-nlsc-gold bg-nlsc-black/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-nlsc-gold backdrop-blur-sm">
            {duration}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-semibold tracking-tight text-nlsc-text">
          {title}
        </h3>

        {detailed ? (
          <div className="mt-3 space-y-4 text-sm leading-relaxed text-nlsc-muted">
            <p>{description}</p>
            {overview ? <p>{overview}</p> : null}

            {modules && modules.length > 0 ? (
              <div className="border-t border-nlsc-border pt-4">
                <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-nlsc-gold-text">
                  {modulesLabel}
                </h4>
                <ul className="space-y-2">
                  {modules.map((module) => (
                    <li
                      key={module}
                      className="flex items-start gap-2 text-sm font-semibold text-nlsc-text"
                    >
                      <CheckIcon />
                      {module}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {audience && audience.length > 0 ? (
              <div className="border-t border-nlsc-border pt-4">
                <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-nlsc-gold-text">
                  Who Should Join?
                </h4>
                <ul className="space-y-2">
                  {audience.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-nlsc-text">
                      <CheckIcon />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {highlights && highlights.length > 0 ? (
              <div className="border-t border-nlsc-border pt-4">
                <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-nlsc-gold-text">
                  {highlightsLabel}
                </h4>
                <ul className="space-y-2">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-nlsc-text">
                      <CheckIcon />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {outcome ? (
              <p className="border-t border-nlsc-border pt-4 text-sm text-nlsc-text">
                {outcome}
              </p>
            ) : null}
          </div>
        ) : (
          <>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-nlsc-muted">
              {description}
            </p>

            <ul className="mt-4 space-y-2 border-t border-nlsc-border pt-4">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-nlsc-text"
                >
                  <CheckIcon />
                  {feature}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </article>
  );
}
