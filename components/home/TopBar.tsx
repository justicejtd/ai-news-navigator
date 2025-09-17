"use client";

import { ChangeEvent } from "react";
import { BookMarked, Bot, Filter, Search, Sparkles, SunMoon } from "lucide-react";
import { SummaryMode } from "@lib/types";
import { useTheme } from "next-themes";
import clsx from "clsx";

const SORT_OPTIONS: { value: "latest" | "trending" | "research" | "policy"; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "trending", label: "Trending" },
  { value: "research", label: "Research" },
  { value: "policy", label: "Policy" },
];

export type TopBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  onOpenChat: () => void;
  onOpenCollections: () => void;
  summaryMode: SummaryMode;
  onSummaryModeToggle: () => void;
  sort: "latest" | "trending" | "research" | "policy";
  onSortChange: (value: "latest" | "trending" | "research" | "policy") => void;
};

export function TopBar(props: TopBarProps) {
  const { setTheme, theme } = useTheme();
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    props.onSearchChange(event.target.value);
  };

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-300 shadow-soft">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">AI News Navigator</p>
              <p className="text-xs text-slate-400">
                Fresh AI research, policy, and product drops — summarized with citations.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={props.onSummaryModeToggle}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-100 shadow-soft transition hover:border-brand-400 hover:text-white focus-visible:ring-brand-400"
            >
              <SunMoon className="h-4 w-4" />
              {props.summaryMode === "beginner" ? "Switch to Expert" : "Switch to Beginner"}
            </button>
            <button
              type="button"
              onClick={props.onOpenCollections}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-brand-400 focus-visible:ring-brand-400"
            >
              <BookMarked className="h-4 w-4" />
              Collections
            </button>
            <button
              type="button"
              onClick={props.onOpenChat}
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-brand-400 focus-visible:ring-brand-200"
            >
              <Bot className="h-4 w-4" />
              Chat
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={props.search}
              onChange={handleSearch}
              placeholder="Search topics, people, or questions (e.g. RAG latency)"
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-14 text-sm text-white placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button
              type="button"
              onClick={handleThemeToggle}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:border-brand-400"
              aria-label="Toggle theme"
            >
              <SunMoon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => props.onSortChange(option.value)}
                className={clsx(
                  "whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition",
                  props.sort === option.value
                    ? "bg-brand-500 text-white shadow-soft"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                )}
              >
                {option.label}
              </button>
            ))}
            <button
              type="button"
              onClick={props.onOpenFilters}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-brand-400 focus-visible:ring-brand-400 md:hidden"
            >
              <Filter className="h-4 w-4" /> Filters
            </button>
            <button
              type="button"
              onClick={props.onSummaryModeToggle}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-brand-400 focus-visible:ring-brand-400 md:hidden"
            >
              <SunMoon className="h-4 w-4" />
              {props.summaryMode === "beginner" ? "Expert mode" : "Beginner mode"}
            </button>
            <button
              type="button"
              onClick={props.onOpenChat}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-brand-400 focus-visible:ring-brand-400 md:hidden"
            >
              <Bot className="h-4 w-4" /> Chat
            </button>
            <button
              type="button"
              onClick={props.onOpenCollections}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-brand-400 focus-visible:ring-brand-400 md:hidden"
            >
              <BookMarked className="h-4 w-4" /> Saves
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
