"use client";

import clsx from "clsx";
import { SlidersHorizontal, XCircle } from "lucide-react";
import { TopicChip } from "@components/ui/TopicChip";

const SINCE_OPTIONS = [
  { label: "24h", value: "24h" },
  { label: "3d", value: "3d" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "All", value: undefined },
];

export type FilterRailProps = {
  availableTags: string[];
  availableSources: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  selectedSource?: string;
  onToggleSource: (source: string) => void;
  since?: string;
  onSinceChange: (value: string | undefined) => void;
  onClearFilters: () => void;
  className?: string;
};

export function FilterRail(props: FilterRailProps) {
  return (
    <aside
      className={clsx(
        "sticky top-24 h-fit w-full max-w-xs rounded-3xl border border-white/5 bg-white/5 p-4 backdrop-blur-xl",
        props.className
      )}
    >
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-slate-400">
        <span className="inline-flex items-center gap-2 text-slate-300">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </span>
        <button
          type="button"
          onClick={props.onClearFilters}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 transition hover:text-brand-300"
        >
          <XCircle className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      <section className="mt-4 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Freshness</h3>
        <div className="flex flex-wrap gap-2">
          {SINCE_OPTIONS.map((option) => (
            <TopicChip
              key={option.label}
              active={props.since === option.value || (!props.since && option.value === undefined)}
              onClick={() => props.onSinceChange(option.value)}
            >
              {option.label}
            </TopicChip>
          ))}
        </div>
      </section>

      <section className="mt-6 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {props.availableTags.map((tag) => (
            <TopicChip
              key={tag}
              active={props.selectedTags.includes(tag)}
              onClick={() => props.onToggleTag(tag)}
            >
              {tag}
            </TopicChip>
          ))}
        </div>
      </section>

      <section className="mt-6 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Sources</h3>
        <div className="flex flex-wrap gap-2">
          {props.availableSources.map((source) => (
            <TopicChip
              key={source}
              active={props.selectedSource === source}
              onClick={() => props.onToggleSource(source)}
            >
              {source}
            </TopicChip>
          ))}
        </div>
      </section>
    </aside>
  );
}
