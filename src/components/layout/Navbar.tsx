"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { PORTAL_PATH } from "@/lib/site-config";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 overflow-hidden shadow-[0_4px_28px_rgba(0,0,0,0.35)]">
      <div className="nlsc-brand-surface absolute inset-0" aria-hidden />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nlsc-gold/80 to-transparent" />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/nlsc-logo.png"
            alt="Next Level Solutions Campus"
            width={64}
            height={64}
            className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14"
            priority
          />
          <span className="hidden truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90 sm:block sm:max-w-[9rem] sm:text-[12px] md:max-w-none md:text-[13px] md:tracking-[0.14em] lg:max-w-none">
            Next Level Solutions Campus
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 lg:px-4 lg:py-2.5 lg:text-[11px] lg:tracking-[0.16em] ${
                  isActive
                    ? "bg-nlsc-gold text-nlsc-black shadow-[0_2px_12px_rgba(212,175,55,0.35)]"
                    : "text-white/85 hover:bg-nlsc-gold/20 hover:text-nlsc-gold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href={PORTAL_PATH}
            className="hidden rounded-md border border-nlsc-gold bg-nlsc-gold px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-nlsc-black transition-all duration-300 hover:border-nlsc-gold hover:bg-transparent hover:text-nlsc-gold sm:inline-flex lg:px-5 lg:py-2.5 lg:text-[11px] lg:tracking-[0.16em]"
          >
            Student portal
          </Link>

          <ThemeToggle />

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-nlsc-gold/45 text-white md:hidden"
          >
            {menuOpen ? (
              <span className="text-xl leading-none">×</span>
            ) : (
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="relative max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-nlsc-gold/30 px-4 py-4 sm:px-6 md:hidden">
          <div className="nlsc-brand-surface absolute inset-0" aria-hidden />
          <div className="relative flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-sm px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${
                    isActive
                      ? "bg-nlsc-gold text-nlsc-black"
                      : "text-white/85 hover:bg-nlsc-gold/20 hover:text-nlsc-gold"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href={PORTAL_PATH}
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-sm bg-nlsc-gold px-4 py-3 text-center text-sm font-bold uppercase tracking-widest text-nlsc-black"
            >
              Student portal
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
