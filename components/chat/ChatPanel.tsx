"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpCircle, Bot, Loader2, X } from "lucide-react";
import clsx from "clsx";
import { ChatResponse, SummaryMode } from "@lib/types";

const SUGGESTIONS = [
  "Summarize today's top AI safety stories",
  "Compare OpenAI and Anthropic agent updates",
  "Explain retrieval latency trade-offs like I'm new",
  "Set an alert for policy moves this week",
];

export type ChatPanelProps = {
  open: boolean;
  onClose: () => void;
  summaryMode: SummaryMode;
  selectedIds: string[];
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: ChatResponse["citations"];
  actions?: ChatResponse["actions"];
  confidence?: ChatResponse["confidence"];
};

export function ChatPanel({ open, onClose, summaryMode, selectedIds }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "assistant-welcome",
      role: "assistant",
      content:
        "Hey, I'm AI Navigator. Ask me for fresh stories, definitions, or comparisons — I'll cite sources and recommend next steps.",
      confidence: "high",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const contextSummary = useMemo(() => {
    if (!selectedIds.length) return "";
    return `Currently focused on ${selectedIds.length} story${selectedIds.length > 1 ? "ies" : ""}.`;
  }, [selectedIds]);

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: prompt,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          context: { summaryMode, selectedIds },
        }),
      });
      const data: ChatResponse = await response.json();
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        citations: data.citations,
        actions: data.actions,
        confidence: data.confidence,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: "I hit a snag reaching the server. Try again in a moment or adjust your question.",
          confidence: "low",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <aside
      className={clsx(
        "fixed bottom-0 right-0 top-20 z-40 flex w-full max-w-xl flex-col border-l border-white/10 bg-slate-950/90 backdrop-blur-xl transition-transform lg:static lg:top-0 lg:w-96 lg:translate-x-0",
        open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            <Bot className="h-4 w-4 text-brand-300" /> AI Navigator
          </p>
          <p className="text-xs text-slate-400">{contextSummary || "Ask about stories, trends, or definitions."}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/10 p-1 text-slate-300 transition hover:border-brand-400 focus-visible:ring-brand-400 lg:hidden"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              "max-w-full rounded-2xl p-4 text-sm shadow-soft",
              message.role === "assistant"
                ? "bg-white/5 text-slate-100"
                : "ml-auto bg-brand-500 text-white"
            )}
          >
            <div className="space-y-2">
              <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
              {message.citations && message.citations.length > 0 && (
                <div className="space-y-1 rounded-xl bg-slate-900/60 p-3 text-xs text-slate-200">
                  <p className="font-semibold uppercase tracking-widest text-slate-400">Citations</p>
                  <ul className="space-y-1">
                    {message.citations.map((citation) => (
                      <li key={citation.articleId}>
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-300 hover:text-brand-200"
                        >
                          {citation.title} — {citation.domain} ({new Date(citation.publishedAt).toLocaleString()})
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {message.actions && message.actions.length > 0 && (
                <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-widest text-brand-200">
                  {message.actions.map((action) => (
                    <span key={action} className="rounded-full border border-brand-400/40 px-2 py-1">
                      {action}
                    </span>
                  ))}
                </div>
              )}
              {message.confidence && (
                <p className="text-[11px] uppercase tracking-widest text-slate-400">Confidence: {message.confidence}</p>
              )}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 rounded-2xl bg-white/5 p-3 text-sm text-slate-200">
            <Loader2 className="h-4 w-4 animate-spin" />
            Working on it…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/5 bg-slate-950/80 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask for summaries, comparisons, or alerts."
              className="min-h-[64px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="self-end rounded-full bg-brand-500 p-3 text-white shadow-soft transition hover:bg-brand-400 focus-visible:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUpCircle className="h-5 w-5" />}
            </button>
          </div>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => sendMessage(suggestion)}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-200 transition hover:border-brand-400 focus-visible:ring-brand-400"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
