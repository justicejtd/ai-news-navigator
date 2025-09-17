"use client";

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-white/5 bg-white/5 p-6">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-2xl bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 rounded-full bg-white/10" />
          <div className="h-3 w-1/3 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <div className="h-3 w-full rounded-full bg-white/10" />
        <div className="h-3 w-2/3 rounded-full bg-white/10" />
        <div className="h-3 w-4/5 rounded-full bg-white/10" />
      </div>
    </div>
  );
}
