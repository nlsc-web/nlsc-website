"use client";

import {
  ChevronRightIcon,
  MegaphoneIcon,
  MoreHorizontalIcon,
} from "@/components/portal/lms/icons";
import StatCard from "@/components/portal/lms/StatCard";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import {
  adminAnnouncements,
  type AdminAnnouncement,
  type AnnouncementStatus,
} from "@/lib/portal/admin-data";
import { useMemo, useState } from "react";

type FilterKey = "all" | AnnouncementStatus;

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "scheduled", label: "Scheduled" },
  { key: "draft", label: "Draft" },
];

const statusStyles: Record<
  AnnouncementStatus,
  { bg: string; fg: string; label: string }
> = {
  published: { bg: "#e6f2ec", fg: lmsTokens.good, label: "Published" },
  scheduled: { bg: "#fbf0df", fg: lmsTokens.warn, label: "Scheduled" },
  draft: { bg: "#f4f4f4", fg: lmsTokens.slate, label: "Draft" },
};

function AnnouncementStatusBadge({ status }: { status: AnnouncementStatus }) {
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

export default function AdminAnnouncementsView() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      all: adminAnnouncements.length,
      published: adminAnnouncements.filter((a) => a.status === "published").length,
      scheduled: adminAnnouncements.filter((a) => a.status === "scheduled").length,
      draft: adminAnnouncements.filter((a) => a.status === "draft").length,
    }),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return adminAnnouncements.filter((item) => {
      const matchesFilter = filter === "all" || item.status === filter;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.body.toLowerCase().includes(q) ||
        item.audience.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

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
            Announcements
          </h1>
          <p className="mt-1 text-xs sm:mt-1.5 sm:text-sm" style={{ color: lmsTokens.slate }}>
            Publish notices to students, instructors, and staff.
          </p>
        </div>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-nlsc-gold bg-nlsc-gold px-4 py-2.5 text-xs font-semibold text-nlsc-black transition-all hover:bg-transparent hover:text-nlsc-gold-text sm:flex-none"
        >
          <MegaphoneIcon size={14} />
          Post Announcement
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Total" value={String(counts.all)} />
        <StatCard
          label="Published"
          value={String(counts.published)}
          sub="Live now"
          accent={lmsTokens.good}
          subPill
        />
        <StatCard
          label="Scheduled"
          value={String(counts.scheduled)}
          sub="Upcoming"
          accent={lmsTokens.warn}
          subPill
        />
        <StatCard
          label="Drafts"
          value={String(counts.draft)}
          sub="Not published"
          accent={lmsTokens.slate}
        />
      </div>

      <section className="lms-panel-card p-4 sm:p-5 lg:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <h2
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: lmsTokens.ink }}
          >
            <MegaphoneIcon size={15} color={lmsTokens.gold500} />
            All Announcements
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ backgroundColor: lmsTokens.gold100, color: lmsTokens.navy800 }}
            >
              {filtered.length}
            </span>
          </h2>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search announcements..."
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

        <div className="flex flex-col gap-3 sm:gap-4">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm" style={{ color: lmsTokens.slate }}>
              No announcements match your search.
            </p>
          ) : (
            filtered.map((item) => (
              <AnnouncementCard key={item.id} item={item} />
            ))
          )}
        </div>

        <div
          className="mt-4 flex items-center justify-between border-t pt-4 text-xs"
          style={{ borderColor: lmsTokens.line, color: lmsTokens.slate }}
        >
          <span>
            Showing {filtered.length} of {adminAnnouncements.length} announcements
          </span>
          <button
            type="button"
            className="flex items-center gap-1 font-semibold transition-opacity hover:opacity-80"
            style={{ color: lmsTokens.gold500 }}
          >
            View archive <ChevronRightIcon size={13} />
          </button>
        </div>
      </section>
    </>
  );
}

function AnnouncementCard({ item }: { item: AdminAnnouncement }) {
  return (
    <article
      className="rounded-lg border p-4 transition-colors hover:border-nlsc-gold/35 sm:p-5"
      style={{ borderColor: lmsTokens.line }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <AnnouncementStatusBadge status={item.status} />
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{ backgroundColor: lmsTokens.gold100, color: lmsTokens.navy800 }}
            >
              {item.audience}
            </span>
          </div>
          <h3 className="text-sm font-semibold sm:text-base" style={{ color: lmsTokens.ink }}>
            {item.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed sm:text-sm" style={{ color: lmsTokens.slate }}>
            {item.body}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px]" style={{ color: lmsTokens.slate }}>
            <span>By {item.author}</span>
            {item.posted !== "—" && <span>{item.posted}</span>}
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 self-start rounded p-1 hover:bg-neutral-100"
          aria-label={`Actions for ${item.title}`}
        >
          <MoreHorizontalIcon size={16} color={lmsTokens.slate} />
        </button>
      </div>
    </article>
  );
}
