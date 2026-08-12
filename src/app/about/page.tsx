import type { Metadata } from "next";
import Image from "next/image";
import HistorySection from "@/components/about/HistorySection";
import MissionVisionSection from "@/components/about/MissionVisionSection";

export const metadata: Metadata = {
  title: "About | Next Level Solutions Campus",
  description:
    "Learn about Next Level Solutions Campus — our mission, vision, and commitment to student success in Colombo.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-nlsc-border px-6 py-24 sm:py-28">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/about-hero-bg.png"
            alt=""
            fill
            priority
            className="object-cover object-center brightness-[1.05] contrast-[0.9] saturate-[0.7] sepia-[0.18]"
            sizes="100vw"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-nlsc-beige/45 dark:bg-nlsc-black/50" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[rgba(255,210,170,0.38)] via-nlsc-beige/25 to-nlsc-beige/55 dark:from-[rgba(212,175,55,0.12)] dark:via-nlsc-black/40 dark:to-nlsc-black/65" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(255,195,140,0.42),transparent_52%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,255,255,0.28),transparent_68%)] dark:bg-[radial-gradient(ellipse_at_50%_50%,rgba(17,24,39,0.2),transparent_68%)]" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-nlsc-gold-text drop-shadow-md">
            About Us
          </p>
          <h1 className="mb-5 text-3xl font-bold tracking-tight text-nlsc-text drop-shadow-md dark:text-white sm:text-4xl">
            Empowering the Next Generation
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-nlsc-text drop-shadow-md dark:text-white/90 sm:text-lg">
            Next Level Solutions Campus (NLSC) is a Colombo-based institution
            committed to delivering industry-relevant education that bridges the
            gap between academic learning and real-world careers.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 h-px bg-gradient-to-r from-nlsc-gold/0 via-nlsc-gold/40 to-nlsc-gold/0" />
      </section>

      <MissionVisionSection />

      <HistorySection />
    </main>
  );
}
