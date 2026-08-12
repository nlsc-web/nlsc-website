"use client";

import {
  CloseIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  type IconProps,
} from "@/components/portal/lms/icons";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import { getInitials } from "@/lib/portal/student-data";

type PortalIcon = (props: IconProps) => React.ReactElement;

export type PortalNavItem = {
  icon: PortalIcon;
  label: string;
};

type PortalShellProps = {
  userName: string;
  userId: string;
  roleLabel?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchResults?: ReactNode;
  navItems: PortalNavItem[];
  active: string;
  onNavigate: (label: string) => void;
  onLogout: () => void | Promise<void>;
  children: ReactNode;
  /** Lock main area to viewport height on desktop (dashboard overview). */
  fitViewport?: boolean;
  /** Show centered search in the header (desktop/tablet). */
  showHeaderSearch?: boolean;
};

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: PortalIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-sm transition-colors"
      style={{
        backgroundColor: active ? "rgb(212 175 55 / 0.14)" : "transparent",
        color: active ? lmsTokens.gold500 : "rgba(255,255,255,0.78)",
        fontWeight: active ? 600 : 400,
        borderLeft: active ? `2px solid ${lmsTokens.gold500}` : "2px solid transparent",
      }}
    >
      <Icon size={17} color={active ? lmsTokens.gold500 : "rgba(255,255,255,0.72)"} />
      {label}
    </button>
  );
}

function LogOutButton({
  onClick,
  loading,
  variant = "sidebar",
}: {
  onClick: () => void;
  loading: boolean;
  variant?: "sidebar" | "header";
}) {
  if (variant === "header") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        title={loading ? "Signing out..." : "Log out"}
        aria-label={loggingOutLabel(loading)}
        className="flex shrink-0 items-center gap-3 rounded-md px-4 py-2.5 text-sm transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          background: `linear-gradient(to right, rgb(212 175 55 / 0.16), rgb(212 175 55 / 0.08)), ${lmsTokens.navy900}`,
          color: lmsTokens.gold500,
          fontWeight: 600,
          borderLeft: `2px solid ${lmsTokens.gold500}`,
        }}
      >
        <LogOutIcon size={17} color={lmsTokens.gold500} />
        <span className="hidden sm:inline">
          {loading ? "Signing out..." : "Log out"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-lg border border-nlsc-gold/45 bg-nlsc-gold/10 px-4 py-2.5 text-sm font-semibold text-nlsc-gold transition-all hover:border-nlsc-gold hover:bg-nlsc-gold/20 hover:text-[#f5edd4] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOutIcon size={16} color="currentColor" />
      {loading ? "Signing out..." : "Log out"}
    </button>
  );
}

function loggingOutLabel(loading: boolean) {
  return loading ? "Signing out" : "Log out";
}

function PortalHeaderSearch({
  placeholder,
  className = "",
  value,
  onChange,
  results,
}: {
  placeholder: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  results?: ReactNode;
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex w-full items-center gap-2.5 rounded-full border border-nlsc-gold/35 bg-white px-4 py-2.5 shadow-[0_1px_2px_rgb(10_10_10/0.04),0_4px_12px_rgb(212_175_55/0.08)] transition-all focus-within:border-nlsc-gold focus-within:shadow-[0_0_0_3px_rgb(212_175_55/0.14)]">
        <SearchIcon size={16} color={lmsTokens.gold600} />
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:font-normal placeholder:text-neutral-400"
          style={{ color: lmsTokens.ink }}
          aria-label={placeholder}
        />
      </div>
      {results}
    </div>
  );
}

export default function PortalShell({
  userName,
  userId,
  roleLabel = "Student",
  searchPlaceholder = "Search courses, assignments...",
  searchValue,
  onSearchChange,
  searchResults,
  navItems,
  active,
  onNavigate,
  onLogout,
  children,
  fitViewport = false,
  showHeaderSearch = true,
}: PortalShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setMobileOpen(false);
    try {
      await onLogout();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div
      className={`flex min-h-screen font-sans ${fitViewport ? "lg:h-dvh lg:min-h-0 lg:overflow-hidden" : ""}`}
      style={{ backgroundColor: lmsTokens.bg }}
    >
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[min(100vw-3rem,16rem)] max-w-[16rem] flex-col transition-transform duration-200 lg:static lg:w-64 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${fitViewport ? "lg:h-full lg:min-h-0" : ""}`}
      >
        <div className="nlsc-brand-surface relative flex h-full min-h-0 flex-col">
          <div
            className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-nlsc-gold/60 to-transparent"
            aria-hidden
          />

          <div className="flex shrink-0 items-center gap-2 border-b border-white/8 px-4 py-4 sm:px-5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Image
                src="/nlsc-logo.png"
                alt="NLSC"
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <span className="block text-sm font-semibold leading-tight text-white sm:text-base">
                  NLSC LMS
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-nlsc-gold/90">
                  {roleLabel === "Administrator" ? "Admin Portal" : "Student Portal"}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 text-white/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={active === item.label}
                onClick={() => {
                  onNavigate(item.label);
                  setMobileOpen(false);
                }}
              />
            ))}
          </nav>

          <div className="shrink-0 border-t border-white/8 px-3 py-4 lg:hidden">
            <LogOutButton
              variant="sidebar"
              onClick={handleLogout}
              loading={loggingOut}
            />
          </div>

          <div className="hidden shrink-0 px-3 pb-5 lg:block">
            <p className="px-1 text-center text-[10px] text-white/35">
              Signed in as <span className="font-mono text-white/50">{userId}</span>
            </p>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`flex min-w-0 flex-1 flex-col ${fitViewport ? "lg:min-h-0 lg:overflow-hidden" : ""}`}
      >
        <header
          className={`relative grid shrink-0 items-center gap-2 border-b bg-white px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-3 lg:px-6 ${
            showHeaderSearch
              ? "grid-cols-[auto_minmax(0,1fr)_auto] md:grid-cols-[auto_1fr_auto] lg:h-[3.75rem]"
              : "grid-cols-[auto_1fr_auto] lg:h-14"
          }`}
          style={{ borderColor: lmsTokens.line }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-nlsc-gold/50 to-transparent"
            aria-hidden
          />

          <div className="flex items-center">
            <button
              type="button"
              className="shrink-0 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon size={20} color={lmsTokens.ink} />
            </button>
          </div>

          <div className="flex min-w-0 justify-end px-0 sm:justify-center sm:px-1 md:px-3">
            {showHeaderSearch && (
              <PortalHeaderSearch
                placeholder={searchPlaceholder}
                className="hidden w-full max-w-md md:flex lg:max-w-xl"
                value={searchValue}
                onChange={onSearchChange}
                results={searchResults}
              />
            )}
          </div>

          <div className="flex min-w-0 shrink-0 items-center justify-end gap-1.5 sm:gap-2 md:gap-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold text-white sm:h-9 sm:w-9"
                style={{
                  backgroundColor: lmsTokens.navy900,
                  borderColor: "rgb(212 175 55 / 0.4)",
                }}
              >
                {getInitials(userName)}
              </div>
              <div className="hidden min-w-0 leading-tight lg:block">
                <div
                  className="truncate text-sm font-semibold"
                  style={{ color: lmsTokens.ink, maxWidth: "11rem" }}
                >
                  {userName}
                </div>
                <div
                  className="text-[10px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: lmsTokens.gold500 }}
                >
                  {roleLabel}
                </div>
              </div>
            </div>
            <LogOutButton
              variant="header"
              onClick={handleLogout}
              loading={loggingOut}
            />
          </div>
        </header>

        {showHeaderSearch && (
          <div
            className="relative border-b bg-white px-3 py-2.5 sm:px-4 sm:py-3 md:hidden"
            style={{ borderColor: lmsTokens.line }}
          >
            <PortalHeaderSearch
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={onSearchChange}
              results={searchResults}
            />
          </div>
        )}

        <main
          className={`flex-1 p-3 sm:p-5 lg:p-6 ${
            fitViewport
              ? "overflow-y-auto lg:flex lg:min-h-0 lg:flex-col lg:overflow-hidden lg:p-5"
              : "overflow-y-auto overflow-x-hidden lg:p-8"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export function PortalBrandPanel() {
  return (
    <div className="relative flex w-full shrink-0 flex-col justify-between overflow-hidden px-5 py-6 sm:px-8 sm:py-8 lg:w-[42%] lg:px-12 lg:py-16">
      <div className="nlsc-brand-surface absolute inset-0" aria-hidden />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nlsc-gold/70 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(212,175,55,0.1),transparent_55%)]" />

      <div className="relative flex items-center gap-3">
        <Image
          src="/nlsc-logo.png"
          alt="Next Level Solutions Campus"
          width={56}
          height={56}
          className="h-11 w-11 object-contain sm:h-14 sm:w-14"
          priority
        />
        <span className="max-w-[11rem] text-[10px] font-semibold uppercase leading-snug tracking-[0.12em] text-white/90 sm:text-[11px] sm:tracking-[0.14em]">
          Next Level Solutions Campus
        </span>
      </div>

      <div className="relative my-4 max-w-md border-l border-nlsc-gold pl-4 sm:my-6 sm:pl-5 lg:my-auto lg:pl-8">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-nlsc-gold sm:mb-3 sm:text-[11px] sm:tracking-[0.22em]">
          Learning Management System
        </p>
        <h1 className="text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl lg:text-4xl xl:text-[2.75rem]">
          Build your accounting
          <span className="hidden sm:inline">
            <br />
            career
            <br />
          </span>
          <span className="sm:hidden"> career </span>
          <span className="text-nlsc-gold">with confidence.</span>
        </h1>
        <p className="mt-4 hidden text-sm leading-relaxed text-white/65 md:block sm:text-base">
          Professional accounting programs, coursework, and progress — organized
          in one portal, from classroom learning to real career success.
        </p>
      </div>

      <p className="relative hidden text-xs text-white/40 sm:block">
        Next Level Solutions Campus · Colombo
      </p>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-nlsc-gold/0 via-nlsc-gold/50 to-nlsc-gold/0" />
    </div>
  );
}
