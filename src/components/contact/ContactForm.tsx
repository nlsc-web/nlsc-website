"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

const inputClassName =
  "w-full rounded-lg border border-nlsc-border bg-nlsc-surface px-4 py-3 text-sm text-nlsc-text outline-none transition-colors focus:border-nlsc-gold focus:ring-1 focus:ring-nlsc-gold/30";

const CONTACT_EMAIL = "nextlevelsolutionscampus@gmail.com";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? "General inquiry"),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to send message.");
      }

      setStatus("success");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
      );
    }
  }

  return (
    <>
      <form
        className="space-y-5"
        suppressHydrationWarning
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-semibold text-nlsc-text"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClassName}
            suppressHydrationWarning
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-semibold text-nlsc-text"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClassName}
            suppressHydrationWarning
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="mb-1.5 block text-sm font-semibold text-nlsc-text"
          >
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            className={inputClassName}
            suppressHydrationWarning
          >
            <option>General inquiry</option>
            <option>Admissions</option>
            <option>Course information</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="message"
            className="mb-1.5 block text-sm font-semibold text-nlsc-text"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className={`${inputClassName} resize-none`}
            suppressHydrationWarning
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-md bg-nlsc-gold px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-nlsc-black transition-all duration-300 hover:bg-nlsc-black hover:text-nlsc-gold disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-white dark:hover:text-nlsc-black"
        >
          {status === "loading" ? "Sending..." : "Send message"}
        </button>
      </form>

      {status === "success" && (
        <p className="mt-4 rounded-lg border border-nlsc-gold/30 bg-nlsc-gold/10 px-4 py-3 text-center text-sm text-nlsc-text">
          Thank you! Your message has been sent to{" "}
          <span className="font-semibold text-nlsc-gold-text">{CONTACT_EMAIL}</span>.
        </p>
      )}

      {status === "error" && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
          {errorMessage}
        </p>
      )}

      <p className="mt-5 text-center text-xs text-nlsc-muted">
        or email us directly at{" "}
        <Link
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-semibold text-nlsc-gold-text hover:underline"
        >
          {CONTACT_EMAIL}
        </Link>
      </p>
    </>
  );
}
