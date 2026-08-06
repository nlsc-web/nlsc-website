"use client";

import { MailIcon } from "@/components/portal/lms/icons";
import StatCard from "@/components/portal/lms/StatCard";
import { type AdminContactInquiry } from "@/lib/portal/admin-data";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import { useMemo, useState } from "react";

type AdminInquiriesViewProps = {
  inquiries: AdminContactInquiry[];
};

export default function AdminInquiriesView({
  inquiries,
}: AdminInquiriesViewProps) {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const thisWeekCount = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return inquiries.filter(
      (item) => Date.parse(item.receivedAt) >= weekAgo,
    ).length;
  }, [inquiries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return inquiries;
    return inquiries.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q),
    );
  }, [query, inquiries]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div
          className="border-l-2 pl-4 sm:pl-5"
          style={{ borderColor: lmsTokens.gold500 }}
        >
          <p
            className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] sm:text-[11px]"
            style={{ color: lmsTokens.gold500 }}
          >
            Admin Portal
          </p>
          <h1
            className="text-xl font-semibold tracking-tight sm:text-2xl lg:text-[1.75rem]"
            style={{ color: lmsTokens.ink }}
          >
            Messages
          </h1>
          <p
            className="mt-1 text-xs sm:mt-1.5 sm:text-sm"
            style={{ color: lmsTokens.slate }}
          >
            Contact form submissions from the website.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 lg:max-w-xl">
        <StatCard label="Total" value={String(inquiries.length)} />
        <StatCard
          label="This week"
          value={String(thisWeekCount)}
          sub="New inquiries"
          accent={lmsTokens.gold500}
          subPill
        />
      </div>

      <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <h2
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: lmsTokens.ink }}
          >
            <MailIcon size={15} color={lmsTokens.gold500} />
            All Messages
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor: lmsTokens.gold100,
                color: lmsTokens.navy800,
              }}
            >
              {filtered.length}
            </span>
          </h2>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, subject..."
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-nlsc-gold/50 sm:max-w-xs"
            style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
          />
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          {filtered.length === 0 ? (
            <p
              className="py-10 text-center text-sm"
              style={{ color: lmsTokens.slate }}
            >
              {inquiries.length === 0
                ? "No contact messages yet."
                : "No messages match your search."}
            </p>
          ) : (
            filtered.map((item) => (
              <InquiryCard
                key={item.id}
                item={item}
                expanded={expandedId === item.id}
                onToggle={() =>
                  setExpandedId((current) =>
                    current === item.id ? null : item.id,
                  )
                }
              />
            ))
          )}
        </div>

        <div
          className="mt-4 flex items-center justify-between border-t pt-4 text-xs"
          style={{ borderColor: lmsTokens.line, color: lmsTokens.slate }}
        >
          <span>
            Showing {filtered.length} of {inquiries.length} messages
          </span>
        </div>
      </section>
    </>
  );
}

function InquiryCard({
  item,
  expanded,
  onToggle,
}: {
  item: AdminContactInquiry;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className="rounded-lg border p-4 transition-colors hover:border-nlsc-gold/35 sm:p-5"
      style={{ borderColor: lmsTokens.line }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-col gap-3 text-left sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: lmsTokens.gold100,
                color: lmsTokens.navy800,
              }}
            >
              {item.subject}
            </span>
            <span className="text-[11px]" style={{ color: lmsTokens.slate }}>
              {item.createdAt}
            </span>
          </div>
          <h3
            className="text-sm font-semibold sm:text-base"
            style={{ color: lmsTokens.ink }}
          >
            {item.name}
          </h3>
          <p
            className="mt-1 text-xs sm:text-sm"
            style={{ color: lmsTokens.slate }}
          >
            {item.email}
          </p>
          <p
            className={`mt-2 text-xs leading-relaxed sm:text-sm ${expanded ? "" : "line-clamp-2"}`}
            style={{ color: lmsTokens.slate }}
          >
            {item.message}
          </p>
        </div>
        <span
          className="shrink-0 self-start text-[11px] font-semibold"
          style={{ color: lmsTokens.gold500 }}
        >
          {expanded ? "Hide" : "View"}
        </span>
      </button>

      {expanded && (
        <div
          className="mt-4 border-t pt-4"
          style={{ borderColor: lmsTokens.line }}
        >
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: lmsTokens.gold600 }}
          >
            Full message
          </p>
          <p
            className="whitespace-pre-wrap text-sm leading-relaxed"
            style={{ color: lmsTokens.ink }}
          >
            {item.message}
          </p>
          <a
            href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject)}`}
            className="mt-4 inline-flex rounded-md border border-nlsc-gold bg-nlsc-gold px-3.5 py-1.5 text-xs font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text"
          >
            Reply by email
          </a>
        </div>
      )}
    </article>
  );
}
