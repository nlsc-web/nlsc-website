import type { CoursesPageContent } from "@/lib/courses/popular-courses";

type CoursesDetailCardProps = {
  title: string;
  content: CoursesPageContent;
};

function CheckIcon() {
  return (
    <span
      className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-nlsc-border bg-nlsc-beige text-nlsc-text dark:border-nlsc-border dark:bg-nlsc-black dark:text-white"
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

export default function CoursesDetailCard({ title, content }: CoursesDetailCardProps) {
  return (
    <article className="nlsc-card-popup group relative flex h-full flex-col overflow-hidden rounded-lg border border-nlsc-border bg-nlsc-surface p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-nlsc-gold transition-transform duration-300 group-hover:scale-x-100" />

      <h3 className="text-lg font-bold text-nlsc-text">{title}</h3>

      <div className="mt-4 space-y-4 text-sm leading-relaxed text-nlsc-muted">
        <p>{content.description}</p>
        <p>{content.overview}</p>

        <div className="border-t border-nlsc-border pt-4">
          <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-nlsc-gold-text">
            Course Modules
          </h4>
          <ul className="space-y-5">
            {content.moduleSections.map((module) => (
              <li key={module.title}>
                <p className="font-semibold text-nlsc-text">{module.title}</p>
                {module.intro ? (
                  <p className="mt-2 text-sm text-nlsc-muted">{module.intro}</p>
                ) : null}
                {module.items && module.items.length > 0 ? (
                  <ul className="mt-2 space-y-1.5">
                    {module.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-nlsc-text"
                      >
                        <CheckIcon />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : module.content ? (
                  <p className="mt-1 text-sm leading-relaxed text-nlsc-muted">
                    {module.content}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-nlsc-border pt-4">
          <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-nlsc-gold-text">
            Who Should Join?
          </h4>
          <ul className="list-disc space-y-2 pl-5 marker:text-nlsc-text dark:marker:text-white">
            {content.audience.map((item) => (
              <li key={item} className="text-sm text-nlsc-text">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {content.highlights && content.highlights.length > 0 ? (
          <div className="border-t border-nlsc-border pt-4">
            <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-nlsc-gold-text">
              {content.highlightsLabel ?? "Why Choose This Programme?"}
            </h4>
            <ul className="list-disc space-y-2 pl-5 marker:text-nlsc-text dark:marker:text-white">
              {content.highlights.map((item) => (
                <li key={item} className="text-sm text-nlsc-text">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}
