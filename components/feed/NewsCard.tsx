"use client";

import { useState } from "react";
import { BookmarkCheck, BookmarkPlus, ExternalLink, Share2, Sparkles } from "lucide-react";
import clsx from "clsx";
import { FeedItem, SummaryMode } from "@lib/types";
import { useSavedCollections } from "@context/SavedCollectionsContext";
import { useSummaryMode } from "@context/SummaryModeContext";
import { TopicChip } from "@components/ui/TopicChip";

export type NewsCardProps = {
  item: FeedItem;
  summaryMode: SummaryMode;
  onHighlight?: (id: string) => void;
  isHighlighted?: boolean;
};

export function NewsCard({ item, summaryMode, onHighlight, isHighlighted }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [localMode, setLocalMode] = useState<SummaryMode>(summaryMode);
  const [shareState, setShareState] = useState<string | null>(null);
  const { defaultCollectionId, toggleSave, isSaved } = useSavedCollections();
  const { setMode } = useSummaryMode();

  const isSavedDefault = isSaved(item.id, defaultCollectionId);

  const handleSave = async () => {
    toggleSave(item, defaultCollectionId);
    try {
      await fetch("/api/save", {
        method: isSavedDefault ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      });
    } catch (error) {
      console.warn("save failed", error);
    }
  };

  const handleShare = async () => {
    if (!navigator?.clipboard) {
      setShareState("Clipboard unavailable");
      setTimeout(() => setShareState(null), 2000);
      return;
    }
    const shareText = `${item.title} — ${item.url}?utm_source=ai-news-navigator`;
    try {
      await navigator.clipboard.writeText(shareText);
      setShareState("Copied to clipboard");
    } catch (error) {
      setShareState("Copy failed");
    }
    setTimeout(() => setShareState(null), 2000);
  };

  const handleToggleMode = () => {
    setLocalMode((prev) => (prev === "beginner" ? "expert" : "beginner"));
  };

  const summary = localMode === "expert" ? item.summary.expert : item.summary.beginner;

  return (
    <article
      onMouseEnter={() => onHighlight?.(item.id)}
      onFocusCapture={() => onHighlight?.(item.id)}
      className={clsx(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft transition",
        isHighlighted ? "ring-2 ring-brand-400/60" : "hover:border-brand-400/60"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-100">
            {item.source.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            <p className="text-xs text-slate-400">
              {item.source.name} • {item.timeAgo}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-brand-400 focus-visible:ring-brand-400"
          >
            {isSavedDefault ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
            {isSavedDefault ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-brand-400 focus-visible:ring-brand-400"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:bg-brand-400 focus-visible:ring-brand-200"
          >
            <ExternalLink className="h-4 w-4" /> Read
          </a>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {item.tags.map((tag) => (
          <TopicChip key={tag} active>
            {tag}
          </TopicChip>
        ))}
        <span className="rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-300">
          Freshness • {item.score.toFixed(2)}
        </span>
      </div>

      <div className="mt-4 space-y-3 rounded-2xl bg-slate-900/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles className="h-4 w-4 text-brand-300" /> AI Summary
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleToggleMode}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200 transition hover:border-brand-400 focus-visible:ring-brand-400"
            >
              {localMode === "beginner" ? "View expert mode" : "Need simpler?"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode(localMode);
                setExpanded(true);
              }}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200 transition hover:border-brand-400 focus-visible:ring-brand-400"
            >
              Apply globally
            </button>
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200 transition hover:border-brand-400 focus-visible:ring-brand-400"
            >
              {expanded ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="space-y-3 text-sm text-slate-200">
            <p>{summary}</p>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-slate-400">Why it matters</p>
              <ul className="space-y-1 text-sm text-slate-200">
                {item.summary.whyItMatters.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-brand-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-300">{item.excerpt}</p>
      {shareState && (
        <p className="mt-2 text-xs text-brand-200" role="status">
          {shareState}
        </p>
      )}
    </article>
  );
}
