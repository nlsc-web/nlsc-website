"use client";

import { MailIcon } from "@/components/portal/lms/icons";
import StatCard from "@/components/portal/lms/StatCard";
import {
  getInitials,
  type AdminContactInquiry,
  type ContactInquiryStatus,
} from "@/lib/portal/admin-data";
import {
  deleteContactInquiry,
  patchContactInquiry,
  replyContactInquiry,
} from "@/lib/portal/admin-api";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import { useMemo, useState } from "react";

type FilterKey = "all" | ContactInquiryStatus;

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Messages" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
];

const statusStyles: Record<
  ContactInquiryStatus,
  { bg: string; fg: string; label: string }
> = {
  unread: { bg: "#fbf0df", fg: lmsTokens.warn, label: "Unread" },
  read: { bg: "#e6f2ec", fg: lmsTokens.good, label: "Read" },
};

type AdminInquiriesViewProps = {
  inquiries: AdminContactInquiry[];
  onChanged?: () => Promise<void> | void;
};

export default function AdminInquiriesView({
  inquiries,
  onChanged,
}: AdminInquiriesViewProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const thisWeekCount = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return inquiries.filter(
      (item) => Date.parse(item.receivedAt) >= weekAgo,
    ).length;
  }, [inquiries]);

  const counts = useMemo(
    () => ({
      all: inquiries.length,
      unread: inquiries.filter((item) => item.status === "unread").length,
      read: inquiries.filter((item) => item.status === "read").length,
    }),
    [inquiries],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inquiries.filter((item) => {
      const matchesFilter = filter === "all" || item.status === filter;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, inquiries]);

  async function handleMarkStatus(
    id: string,
    status: ContactInquiryStatus,
  ) {
    setBusyId(id);
    try {
      await patchContactInquiry(id, status);
      await onChanged?.();
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this message permanently?")) return;
    setBusyId(id);
    try {
      await deleteContactInquiry(id);
      if (expandedId === id) setExpandedId(null);
      await onChanged?.();
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId(null);
    }
  }

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
            Message Management
          </h1>
          <p
            className="mt-1 text-xs sm:mt-1.5 sm:text-sm"
            style={{ color: lmsTokens.slate }}
          >
            View and manage contact form submissions from the website.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Total Messages" value={String(counts.all)} />
        <StatCard
          label="Unread"
          value={String(counts.unread)}
          sub="Needs reply"
          accent={lmsTokens.warn}
          subPill
        />
        <StatCard
          label="Read"
          value={String(counts.read)}
          sub="Reviewed"
          accent={lmsTokens.good}
          subPill
        />
        <StatCard
          label="This week"
          value={String(thisWeekCount)}
          sub="New inquiries"
          accent={lmsTokens.gold500}
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
            placeholder="Search by name, email, or subject..."
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-nlsc-gold/50 sm:max-w-xs"
            style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
              style={{
                backgroundColor:
                  filter === key ? lmsTokens.gold500 : "transparent",
                color: filter === key ? lmsTokens.navy900 : lmsTokens.slate,
                border: `1px solid ${filter === key ? lmsTokens.gold500 : lmsTokens.line}`,
              }}
            >
              {label} ({counts[key]})
            </button>
          ))}
        </div>

        <div className="-mx-1 overflow-x-auto px-1">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr
                className="border-b text-left"
                style={{ borderColor: lmsTokens.line, color: lmsTokens.slate }}
              >
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Sender
                </th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Subject
                </th>
                <th className="hidden pb-3 text-[10px] font-bold uppercase tracking-[0.1em] md:table-cell sm:text-[11px]">
                  Preview
                </th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
                  Status
                </th>
                <th className="hidden pb-3 text-[10px] font-bold uppercase tracking-[0.1em] sm:table-cell sm:text-[11px]">
                  Received
                </th>
                <th className="pb-3 w-28" />
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: lmsTokens.line }}>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-sm"
                    style={{ color: lmsTokens.slate }}
                  >
                    {inquiries.length === 0
                      ? "No contact messages yet."
                      : "No messages match your search."}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <InquiryRow
                    key={item.id}
                    item={item}
                    expanded={expandedId === item.id}
                    busy={busyId === item.id}
                    onToggle={() =>
                      setExpandedId((current) =>
                        current === item.id ? null : item.id,
                      )
                    }
                    onMarkStatus={handleMarkStatus}
                    onDelete={handleDelete}
                    onReply={async (id, message) => {
                      setBusyId(id);
                      try {
                        await replyContactInquiry(id, message);
                        await onChanged?.();
                      } finally {
                        setBusyId(null);
                      }
                    }}
                  />
                ))
              )}
            </tbody>
          </table>
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

function InquiryStatusBadge({ status }: { status: ContactInquiryStatus }) {
  const config = statusStyles[status];
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: config.bg, color: config.fg }}
    >
      {config.label}
    </span>
  );
}

function InquiryRow({
  item,
  expanded,
  busy,
  onToggle,
  onMarkStatus,
  onDelete,
  onReply,
}: {
  item: AdminContactInquiry;
  expanded: boolean;
  busy: boolean;
  onToggle: () => void;
  onMarkStatus: (id: string, status: ContactInquiryStatus) => void;
  onDelete: (id: string) => void;
  onReply: (id: string, message: string) => Promise<void>;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState("");
  const [replySuccess, setReplySuccess] = useState(false);

  async function handleSendReply() {
    setReplyError("");
    setReplySuccess(false);

    const message = replyText.trim();
    if (!message) {
      setReplyError("Please enter a reply message.");
      return;
    }

    try {
      await onReply(item.id, message);
      setReplyText("");
      setShowReply(false);
      setReplySuccess(true);
    } catch (error) {
      setReplyError(
        error instanceof Error ? error.message : "Unable to send reply.",
      );
    }
  }

  return (
    <>
      <tr className="transition-colors hover:bg-neutral-50/80">
        <td className="py-3 pr-2 sm:py-3.5">
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center gap-2.5 text-left"
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold text-white"
              style={{
                backgroundColor: lmsTokens.navy900,
                borderColor: "rgb(212 175 55 / 0.35)",
              }}
            >
              {getInitials(item.name)}
            </div>
            <div className="min-w-0">
              <div
                className="truncate text-xs font-medium sm:text-sm"
                style={{ color: lmsTokens.ink }}
              >
                {item.name}
              </div>
              <div
                className="truncate text-[11px]"
                style={{ color: lmsTokens.slate }}
              >
                {item.email}
              </div>
            </div>
          </button>
        </td>
        <td className="py-3 sm:py-3.5">
          <span
            className="rounded px-2 py-0.5 text-[11px] font-semibold"
            style={{
              backgroundColor: lmsTokens.gold100,
              color: lmsTokens.navy800,
            }}
          >
            {item.subject}
          </span>
        </td>
        <td
          className="hidden max-w-[220px] truncate py-3.5 md:table-cell"
          style={{ color: lmsTokens.slate }}
        >
          {item.message}
        </td>
        <td className="py-3 sm:py-3.5">
          <InquiryStatusBadge status={item.status} />
        </td>
        <td
          className="hidden py-3.5 text-xs sm:table-cell"
          style={{ color: lmsTokens.slate }}
        >
          {item.createdAt}
        </td>
        <td className="py-3 text-right sm:py-3.5">
          <button
            type="button"
            onClick={onToggle}
            className="text-[11px] font-semibold"
            style={{ color: lmsTokens.gold500 }}
          >
            {expanded ? "Hide" : "View"}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} className="bg-nlsc-gold/5 px-4 py-4">
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

            {replySuccess && (
              <p className="mt-3 rounded-md border border-nlsc-gold/30 bg-nlsc-gold/10 px-3 py-2 text-xs font-medium text-nlsc-text">
                Reply sent to {item.email}. Message marked as read.
              </p>
            )}

            {showReply && (
              <div className="mt-4 space-y-3">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: lmsTokens.gold600 }}
                >
                  Reply to {item.name}
                </p>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder="Type your reply here..."
                  className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-nlsc-gold/50"
                  style={{ borderColor: lmsTokens.line, color: lmsTokens.ink }}
                />
                {replyError && (
                  <p className="text-xs text-red-600">{replyError}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleSendReply}
                    className="inline-flex rounded-md border border-nlsc-gold bg-nlsc-gold px-3.5 py-1.5 text-xs font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text disabled:opacity-60"
                  >
                    {busy ? "Sending..." : "Send reply"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setShowReply(false);
                      setReplyError("");
                    }}
                    className="rounded-md border border-nlsc-gold/35 bg-white px-3.5 py-1.5 text-xs font-semibold transition-colors hover:border-nlsc-gold/55 hover:bg-nlsc-gold/5 disabled:opacity-60"
                    style={{ color: lmsTokens.ink }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {!showReply && (
                <button
                  type="button"
                  onClick={() => {
                    setShowReply(true);
                    setReplySuccess(false);
                    setReplyError("");
                  }}
                  className="inline-flex rounded-md border border-nlsc-gold bg-nlsc-gold px-3.5 py-1.5 text-xs font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text"
                >
                  Reply by email
                </button>
              )}
              {item.status === "unread" ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onMarkStatus(item.id, "read")}
                  className="rounded-md border border-nlsc-gold/35 bg-white px-3.5 py-1.5 text-xs font-semibold transition-colors hover:border-nlsc-gold/55 hover:bg-nlsc-gold/5 disabled:opacity-60"
                  style={{ color: lmsTokens.ink }}
                >
                  {busy ? "..." : "Mark as read"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onMarkStatus(item.id, "unread")}
                  className="rounded-md border border-nlsc-gold/35 bg-white px-3.5 py-1.5 text-xs font-semibold transition-colors hover:border-nlsc-gold/55 hover:bg-nlsc-gold/5 disabled:opacity-60"
                  style={{ color: lmsTokens.ink }}
                >
                  {busy ? "..." : "Mark as unread"}
                </button>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => onDelete(item.id)}
                className="rounded-md border border-red-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
              >
                {busy ? "..." : "Delete"}
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
