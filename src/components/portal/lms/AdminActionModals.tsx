"use client";

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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  as?: "input" | "select" | "textarea";
  options?: Array<{ value: string; label: string }>;
}) {
  const className =
    "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-nlsc-gold/50";
  const style = { borderColor: lmsTokens.line, color: lmsTokens.ink };

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold" style={{ color: lmsTokens.slate }}>
        {label}
      </span>
      {as === "select" ? (
        <select name={name} required={required} className={className} style={style} defaultValue={defaultValue}>
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
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={className}
          style={style}
          defaultValue={defaultValue}
        />
      )}
    </label>
  );
}

type AddUserModalProps = {
  courses: Array<{ id: string; code: string; title: string }>;
  onClose: () => void;
  onCreated: () => Promise<void>;
};

export function AddUserModal({ courses, onClose, onCreated }: AddUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const role = String(form.get("role") ?? "student") as "student" | "instructor";

    try {
      const { postAdminUser } = await import("@/lib/portal/admin-api");
      await postAdminUser({
        id: String(form.get("id") ?? ""),
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
        role,
        courseId: role === "student" ? String(form.get("courseId") ?? "") : undefined,
        department: role === "instructor" ? String(form.get("department") ?? "") : undefined,
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
      title="Add User"
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      <Field label="User ID" name="id" placeholder="STU-1050" />
      <Field label="Full Name" name="name" placeholder="Student name" />
      <Field label="Email" name="email" type="email" placeholder="user@student.nlsc.lk" />
      <Field label="Password" name="password" type="password" placeholder="Temporary password" />
      <Field
        label="Role"
        name="role"
        as="select"
        defaultValue="student"
        options={[
          { value: "student", label: "Student" },
          { value: "instructor", label: "Instructor" },
        ]}
      />
      <Field
        label="Enroll in Course (students)"
        name="courseId"
        as="select"
        required={false}
        options={[
          { value: "", label: "None" },
          ...courses.map((c) => ({ value: c.id, label: `${c.code} — ${c.title}` })),
        ]}
      />
      <Field
        label="Department (instructors)"
        name="department"
        required={false}
        placeholder="Accounting Faculty"
      />
    </AdminActionModal>
  );
}

type NewCourseModalProps = {
  instructors: Array<{ id: string; name: string }>;
  onClose: () => void;
  onCreated: () => Promise<void>;
};

export function NewCourseModal({
  instructors,
  onClose,
  onCreated,
}: NewCourseModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const instructorId = String(form.get("instructorId") ?? "");

    try {
      const { postAdminCourse } = await import("@/lib/portal/admin-api");
      await postAdminCourse({
        id: String(form.get("id") ?? ""),
        code: String(form.get("code") ?? ""),
        title: String(form.get("title") ?? ""),
        duration: String(form.get("duration") ?? ""),
        description: String(form.get("description") ?? ""),
        instructorId: instructorId || undefined,
        status: String(form.get("status") ?? "draft") as "draft" | "active" | "pending",
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
      <Field label="Course ID" name="id" placeholder="new-course-id" />
      <Field label="Course Code" name="code" placeholder="ACC 101" />
      <Field label="Title" name="title" placeholder="Course title" />
      <Field label="Duration" name="duration" placeholder="4 Days" />
      <Field label="Description" name="description" as="textarea" required={false} />
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
        defaultValue="draft"
        options={[
          { value: "draft", label: "Draft" },
          { value: "active", label: "Active" },
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
