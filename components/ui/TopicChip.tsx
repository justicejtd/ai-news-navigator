"use client";

import clsx from "clsx";
import { ReactNode } from "react";

export type TopicChipProps = {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

export function TopicChip({ active, children, onClick, className }: TopicChipProps) {
  const baseClass = clsx(
    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition",
    active
      ? "border-brand-400 bg-brand-500/20 text-brand-100 shadow-soft"
      : "border-white/10 bg-white/5 text-slate-300 hover:border-brand-400 hover:text-white",
    className
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={baseClass}>
        {children}
      </button>
    );
  }

  return <span className={baseClass}>{children}</span>;
}
