"use client";

import { BellIcon, SettingsIcon } from "@/components/portal/lms/icons";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import { getInitials } from "@/lib/portal/student-data";
import { useState } from "react";

type PortalSettingsViewProps = {
  userName: string;
  userId: string;
  roleLabel: "Administrator" | "Student";
};

const inputClass =
  "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-nlsc-gold/50";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-nlsc-gold-text";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-2">
      <span className="text-sm" style={{ color: lmsTokens.ink }}>
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
        style={{
          backgroundColor: checked ? lmsTokens.gold500 : "#d4d4d4",
        }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{ left: checked ? "1.375rem" : "0.125rem" }}
        />
      </button>
    </label>
  );
}

export default function PortalSettingsView({
  userName,
  userId,
  roleLabel,
}: PortalSettingsViewProps) {
  const isAdmin = roleLabel === "Administrator";
  const [email, setEmail] = useState(
    isAdmin ? "admin@nlsc.lk" : `${userId.toLowerCase()}@student.nlsc.lk`,
  );
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(isAdmin);
  const [requireApproval, setRequireApproval] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <div
          className="border-l-2 pl-4 sm:pl-5"
          style={{ borderColor: lmsTokens.gold500 }}
        >
          <p
            className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] sm:text-[11px]"
            style={{ color: lmsTokens.gold500 }}
          >
            {isAdmin ? "Admin Portal" : "Student Portal"}
          </p>
          <h1
            className="text-xl font-semibold tracking-tight sm:text-2xl lg:text-[1.75rem]"
            style={{ color: lmsTokens.ink }}
          >
            Settings
          </h1>
          <p className="mt-1 text-xs sm:mt-1.5 sm:text-sm" style={{ color: lmsTokens.slate }}>
            Manage your profile, notifications, and account preferences.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
        <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
          <h2
            className="mb-4 flex items-center gap-2 text-sm font-semibold sm:mb-5"
            style={{ color: lmsTokens.ink }}
          >
            <SettingsIcon size={15} color={lmsTokens.gold500} />
            Profile
          </h2>
          <div className="mb-5 flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border text-sm font-semibold text-white"
              style={{
                backgroundColor: lmsTokens.navy900,
                borderColor: "rgb(212 175 55 / 0.4)",
              }}
            >
              {getInitials(userName)}
            </div>
            <div>
              <p className="font-semibold" style={{ color: lmsTokens.ink }}>
                {userName}
              </p>
              <p className="text-xs" style={{ color: lmsTokens.gold500 }}>
                {roleLabel}
              </p>
              <p className="mt-0.5 font-mono text-[11px]" style={{ color: lmsTokens.slate }}>
                ID: {userId}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="settings-email" className={labelClass}>
                Email address
              </label>
              <input
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
              />
            </div>
            <div>
              <label htmlFor="settings-phone" className={labelClass}>
                Phone (optional)
              </label>
              <input
                id="settings-phone"
                type="tel"
                placeholder="+94 7X XXX XXXX"
                className={inputClass}
                style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
              />
            </div>
          </div>
        </section>

        <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
          <h2
            className="mb-4 flex items-center gap-2 text-sm font-semibold sm:mb-5"
            style={{ color: lmsTokens.ink }}
          >
            <BellIcon size={15} color={lmsTokens.gold500} />
            Notifications
          </h2>
          <div className="divide-y" style={{ borderColor: lmsTokens.line }}>
            <Toggle
              label="Email notifications"
              checked={emailAlerts}
              onChange={setEmailAlerts}
            />
            <Toggle
              label="Portal alerts"
              checked={pushAlerts}
              onChange={setPushAlerts}
            />
            <Toggle
              label={isAdmin ? "Weekly admin summary" : "Weekly progress digest"}
              checked={weeklyDigest}
              onChange={setWeeklyDigest}
            />
          </div>
        </section>

        <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
          <h2 className="mb-4 text-sm font-semibold sm:mb-5" style={{ color: lmsTokens.ink }}>
            Security
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="current-password" className={labelClass}>
                Current password
              </label>
              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                className={inputClass}
                style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
              />
            </div>
            <div>
              <label htmlFor="new-password" className={labelClass}>
                New password
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                className={inputClass}
                style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className={labelClass}>
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                className={inputClass}
                style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
              />
            </div>
          </div>
        </section>

        {isAdmin && (
          <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
            <h2 className="mb-4 text-sm font-semibold sm:mb-5" style={{ color: lmsTokens.ink }}>
              Portal preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="campus-name" className={labelClass}>
                  Campus display name
                </label>
                <input
                  id="campus-name"
                  type="text"
                  defaultValue="Next Level Solutions Campus"
                  className={inputClass}
                  style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
                />
              </div>
              <div>
                <label htmlFor="academic-year" className={labelClass}>
                  Academic year
                </label>
                <input
                  id="academic-year"
                  type="text"
                  defaultValue="2026"
                  className={inputClass}
                  style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
                />
              </div>
              <Toggle
                label="Require approval for new enrollments"
                checked={requireApproval}
                onChange={setRequireApproval}
              />
            </div>
          </section>
        )}

        <div className={`flex flex-wrap items-center gap-3 ${isAdmin ? "lg:col-span-2" : "lg:col-span-2"}`}>
          <button
            type="submit"
            className="rounded-lg border border-nlsc-gold bg-nlsc-gold px-6 py-2.5 text-xs font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text"
          >
            Save changes
          </button>
          {saved && (
            <span className="text-xs font-semibold" style={{ color: lmsTokens.good }}>
              Settings saved successfully.
            </span>
          )}
        </div>
      </form>
    </>
  );
}
