"use client";

import { Fragment } from "react";
import { SummaryMode, FeedItem } from "@lib/types";
import { NewsCard } from "@components/feed/NewsCard";
import { SkeletonCard } from "@components/feed/SkeletonCard";

export type FeedListProps = {
  items: FeedItem[];
  isLoading: boolean;
  isFetching: boolean;
  summaryMode: SummaryMode;
  highlightedIds: string[];
  onHighlightChange: (ids: string[]) => void;
};

export function FeedList({ items, isLoading, isFetching, summaryMode, highlightedIds, onHighlightChange }: FeedListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
        <p className="text-lg font-semibold text-white">No stories yet.</p>
        <p className="mt-2 text-sm text-slate-300">
          Try adjusting your filters or search query. The AI copilot can also help you find related topics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <Fragment key={item.id}>
          <NewsCard
            item={item}
            summaryMode={summaryMode}
            onHighlight={(id) => onHighlightChange([id, ...highlightedIds.filter((existing) => existing !== id)].slice(0, 3))}
            isHighlighted={highlightedIds.includes(item.id)}
          />
        </Fragment>
      ))}
      {isFetching && (
        <div className="space-y-4">
          <SkeletonCard />
        </div>
      )}
    </div>
  );
}
