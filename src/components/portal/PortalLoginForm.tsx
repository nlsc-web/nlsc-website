"use client";

import { PortalBrandPanel } from "@/components/portal/lms/PortalShell";
import {
  ArrowRightIcon,
  GraduationCapIcon,
  ShieldCheckIcon,
} from "@/components/portal/lms/icons";
import PasswordInput from "@/components/portal/PasswordInput";
import type { PortalRole } from "@/lib/portal/session-core";
import {
  CAMPUS_CONTACT_LABEL,
  CAMPUS_MAILTO,
} from "@/lib/site-contact";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PortalStep = "select" | "login";

const inputClassName =
  "w-full rounded-lg border border-nlsc-border bg-nlsc-body-bg px-4 py-3.5 text-sm text-nlsc-text outline-none transition-colors focus:border-nlsc-gold focus:ring-1 focus:ring-nlsc-gold/30 dark:bg-nlsc-black/40";

function PortalPanelHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10 border-l-2 border-nlsc-gold pl-6">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-nlsc-gold-text">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-nlsc-text sm:text-3xl">
        {title}
      </h2>
      <div className="mt-4 h-px w-10 bg-nlsc-gold/50" />
      {subtitle ? (
        <p className="mt-4 text-sm leading-relaxed text-nlsc-muted">{subtitle}</p>
      ) : null}
    </div>
  );
}

function RoleCard({
  icon: Icon,
  title,
  onClick,
}: {
  icon: typeof GraduationCapIcon;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-lg border border-nlsc-border bg-nlsc-surface text-left transition-all duration-300 hover:border-nlsc-gold/55 hover:shadow-[0_12px_40px_rgba(17,24,39,0.08)]"
    >
      <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-nlsc-gold transition-transform duration-300 group-hover:scale-x-100" />
      <div className="flex items-center gap-4 p-5 sm:p-6">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-nlsc-gold/35">
          <div className="nlsc-brand-surface absolute inset-0" aria-hidden />
          <Icon size={22} className="relative text-nlsc-gold" />
        </div>
        <span className="flex-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-nlsc-text">
          {title}
        </span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-nlsc-border text-nlsc-muted transition-all duration-300 group-hover:border-nlsc-gold group-hover:bg-nlsc-gold group-hover:text-nlsc-black">
          <ArrowRightIcon size={16} />
        </span>
      </div>
    </button>
  );
}

export default function PortalLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<PortalStep>("select");
  const [role, setRole] = useState<PortalRole>("student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleRoleSelect(selectedRole: PortalRole) {
    setRole(selectedRole);
    setStep("login");
    setError("");
    setUserId("");
    setPassword("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: userId, password, role }),
      });

      const data = (await response.json()) as {
        error?: string;
        role?: PortalRole;
      };

      if (!response.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        return;
      }

      router.push(
        data.role === "admin" ? "/portal/admin/dashboard" : "/portal/dashboard",
      );
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isAdmin = role === "admin";

  return (
    <div className="flex min-h-screen w-full flex-col bg-nlsc-body-bg lg:flex-row lg:min-h-0 lg:h-screen lg:overflow-hidden">
      <PortalBrandPanel />

      <div className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-12 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(212,175,55,0.07),transparent_45%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-nlsc-gold/0 via-nlsc-gold/25 to-nlsc-gold/0 lg:hidden" />

        <div className="relative w-full max-w-md">
          {step === "select" ? (
            <>
              <PortalPanelHeader
                eyebrow="NLSC Portal"
                title="Sign in to continue"
                subtitle="Select your Portal to Access the Learning System."
              />

              <div className="flex flex-col gap-3">
                <RoleCard
                  icon={GraduationCapIcon}
                  title="Student Portal"
                  onClick={() => handleRoleSelect("student")}
                />
                <RoleCard
                  icon={ShieldCheckIcon}
                  title="Admin Portal"
                  onClick={() => handleRoleSelect("admin")}
                />
              </div>

              <p className="mt-10 border-t border-nlsc-border pt-6 text-center text-xs leading-relaxed text-nlsc-muted">
                Need access? Contact{" "}
                <a
                  href={CAMPUS_MAILTO}
                  className="font-semibold text-nlsc-gold-text transition-colors hover:underline"
                >
                  {CAMPUS_CONTACT_LABEL}
                </a>
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep("select")}
                className="mb-8 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-nlsc-gold-text transition-colors hover:text-nlsc-text"
              >
                <span aria-hidden className="text-base leading-none">
                  ←
                </span>
                Back to portal selection
              </button>

              <PortalPanelHeader
                eyebrow={isAdmin ? "Admin Portal" : "Student Portal"}
                title="Sign in"
                subtitle={`Enter your ${isAdmin ? "admin" : "student"} credentials to continue.`}
              />

              <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-lg border border-nlsc-border bg-nlsc-surface shadow-[0_1px_2px_rgba(17,24,39,0.04),0_8px_24px_rgba(17,24,39,0.05)]"
              >
                <div className="border-b border-nlsc-border px-6 py-4 sm:px-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-nlsc-gold-text">
                    Secure access
                  </p>
                </div>

                <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-7">
                  <div>
                    <label
                      htmlFor="userId"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-nlsc-gold-text"
                    >
                      {isAdmin ? "Admin ID" : "Student ID"}
                    </label>
                    <input
                      id="userId"
                      name="userId"
                      type="text"
                      autoComplete="username"
                      required
                      value={userId}
                      onChange={(event) => setUserId(event.target.value)}
                      className={inputClassName}
                      placeholder={
                        isAdmin ? "Enter your admin ID" : "Enter your student ID"
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-nlsc-gold-text"
                    >
                      Password
                    </label>
                    <PasswordInput
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      inputClassName={inputClassName}
                      placeholder="Enter your password"
                    />
                  </div>

                  {error ? (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-nlsc-gold px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-nlsc-black transition-all duration-300 hover:bg-nlsc-black hover:text-nlsc-gold disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-white dark:hover:text-nlsc-black"
                  >
                    {loading ? "Signing in..." : "Sign in to LMS"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
