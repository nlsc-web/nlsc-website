"use client";

import PasswordInput from "@/components/portal/PasswordInput";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import { useEffect, useState } from "react";

type AdminActionModalProps = {
  title: string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
};

export function AdminActionModal({
  title,
  onClose,
  onSubmit,
  loading,
  error,
  children,
}: AdminActionModalProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-md rounded-xl border bg-white p-5 shadow-xl"
        style={{ borderColor: lmsTokens.line }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: lmsTokens.ink }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm transition-colors hover:bg-neutral-100"
            style={{ color: lmsTokens.slate }}
          >
            Close
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          {children}
          {error && (
            <p className="text-sm" style={{ color: lmsTokens.bad }}>
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-semibold"
              style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg border border-nlsc-gold bg-nlsc-gold px-4 py-2 text-sm font-semibold text-nlsc-black disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = true,
  placeholder,
  defaultValue,
  as = "input",
  options,
  autoComplete,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  as?: "input" | "select" | "textarea";
  options?: Array<{ value: string; label: string }>;
  autoComplete?: string;
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) {
  const className =
    "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-nlsc-gold/50 read-only:bg-neutral-50";
  const style = { borderColor: lmsTokens.line, color: lmsTokens.ink };

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold" style={{ color: lmsTokens.slate }}>
        {label}
      </span>
      {as === "select" ? (
        <select
          name={name}
          required={required}
          className={className}
          style={style}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          rows={3}
          className={className}
          style={style}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
        />
      ) : type === "password" ? (
        <PasswordInput
          name={name}
          required={required}
          placeholder={placeholder}
          inputClassName={className}
          inputStyle={style}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          autoComplete={autoComplete ?? "off"}
          readOnly={readOnly}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={className}
          style={style}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          autoComplete={autoComplete ?? "off"}
          readOnly={readOnly}
        />
      )}
    </label>
  );
}

type AddUserModalProps = {
  courses: Array<{ id: string; code: string; title: string }>;
  onClose: () => void;
  onCreated: () => Promise<void>;
  defaultRole?: "student" | "instructor";
};

function suggestUserId(role: "student" | "instructor") {
  const suffix = Date.now().toString().slice(-4);
  return role === "instructor" ? `INS-${suffix}` : `STU-${suffix}`;
}

export function AddUserModal({
  courses,
  onClose,
  onCreated,
  defaultRole = "student",
}: AddUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<"student" | "instructor">(defaultRole);
  const [userId, setUserId] = useState(() => suggestUserId(defaultRole));

  function handleRoleChange(nextRole: string) {
    const normalized = nextRole === "instructor" ? "instructor" : "student";
    setRole(normalized);
    setUserId((current) => {
      const isSuggested =
        /^STU-\d+$/.test(current) || /^INS-\d+$/.test(current) || current === "";
      return isSuggested ? suggestUserId(normalized) : current;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);

    try {
      const { postAdminUser } = await import("@/lib/portal/admin-api");
      await postAdminUser({
        id: userId.trim(),
        name: String(form.get("name") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        password: String(form.get("password") ?? ""),
        role,
        courseId: role === "student" ? String(form.get("courseId") ?? "") : undefined,
        department:
          role === "instructor" ? String(form.get("department") ?? "") : undefined,
      });
      await onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminActionModal
      title={role === "instructor" ? "Add Instructor" : "Add Student"}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      <Field
        label="User ID"
        name="id"
        placeholder={role === "instructor" ? "INS-010" : "STU-1050"}
        value={userId}
        onChange={setUserId}
        autoComplete="off"
      />
      <Field
        label="Full Name"
        name="name"
        placeholder={role === "instructor" ? "Instructor name" : "Student name"}
        autoComplete="off"
      />
      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="user@student.nlsc.lk"
        autoComplete="off"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        placeholder="Temporary password"
        autoComplete="new-password"
      />
      <Field
        label="Role"
        name="role"
        as="select"
        value={role}
        onChange={handleRoleChange}
        options={[
          { value: "student", label: "Student" },
          { value: "instructor", label: "Instructor" },
        ]}
      />
      {role === "student" ? (
        <Field
          label="Enroll in Course"
          name="courseId"
          as="select"
          required={false}
          options={[
            { value: "", label: "None" },
            ...courses.map((c) => ({
              value: c.id,
              label: `${c.code} — ${c.title}`,
            })),
          ]}
        />
      ) : (
        <Field
          label="Department"
          name="department"
          required={false}
          placeholder="Accounting Faculty"
          autoComplete="off"
        />
      )}
    </AdminActionModal>
  );
}

type EditUserModalProps = {
  user: {
    id: string;
    name: string;
    email: string;
    department?: string;
    role: "student" | "instructor";
  };
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

export function EditUserModal({ user, onClose, onSaved }: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");

    try {
      const { patchAdminUser } = await import("@/lib/portal/admin-api");
      await patchAdminUser(user.id, {
        name: String(form.get("name") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        department:
          user.role === "instructor"
            ? String(form.get("department") ?? "")
            : undefined,
        password: password.trim() || undefined,
      });
      await onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminActionModal
      title={user.role === "instructor" ? "Edit Instructor" : "Edit Student"}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      <Field
        label="User ID"
        name="id"
        value={user.id}
        readOnly
        autoComplete="off"
      />
      <p className="-mt-2 text-[11px]" style={{ color: lmsTokens.slate }}>
        User ID cannot be changed.
      </p>
      <Field
        label="Full Name"
        name="name"
        defaultValue={user.name}
        placeholder={
          user.role === "instructor" ? "Instructor name" : "Student name"
        }
        autoComplete="off"
      />
      <Field
        label="Email"
        name="email"
        type="email"
        defaultValue={user.email}
        placeholder={
          user.role === "instructor" ? "name@nlsc.lk" : "user@student.nlsc.lk"
        }
        autoComplete="off"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        required={false}
        placeholder="Leave blank to keep current password"
        autoComplete="new-password"
      />
      {user.role === "instructor" && (
        <Field
          label="Department"
          name="department"
          required={false}
          defaultValue={user.department ?? ""}
          placeholder="Accounting Faculty"
          autoComplete="off"
        />
      )}
    </AdminActionModal>
  );
}

type NewCourseModalProps = {
  instructors: Array<{ id: string; name: string }>;
  onClose: () => void;
  onCreated: () => Promise<void>;
};

function suggestCourseId() {
  return `course-${Date.now().toString().slice(-6)}`;
}

export function NewCourseModal({
  instructors,
  onClose,
  onCreated,
}: NewCourseModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseId, setCourseId] = useState(() => suggestCourseId());

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const instructorId = String(form.get("instructorId") ?? "");

    try {
      const { postAdminCourse } = await import("@/lib/portal/admin-api");
      await postAdminCourse({
        id: courseId.trim(),
        code: String(form.get("code") ?? "").trim(),
        title: String(form.get("title") ?? "").trim(),
        duration: String(form.get("duration") ?? "").trim(),
        description: String(form.get("description") ?? "").trim(),
        instructorId: instructorId || undefined,
        status: String(form.get("status") ?? "draft") as
          | "draft"
          | "active"
          | "pending",
      });
      await onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create course.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminActionModal
      title="New Course"
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      <Field
        label="Course ID"
        name="id"
        placeholder="course-101"
        value={courseId}
        onChange={setCourseId}
        autoComplete="off"
      />
      <Field
        label="Course Code"
        name="code"
        placeholder="ACC 101"
        autoComplete="off"
      />
      <Field
        label="Title"
        name="title"
        placeholder="Course title"
        autoComplete="off"
      />
      <Field
        label="Duration"
        name="duration"
        placeholder="4 Days"
        autoComplete="off"
      />
      <Field
        label="Description"
        name="description"
        as="textarea"
        required={false}
      />
      <Field
        label="Instructor"
        name="instructorId"
        as="select"
        required={false}
        options={[
          { value: "", label: "Unassigned" },
          ...instructors.map((i) => ({ value: i.id, label: i.name })),
        ]}
      />
      <Field
        label="Status"
        name="status"
        as="select"
        defaultValue="active"
        options={[
          { value: "active", label: "Active" },
          { value: "draft", label: "Draft" },
          { value: "pending", label: "Pending" },
        ]}
      />
    </AdminActionModal>
  );
}

type PostAnnouncementModalProps = {
  onClose: () => void;
  onCreated: () => Promise<void>;
};

export function PostAnnouncementModal({
  onClose,
  onCreated,
}: PostAnnouncementModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);

    try {
      const { postAdminAnnouncement } = await import("@/lib/portal/admin-api");
      await postAdminAnnouncement({
        title: String(form.get("title") ?? ""),
        body: String(form.get("body") ?? ""),
        audience: String(form.get("audience") ?? "All") as
          | "All"
          | "Students"
          | "Instructors"
          | "Staff",
        status: String(form.get("status") ?? "published") as
          | "published"
          | "draft"
          | "scheduled",
      });
      await onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to post announcement.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminActionModal
      title="Post Announcement"
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      <Field label="Title" name="title" placeholder="Announcement title" />
      <Field label="Message" name="body" as="textarea" placeholder="Announcement body" />
      <Field
        label="Audience"
        name="audience"
        as="select"
        defaultValue="All"
        options={[
          { value: "All", label: "All" },
          { value: "Students", label: "Students" },
          { value: "Instructors", label: "Instructors" },
          { value: "Staff", label: "Staff" },
        ]}
      />
      <Field
        label="Status"
        name="status"
        as="select"
        defaultValue="published"
        options={[
          { value: "published", label: "Published" },
          { value: "draft", label: "Draft" },
          { value: "scheduled", label: "Scheduled" },
        ]}
      />
    </AdminActionModal>
  );
}

type GenerateReportModalProps = {
  onClose: () => void;
  onCreated: () => Promise<void>;
};

export function GenerateReportModal({
  onClose,
  onCreated,
}: GenerateReportModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);

    try {
      const { postAdminReport } = await import("@/lib/portal/admin-api");
      await postAdminReport({
        title: String(form.get("title") ?? "").trim(),
        category: String(form.get("category") ?? "enrollment") as
          | "enrollment"
          | "attendance"
          | "performance"
          | "financial",
        period: String(form.get("period") ?? "").trim(),
        format: String(form.get("format") ?? "CSV") as "PDF" | "CSV" | "XLSX",
      });
      await onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate report.");
    } finally {
      setLoading(false);
    }
  }

  const now = new Date();
  const defaultPeriod = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <AdminActionModal
      title="Generate Report"
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      <Field
        label="Report Title"
        name="title"
        placeholder="Monthly Enrollment Summary"
        autoComplete="off"
      />
      <Field
        label="Category"
        name="category"
        as="select"
        defaultValue="enrollment"
        options={[
          { value: "enrollment", label: "Enrollment" },
          { value: "attendance", label: "Attendance" },
          { value: "performance", label: "Performance" },
          { value: "financial", label: "Financial" },
        ]}
      />
      <Field
        label="Period"
        name="period"
        placeholder="August 2026"
        defaultValue={defaultPeriod}
        autoComplete="off"
      />
      <Field
        label="Format"
        name="format"
        as="select"
        defaultValue="CSV"
        options={[
          { value: "CSV", label: "CSV (downloadable)" },
          { value: "PDF", label: "PDF" },
          { value: "XLSX", label: "XLSX" },
        ]}
      />
      <p className="text-xs" style={{ color: lmsTokens.slate }}>
        Downloads are generated as CSV from live portal data.
      </p>
    </AdminActionModal>
  );
}
