import Image from "next/image";

type EventCardProps = {
  title: string;
  description: string;
  date?: string;
  month?: string;
  day?: string;
  dateText?: string;
  imageSrc?: string;
  imageAlt?: string;
  featured?: boolean;
  compact?: boolean;
};

export default function EventCard({
  title,
  description,
  date,
  month,
  day,
  dateText,
  imageSrc,
  imageAlt,
  featured = false,
  compact = false,
}: EventCardProps) {
  if (compact) {
    return (
      <article className="nlsc-card-popup group flex gap-5 rounded-lg border border-nlsc-border bg-nlsc-surface p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        {(dateText || month || day) && (
          <div className="flex min-w-[4.5rem] flex-col items-center justify-center rounded-lg bg-nlsc-black px-3 py-4 text-center">
            {dateText ? (
              <span className="text-[10px] font-semibold leading-snug text-white sm:text-[11px]">
                {dateText}
              </span>
            ) : (
              <>
                {month && (
                  <span className="text-xs font-bold uppercase tracking-wider text-nlsc-gold">
                    {month}
                  </span>
                )}
                {day && (
                  <span
                    className={`mt-0.5 font-bold leading-none text-white ${
                      day.includes("-") ? "text-xl" : "text-2xl"
                    }`}
                  >
                    {day}
                  </span>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex flex-1 flex-col justify-center">
          <h3 className="text-base font-bold text-nlsc-text sm:text-lg">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-nlsc-muted">
            {description}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`nlsc-card-popup group relative flex h-full flex-col overflow-hidden rounded-lg border border-nlsc-border bg-nlsc-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${
        featured ? "md:col-span-2 lg:col-span-3" : ""
      }`}
    >
      <div className="relative min-h-[220px] flex-1 overflow-hidden bg-nlsc-card-placeholder sm:min-h-[280px] lg:min-h-[360px]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-nlsc-black/80 via-nlsc-black/20 to-transparent" />

        {date && (
          <span className="absolute left-5 top-5 rounded-full bg-nlsc-black/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-nlsc-gold backdrop-blur-sm">
            {date}
          </span>
        )}

        {featured && (
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white sm:text-2xl">{title}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {description}
            </p>
          </div>
        )}
      </div>

      {!featured && (
        <div className="relative border-t border-nlsc-border p-6">
          <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-nlsc-gold transition-transform duration-300 group-hover:scale-x-100" />
          <h3 className="text-lg font-bold text-nlsc-text">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-nlsc-muted">
            {description}
          </p>
        </div>
      )}
    </article>
  );
}
