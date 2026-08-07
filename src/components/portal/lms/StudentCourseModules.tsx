"use client";

import type { PortalModule } from "@/lib/portal/types/student-portal";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const moduleTypeLabels = {
  video: "Video lesson",
  document: "Document",
  quiz: "Assessment",
};

type StudentCourseModulesProps = {
  modules: PortalModule[];
  initialProgress: number;
};

export default function StudentCourseModules({
  modules: initialModules,
  initialProgress,
}: StudentCourseModulesProps) {
  const router = useRouter();
  const [modules, setModules] = useState(initialModules);
  const [progress, setProgress] = useState(initialProgress);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setModules(initialModules);
    setProgress(initialProgress);
  }, [initialModules, initialProgress]);

  async function handleComplete(moduleId: string) {
    setBusyId(moduleId);
    setError(null);
    try {
      const response = await fetch(
        `/api/portal/student/modules/${moduleId}/complete`,
        { method: "POST" },
      );
      const data = (await response.json()) as {
        error?: string;
        progressPercent?: number;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to complete module.");
      }

      setModules((current) =>
        current.map((item) =>
          item.id === moduleId ? { ...item, completed: true } : item,
        ),
      );
      if (typeof data.progressPercent === "number") {
        setProgress(data.progressPercent);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete module.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div
        className="mb-6 rounded-lg border bg-white p-5"
        style={{ borderColor: lmsTokens.line }}
      >
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold" style={{ color: lmsTokens.ink }}>
            Course progress
          </span>
          <span className="font-bold" style={{ color: lmsTokens.gold500 }}>
            {progress}%
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full"
          style={{ backgroundColor: lmsTokens.gold100 }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: lmsTokens.gold500,
            }}
          />
        </div>
      </div>

      {error && (
        <p className="mb-3 text-xs font-semibold" style={{ color: lmsTokens.bad }}>
          {error}
        </p>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-bold" style={{ color: lmsTokens.ink }}>
          Course modules
        </h2>
        {modules.map((module, index) => (
          <article
            key={module.id}
            className="flex flex-col gap-3 rounded-xl border bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5"
            style={{ borderColor: lmsTokens.line }}
          >
            <div className="min-w-0 flex-1">
              <p
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: lmsTokens.slate }}
              >
                Module {index + 1} · {moduleTypeLabels[module.type]}
                {module.completed ? " · Completed" : ""}
              </p>
              <h3
                className="mt-1 font-semibold"
                style={{ color: lmsTokens.ink }}
              >
                {module.title}
              </h3>
              <p className="mt-1 text-xs" style={{ color: lmsTokens.slate }}>
                {module.duration}
              </p>
            </div>
            {module.completed ? (
              <span
                className="w-full shrink-0 rounded-md border px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider sm:w-auto sm:py-2"
                style={{
                  borderColor: lmsTokens.good,
                  color: lmsTokens.good,
                }}
              >
                Done
              </span>
            ) : (
              <button
                type="button"
                disabled={busyId === module.id}
                onClick={() => handleComplete(module.id)}
                className="w-full shrink-0 rounded-md border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition hover:text-white disabled:opacity-60 sm:w-auto sm:py-2"
                style={{
                  borderColor: lmsTokens.gold500,
                  color: lmsTokens.gold500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = lmsTokens.gold500;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {busyId === module.id ? "..." : "Mark complete"}
              </button>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
