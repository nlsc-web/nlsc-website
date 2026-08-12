"use client";

import { BellIcon, SettingsIcon } from "@/components/portal/lms/icons";
import PasswordInput from "@/components/portal/PasswordInput";
import {
  fetchPortalSettings,
  patchPortalSettings,
  type PortalSettingsResponse,
} from "@/lib/portal/admin-api";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import { getInitials } from "@/lib/portal/student-data";
import { useEffect, useState } from "react";

type PortalSettingsViewProps = {
  userName: string;
  userId: string;
  roleLabel: "Administrator" | "Student";
  onSaved?: () => Promise<void> | void;
};

const inputClass =
  "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-nlsc-gold/50";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-nlsc-gold-text";

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
  onSaved,
}: PortalSettingsViewProps) {
  const isAdmin = roleLabel === "Administrator";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [portalAlerts, setPortalAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(isAdmin);
  const [campusName, setCampusName] = useState("Next Level Solutions Campus");
  const [academicYear, setAcademicYear] = useState("2026");
  const [requireApproval, setRequireApproval] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function applySettings(settings: PortalSettingsResponse) {
    setEmail(settings.profile.email);
    setPhone(settings.profile.phone);
    setEmailAlerts(settings.notifications.emailAlerts);
    setPortalAlerts(settings.notifications.portalAlerts);
    setWeeklyDigest(settings.notifications.weeklyDigest);
    if (settings.campus) {
      setCampusName(settings.campus.campusDisplayName);
      setAcademicYear(settings.campus.academicYear);
      setRequireApproval(settings.campus.requireEnrollmentApproval);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const settings = await fetchPortalSettings();
        if (!cancelled) applySettings(settings);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load settings.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const result = await patchPortalSettings({
        email: email.trim(),
        phone,
        notifications: {
          emailAlerts,
          portalAlerts,
          weeklyDigest,
        },
        campus: isAdmin
          ? {
              campusDisplayName: campusName.trim(),
              academicYear: academicYear.trim(),
              requireEnrollmentApproval: requireApproval,
            }
          : undefined,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
        confirmPassword: confirmPassword || undefined,
      });

      applySettings(result.settings);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaved(true);
      await onSaved?.();
      window.setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
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
          <p
            className="mt-1 text-xs sm:mt-1.5 sm:text-sm"
            style={{ color: lmsTokens.slate }}
          >
            Manage your profile, notifications, and account preferences.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: lmsTokens.slate }}>
          Loading settings...
        </p>
      ) : (
        <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
          <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
            <h2
              className="mb-4 flex items-center gap-2 text-sm font-semibold sm:mb-5"
              style={{ color: lmsTokens.ink }}
            >
              <SettingsIcon size={15} color={lmsTokens.gold500} />
              Profile
            </h2>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
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
                <p
                  className="mt-0.5 font-mono text-[11px]"
                  style={{ color: lmsTokens.slate }}
                >
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="settings-phone" className={labelClass}>
                  Phone (optional)
                </label>
                <input
                  id="settings-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 7X XXX XXXX"
                  className={inputClass}
                  style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
                  autoComplete="tel"
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
                checked={portalAlerts}
                onChange={setPortalAlerts}
              />
              <Toggle
                label={
                  isAdmin ? "Weekly admin summary" : "Weekly progress digest"
                }
                checked={weeklyDigest}
                onChange={setWeeklyDigest}
              />
            </div>
          </section>

          <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
            <h2
              className="mb-4 text-sm font-semibold sm:mb-5"
              style={{ color: lmsTokens.ink }}
            >
              Security
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="current-password" className={labelClass}>
                  Current password
                </label>
                <PasswordInput
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  inputClassName={inputClass}
                  inputStyle={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
                />
              </div>
              <div>
                <label htmlFor="new-password" className={labelClass}>
                  New password
                </label>
                <PasswordInput
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  inputClassName={inputClass}
                  inputStyle={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className={labelClass}>
                  Confirm new password
                </label>
                <PasswordInput
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  inputClassName={inputClass}
                  inputStyle={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
                />
              </div>
              <p className="text-xs" style={{ color: lmsTokens.slate }}>
                Leave password fields empty if you do not want to change it.
              </p>
            </div>
          </section>

          {isAdmin && (
            <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
              <h2
                className="mb-4 text-sm font-semibold sm:mb-5"
                style={{ color: lmsTokens.ink }}
              >
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
                    value={campusName}
                    onChange={(e) => setCampusName(e.target.value)}
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
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
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

          <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg border border-nlsc-gold bg-nlsc-gold px-6 py-2.5 text-xs font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {saved && (
              <span
                className="text-xs font-semibold"
                style={{ color: lmsTokens.good }}
              >
                Settings saved successfully.
              </span>
            )}
            {error && (
              <span
                className="text-xs font-semibold"
                style={{ color: lmsTokens.bad }}
              >
                {error}
              </span>
            )}
          </div>
        </form>
      )}
    </>
  );
}
