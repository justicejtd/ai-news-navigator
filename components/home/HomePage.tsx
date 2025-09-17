"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSummaryMode } from "@context/SummaryModeContext";
import { useSavedCollections } from "@context/SavedCollectionsContext";
import { FeedItem, SummaryMode } from "@lib/types";
import { TopBar } from "@components/home/TopBar";
import { FilterRail } from "@components/home/FilterRail";
import { FiltersSheet } from "@components/home/FiltersSheet";
import { FeedList } from "@components/feed/FeedList";
import { ChatPanel } from "@components/chat/ChatPanel";
import { CollectionsDrawer } from "@components/home/CollectionsDrawer";
import { useMediaQuery } from "@hooks/useMediaQuery";

const DEFAULT_SORT: "latest" | "trending" | "research" | "policy" = "latest";

export function HomePage() {
  const { mode, toggle } = useSummaryMode();
  const { defaultCollectionId } = useSavedCollections();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<typeof DEFAULT_SORT>(DEFAULT_SORT);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | undefined>(undefined);
  const [since, setSince] = useState<string | undefined>("24h");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(id);
  }, [search]);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      sort,
      tags: selectedTags,
      source: selectedSource,
      since,
    }),
    [debouncedSearch, sort, selectedTags, selectedSource, since]
  );

  const feedQuery = useQuery<{ items: FeedItem[]; availableTags: string[]; availableSources: string[]; total: number }>(
    {
      queryKey: ["feed", queryParams],
      queryFn: async () => {
        const params = new URLSearchParams();
        if (queryParams.search) params.set("search", queryParams.search);
        if (queryParams.sort) params.set("sort", queryParams.sort);
        if (queryParams.source) params.set("source", queryParams.source);
        if (queryParams.since) params.set("since", queryParams.since);
        queryParams.tags.forEach((tag) => params.append("tags[]", tag));
        const response = await fetch(`/api/feed?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to load feed");
        }
        return response.json();
      },
    }
  );

  useEffect(() => {
    if (feedQuery.data?.items) {
      setHighlightedIds(feedQuery.data.items.slice(0, 3).map((item) => item.id));
    }
  }, [feedQuery.data?.items]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleSourceToggle = (source: string) => {
    setSelectedSource((prev) => (prev === source ? undefined : source));
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedSource(undefined);
    setSince("24h");
    setSort(DEFAULT_SORT);
  };

  const summaryMode: SummaryMode = mode;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <TopBar
        search={search}
        onSearchChange={setSearch}
        onOpenFilters={() => setFiltersOpen(true)}
        onOpenChat={() => setChatOpen((prev) => !prev)}
        onOpenCollections={() => setCollectionsOpen(true)}
        summaryMode={summaryMode}
        onSummaryModeToggle={toggle}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 pb-16 pt-4 lg:px-6">
        <FilterRail
          availableTags={feedQuery.data?.availableTags ?? []}
          availableSources={feedQuery.data?.availableSources ?? []}
          selectedTags={selectedTags}
          onToggleTag={handleTagToggle}
          selectedSource={selectedSource}
          onToggleSource={handleSourceToggle}
          since={since}
          onSinceChange={setSince}
          onClearFilters={handleClearFilters}
          className="hidden lg:flex"
        />

        <main className="flex-1 space-y-6">
          {feedQuery.isError && (
            <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-6 text-sm text-rose-100">
              Something went wrong while loading the feed. Please refresh or adjust your filters.
            </div>
          )}
          <FeedList
            items={feedQuery.data?.items ?? []}
            isLoading={feedQuery.isLoading}
            isFetching={feedQuery.isFetching}
            summaryMode={summaryMode}
            highlightedIds={highlightedIds}
            onHighlightChange={setHighlightedIds}
          />
        </main>

        <ChatPanel open={isDesktop ? true : chatOpen} onClose={() => setChatOpen(false)} summaryMode={summaryMode} selectedIds={highlightedIds} />
      </div>

      <FiltersSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        availableTags={feedQuery.data?.availableTags ?? []}
        availableSources={feedQuery.data?.availableSources ?? []}
        selectedTags={selectedTags}
        onToggleTag={handleTagToggle}
        selectedSource={selectedSource}
        onToggleSource={handleSourceToggle}
        since={since}
        onSinceChange={setSince}
        onClearFilters={handleClearFilters}
      />

      <CollectionsDrawer
        open={collectionsOpen}
        onOpenChange={setCollectionsOpen}
        defaultCollectionId={defaultCollectionId}
      />
    </div>
  );
}
