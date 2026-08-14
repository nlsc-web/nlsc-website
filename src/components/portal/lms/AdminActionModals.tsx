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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div
        className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl border bg-white shadow-xl sm:max-h-[90dvh] sm:max-w-md sm:rounded-xl"
        style={{ borderColor: lmsTokens.line }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b px-4 py-4 sm:px-5" style={{ borderColor: lmsTokens.line }}>
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
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
            {children}
            {error && (
              <p className="text-sm" style={{ color: lmsTokens.bad }}>
                {error}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t px-4 py-4 sm:flex-row sm:justify-end sm:px-5" style={{ borderColor: lmsTokens.line }}>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2.5 text-sm font-semibold sm:py-2"
              style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg border border-nlsc-gold bg-nlsc-gold px-4 py-2.5 text-sm font-semibold text-nlsc-black disabled:opacity-60 sm:py-2"
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

type EnrollStudentModalProps = {
  student: { id: string; name: string };
  courses: Array<{ id: string; code: string; title: string }>;
  onClose: () => void;
  onEnrolled: () => Promise<void> | void;
};

export function EnrollStudentModal({
  student,
  courses,
  onClose,
  onEnrolled,
}: EnrollStudentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const courseId = String(form.get("courseId") ?? "").trim();

    if (!courseId) {
      setError("Select a course to enroll.");
      setLoading(false);
      return;
    }

    try {
      const { postAdminEnrollment } = await import("@/lib/portal/admin-api");
      await postAdminEnrollment({
        studentId: student.id,
        courseId,
      });
      await onEnrolled();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to enroll student.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminActionModal
      title="Enroll in Course"
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      <div
        className="rounded-lg border px-3 py-2 text-sm"
        style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
      >
        <p className="text-xs font-semibold" style={{ color: lmsTokens.slate }}>
          Student
        </p>
        <p className="mt-0.5 font-medium">{student.name}</p>
        <p className="text-xs" style={{ color: lmsTokens.slate }}>
          {student.id}
        </p>
      </div>
      <Field
        label="Course"
        name="courseId"
        as="select"
        required
        options={[
          { value: "", label: "Select a course" },
          ...courses.map((c) => ({
            value: c.id,
            label: `${c.code} — ${c.title}`,
          })),
        ]}
      />
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

type ManageModulesModalProps = {
  course: { id: string; title: string };
  onClose: () => void;
  onChanged: () => Promise<void> | void;
};

export function ManageModulesModal({
  course,
  onClose,
  onChanged,
}: ManageModulesModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyModuleId, setBusyModuleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<
    Array<{
      id: string;
      title: string;
      duration: string;
      type: "video" | "document" | "quiz";
      videoUrl: string | null;
    }>
  >([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { fetchAdminCourseModules } = await import(
          "@/lib/portal/admin-api"
        );
        const rows = await fetchAdminCourseModules(course.id);
        if (!cancelled) {
          setModules(
            rows.map((row) => ({
              ...row,
              videoUrl: row.videoUrl ?? null,
            })),
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load modules.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [course.id]);

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const { postAdminCourseModule } = await import("@/lib/portal/admin-api");
      const result = await postAdminCourseModule(course.id, {
        title: String(data.get("title") ?? "").trim(),
        duration: String(data.get("duration") ?? "").trim(),
        type: String(data.get("type") ?? "video") as
          | "video"
          | "document"
          | "quiz",
      });
      setModules((current) => [
        ...current,
        {
          ...result.module,
          videoUrl: result.module.videoUrl ?? null,
        },
      ]);
      form.reset();
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add module.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(moduleId: string) {
    if (!window.confirm("Delete this module?")) return;
    setError(null);
    try {
      const { deleteAdminCourseModule } = await import("@/lib/portal/admin-api");
      await deleteAdminCourseModule(course.id, moduleId);
      setModules((current) => current.filter((item) => item.id !== moduleId));
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete module.");
    }
  }

  async function handleSaveVideoUrl(moduleId: string, videoUrl: string) {
    setBusyModuleId(moduleId);
    setError(null);
    try {
      const { patchAdminCourseModuleVideoUrl } = await import(
        "@/lib/portal/admin-api"
      );
      const result = await patchAdminCourseModuleVideoUrl(
        course.id,
        moduleId,
        videoUrl.trim() || null,
      );
      setModules((current) =>
        current.map((item) =>
          item.id === moduleId
            ? { ...item, videoUrl: result.module.videoUrl ?? null }
            : item,
        ),
      );
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save video URL.");
    } finally {
      setBusyModuleId(null);
    }
  }

  async function handleUploadVideo(moduleId: string, file: File | null) {
    if (!file) return;
    setBusyModuleId(moduleId);
    setError(null);
    try {
      const { uploadAdminCourseModuleVideo } = await import(
        "@/lib/portal/admin-api"
      );
      const result = await uploadAdminCourseModuleVideo(
        course.id,
        moduleId,
        file,
      );
      setModules((current) =>
        current.map((item) =>
          item.id === moduleId
            ? { ...item, videoUrl: result.module.videoUrl ?? null }
            : item,
        ),
      );
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload video.");
    } finally {
      setBusyModuleId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border bg-white p-5 shadow-xl"
        style={{ borderColor: lmsTokens.line }}
        role="dialog"
        aria-modal="true"
        aria-label="Manage modules"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: lmsTokens.ink }}>
              Manage modules
            </h2>
            <p className="mt-0.5 text-xs" style={{ color: lmsTokens.slate }}>
              {course.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm transition-colors hover:bg-neutral-100"
            style={{ color: lmsTokens.slate }}
          >
            Close
          </button>
        </div>

        {error && (
          <p className="mb-3 text-xs font-semibold" style={{ color: lmsTokens.bad }}>
            {error}
          </p>
        )}

        <div className="mb-4 max-h-72 space-y-3 overflow-y-auto">
          {loading ? (
            <p className="text-xs" style={{ color: lmsTokens.slate }}>
              Loading modules...
            </p>
          ) : modules.length === 0 ? (
            <p className="text-xs" style={{ color: lmsTokens.slate }}>
              No modules yet. Add the first module below.
            </p>
          ) : (
            modules.map((module, index) => (
              <div
                key={module.id}
                className="space-y-2 rounded-lg border px-3 py-2"
                style={{ borderColor: lmsTokens.line }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: lmsTokens.slate }}
                    >
                      Module {index + 1} · {module.type}
                      {module.videoUrl ? " · Video ready" : ""}
                    </p>
                    <p
                      className="truncate text-sm font-medium"
                      style={{ color: lmsTokens.ink }}
                    >
                      {module.title}
                    </p>
                    <p className="text-xs" style={{ color: lmsTokens.slate }}>
                      {module.duration}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(module.id)}
                    className="shrink-0 text-xs font-semibold text-red-700 hover:underline"
                  >
                    Delete
                  </button>
                </div>

                {module.type === "video" && (
                  <div className="space-y-2 border-t pt-2" style={{ borderColor: lmsTokens.line }}>
                    <label className="block text-[11px] font-semibold" style={{ color: lmsTokens.slate }}>
                      Video URL (YouTube / MP4 link)
                      <input
                        type="url"
                        defaultValue={module.videoUrl?.startsWith("/uploads/") ? "" : module.videoUrl ?? ""}
                        placeholder="https://..."
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-nlsc-gold/50"
                        style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
                        onBlur={(event) => {
                          const next = event.target.value.trim();
                          const current =
                            module.videoUrl?.startsWith("/uploads/")
                              ? ""
                              : module.videoUrl ?? "";
                          if (next !== current) {
                            void handleSaveVideoUrl(module.id, next);
                          }
                        }}
                      />
                    </label>
                    <label className="block text-[11px] font-semibold" style={{ color: lmsTokens.slate }}>
                      Or upload recording (MP4 / WebM, max 80MB)
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                        disabled={busyModuleId === module.id}
                        className="mt-1 block w-full text-xs"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          void handleUploadVideo(module.id, file);
                          event.target.value = "";
                        }}
                      />
                    </label>
                    {module.videoUrl && (
                      <p className="truncate text-[11px]" style={{ color: lmsTokens.good }}>
                        Saved: {module.videoUrl}
                      </p>
                    )}
                    {busyModuleId === module.id && (
                      <p className="text-[11px]" style={{ color: lmsTokens.slate }}>
                        Saving video...
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAdd} className="space-y-3 border-t pt-4" style={{ borderColor: lmsTokens.line }}>
          <p className="text-xs font-semibold" style={{ color: lmsTokens.ink }}>
            Add module
          </p>
          <Field label="Title" name="title" placeholder="Module title" />
          <Field label="Duration" name="duration" placeholder="45 min" />
          <Field
            label="Type"
            name="type"
            as="select"
            defaultValue="video"
            options={[
              { value: "video", label: "Video lesson" },
              { value: "document", label: "Document" },
              { value: "quiz", label: "Assessment" },
            ]}
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-xs font-semibold"
              style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
            >
              Done
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-nlsc-gold px-4 py-2 text-xs font-semibold text-nlsc-black disabled:opacity-60"
            >
              {saving ? "Adding..." : "Add module"}
            </button>
          </div>
        </form>
      </div>
    </div>
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
