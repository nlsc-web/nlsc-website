import Image from "next/image";

type CourseCardProps = {
  title: string;
  description?: string;
  duration?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  variant?: "course" | "image";
};

export default function CourseCard({
  title,
  description,
  duration,
  imageSrc,
  imageAlt,
  imageFit = "cover",
  variant = "course",
}: CourseCardProps) {
  if (variant === "image") {
    return (
      <article className="nlsc-card-popup group overflow-hidden rounded-lg border border-nlsc-border bg-nlsc-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div
          className={`relative overflow-hidden ${
            imageFit === "contain"
              ? "aspect-square bg-nlsc-black"
              : "aspect-[4/3] bg-nlsc-card-placeholder"
          }`}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt ?? title}
              fill
              className={`transition-transform duration-500 group-hover:scale-105 ${
                imageFit === "contain" ? "object-contain p-2" : "object-cover"
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : null}
        </div>
        <div className="border-t border-nlsc-border p-5">
          <p className="font-semibold text-nlsc-text">{title}</p>
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-nlsc-muted">
              {description}
            </p>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="nlsc-card-popup group relative flex h-full flex-col overflow-hidden rounded-lg border border-nlsc-border bg-nlsc-surface p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-nlsc-gold transition-transform duration-300 group-hover:scale-x-100" />

      {duration && (
        <span className="mb-5 inline-block w-fit rounded-md border border-nlsc-gold bg-nlsc-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-nlsc-gold-text dark:border-transparent dark:bg-nlsc-black dark:text-nlsc-gold">
          {duration}
        </span>
      )}

      <h3 className="text-lg font-bold text-nlsc-text">{title}</h3>
      {description && (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-nlsc-muted">
          {description}
        </p>
      )}
    </article>
  );
}
