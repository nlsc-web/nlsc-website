"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";

const SLIDE_INTERVAL_MS = 3000;
const SWIPE_THRESHOLD_PX = 48;

const slides = [
  {
    src: "/hero-slide-1.png",
    alt: "Accountant working with invoices, calculator, and financial spreadsheet on screen",
  },
  {
    src: "/hero-slide-2.png",
    alt: "Business professional using a laptop, calculator, and notebook at a modern desk",
  },
  {
    src: "/hero-slide-3.png",
    alt: "Finance team reviewing charts, reports, and accounting documents in the office",
  },
] as const;

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [isControlsHovered, setIsControlsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const isAutoPlayPaused = isTabHidden || isControlsHovered;

  const advanceSlide = useCallback((step: number) => {
    setActiveIndex((current) => (current + step + slides.length) % slides.length);
  }, []);

  const goToNext = useCallback(() => {
    advanceSlide(1);
  }, [advanceSlide]);

  const goToPrevious = useCallback(() => {
    advanceSlide(-1);
  }, [advanceSlide]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || isAutoPlayPaused) return;

    const timer = window.setTimeout(goToNext, SLIDE_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, goToNext, isAutoPlayPaused]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = touchEndX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;

    if (deltaX < 0) {
      goToNext();
      return;
    }

    goToPrevious();
  };

  return (
    <section
      className="relative min-h-[90vh] overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured campus highlights"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={!isActive}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-nlsc-body-bg/96 via-nlsc-beige/92 to-nlsc-body-bg/65 dark:from-nlsc-black/95 dark:via-nlsc-black/80 dark:to-nlsc-black/45" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-nlsc-body-bg/88 via-transparent to-nlsc-beige/45 dark:from-nlsc-black/60 dark:via-transparent dark:to-nlsc-black/30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,175,55,0.1),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,175,55,0.08),transparent_50%)]" />

      <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-6xl items-center px-4 py-20 sm:min-h-[80vh] sm:px-6 sm:py-24 md:min-h-[85vh] md:px-8 md:py-28 lg:min-h-[90vh] lg:py-32">
        <div className="max-w-2xl border-l border-nlsc-gold pl-5 sm:pl-8 md:pl-10">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-nlsc-gold-text">
            Next Level Solutions Campus
          </p>

          <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-nlsc-text dark:text-white sm:text-5xl lg:text-[3.25rem]">
            Build Your Career
            <span className="mt-3 block font-bold text-nlsc-gold-text">
              With Confidence
            </span>
          </h1>

          <p className="mb-10 max-w-lg text-base font-semibold leading-relaxed text-nlsc-text dark:text-white/70 sm:text-lg">
            Professional Accounting and Industry-focused programs designed to
            move you from classroom learning to real Career Success.
          </p>

          <Link
            href="/courses"
            className="inline-flex items-center gap-3 rounded-md bg-nlsc-gold px-9 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-nlsc-black transition-all duration-300 hover:bg-nlsc-black hover:text-nlsc-gold dark:hover:bg-white dark:hover:text-nlsc-black"
          >
            Explore Courses
            <span aria-hidden="true" className="text-lg leading-none">
              →
            </span>
          </Link>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 z-20 px-6 pb-8 sm:px-8"
        onMouseEnter={() => setIsControlsHovered(true)}
        onMouseLeave={() => setIsControlsHovered(false)}
      >
        <div className="mx-auto flex max-w-6xl justify-center">
          <div
            className="flex items-center gap-2.5"
            role="tablist"
            aria-label="Hero slides"
          >
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show slide ${index + 1} of ${slides.length}`}
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-2 w-8 bg-nlsc-gold"
                      : "h-2 w-2 bg-nlsc-text/25 hover:bg-nlsc-gold/50 dark:bg-white/30 dark:hover:bg-nlsc-gold/50"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-nlsc-gold/0 via-nlsc-gold/50 to-nlsc-gold/0" />
    </section>
  );
}
