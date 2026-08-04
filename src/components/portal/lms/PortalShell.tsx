"use client";

import {
  BellIcon,
  CloseIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  type IconProps,
} from "@/components/portal/lms/icons";
import Image from "next/image";
import { useState, type ReactNode } from "react";
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
  navItems: PortalNavItem[];
  active: string;
  onNavigate: (label: string) => void;
  onLogout: () => void;
  children: ReactNode;
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

export default function PortalShell({
  userName,
  userId,
  roleLabel = "Student",
  searchPlaceholder = "Search courses, assignments...",
  navItems,
  active,
  onNavigate,
  onLogout,
  children,
}: PortalShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: lmsTokens.bg }}>
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col justify-between transition-transform duration-200 lg:static ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="nlsc-brand-surface relative flex h-full flex-col justify-between">
          <div
            className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-nlsc-gold/60 to-transparent"
            aria-hidden
          />

          <div>
            <div className="flex items-center justify-between px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-nlsc-gold/40 bg-black/30 p-0.5">
                  <Image
                    src="/nlsc-logo.png"
                    alt="NLSC"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <div>
                  <span
                    className="block text-base leading-tight text-white"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    NLSC LMS
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-nlsc-gold/80">
                    {roleLabel === "Administrator" ? "Admin Portal" : "Student Portal"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="text-white/60 lg:hidden"
                onClick={() => setMobileOpen(false)}
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <div className="px-5 pb-4">
              <span
                className="inline-block rounded border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{
                  borderColor: "rgb(212 175 55 / 0.35)",
                  backgroundColor: "rgb(212 175 55 / 0.1)",
                  color: lmsTokens.gold500,
                }}
              >
                Colombo Campus · 2026
              </span>
            </div>

            <nav className="mt-1 flex flex-col gap-0.5 px-3">
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
          </div>

          <div className="px-3 pb-5">
            <div
              className="mb-3 h-px"
              style={{ backgroundColor: "rgb(212 175 55 / 0.2)" }}
            />
            <NavItem
              icon={SettingsIcon}
              label="Settings"
              active={false}
              onClick={() => {}}
            />
            <NavItem
              icon={LogOutIcon}
              label="Log out"
              active={false}
              onClick={onLogout}
            />
            <p className="mt-4 px-4 text-[10px] text-white/35">ID: {userId}</p>
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

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="relative flex h-16 shrink-0 items-center justify-between border-b bg-white px-5 lg:px-8"
          style={{ borderColor: lmsTokens.line }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-nlsc-gold/50 to-transparent"
            aria-hidden
          />

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              className="shrink-0 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon size={20} color={lmsTokens.ink} />
            </button>
            <div
              className="hidden max-w-xl flex-1 items-center gap-2.5 rounded-md border px-3.5 py-2.5 sm:flex"
              style={{
                borderColor: lmsTokens.line,
                backgroundColor: "#f5f5f5",
              }}
            >
              <SearchIcon size={15} color={lmsTokens.slate} />
              <input
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400 focus:outline-none"
                style={{ color: lmsTokens.ink }}
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <button type="button" className="relative rounded-md p-1 transition-colors hover:bg-neutral-100">
              <BellIcon size={19} color={lmsTokens.ink} />
              <span
                className="absolute right-0 top-0 h-2 w-2 rounded-full ring-2 ring-white"
                style={{ backgroundColor: lmsTokens.bad }}
              />
            </button>
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold text-white"
                style={{
                  backgroundColor: lmsTokens.navy900,
                  borderColor: "rgb(212 175 55 / 0.4)",
                }}
              >
                {getInitials(userName)}
              </div>
              <div className="hidden leading-tight sm:block">
                <div className="text-sm font-semibold" style={{ color: lmsTokens.ink }}>
                  {userName}
                </div>
                <div
                  className="text-[11px] font-medium uppercase tracking-wide"
                  style={{ color: lmsTokens.gold500 }}
                >
                  {roleLabel}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PortalBrandPanel() {
  return (
    <div className="relative flex w-full flex-col justify-between overflow-hidden px-8 py-12 lg:w-[42%] lg:px-12 lg:py-16">
      <div className="nlsc-brand-surface absolute inset-0" aria-hidden />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nlsc-gold/70 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(212,175,55,0.1),transparent_55%)]" />

      <div className="relative flex items-center gap-3">
        <Image
          src="/nlsc-logo.png"
          alt="Next Level Solutions Campus"
          width={56}
          height={56}
          className="h-14 w-14 object-contain"
          priority
        />
        <span className="hidden max-w-[11rem] text-[11px] font-semibold uppercase leading-snug tracking-[0.14em] text-white/90 sm:block">
          Next Level Solutions Campus
        </span>
      </div>

      <div className="relative max-w-md border-l border-nlsc-gold pl-8">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-nlsc-gold">
          Learning Management System
        </p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-white lg:text-4xl xl:text-[2.75rem]">
          Build your accounting
          <br />
          career
          <br />
          <span className="text-nlsc-gold">with confidence.</span>
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-white/65 sm:text-base">
          Professional accounting programs, coursework, and progress — organized
          in one portal, from classroom learning to real career success.
        </p>
      </div>

      <p className="relative text-xs text-white/40">
        Next Level Solutions Campus · Colombo
      </p>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-nlsc-gold/0 via-nlsc-gold/50 to-nlsc-gold/0" />
    </div>
  );
}
