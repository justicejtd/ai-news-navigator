"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type SummaryMode = "beginner" | "expert";

type SummaryContextValue = {
  mode: SummaryMode;
  setMode: (mode: SummaryMode) => void;
  toggle: () => void;
};

const SummaryModeContext = createContext<SummaryContextValue | undefined>(undefined);

const STORAGE_KEY = "ainavigator:summary-mode";

export function SummaryModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<SummaryMode>("beginner");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "beginner" || stored === "expert") {
      setModeState(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode: setModeState,
      toggle: () => setModeState((prev) => (prev === "beginner" ? "expert" : "beginner")),
    }),
    [mode]
  );

  return <SummaryModeContext.Provider value={value}>{children}</SummaryModeContext.Provider>;
}

export function useSummaryMode() {
  const ctx = useContext(SummaryModeContext);
  if (!ctx) {
    throw new Error("useSummaryMode must be used within SummaryModeProvider");
  }
  return ctx;
}
