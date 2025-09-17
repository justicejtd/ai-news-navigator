import { describe, expect, it } from "vitest";
import { getFeed } from "@lib/feed";

describe("getFeed", () => {
  it("returns latest stories sorted by recency", () => {
    const result = getFeed({ sort: "latest" });
    expect(result.items.length).toBeGreaterThan(0);
    const timestamps = result.items.map((item) => new Date(item.publishedAt).getTime());
    const sorted = [...timestamps].sort((a, b) => b - a);
    expect(timestamps).toEqual(sorted);
  });

  it("filters by search query", () => {
    const result = getFeed({ search: "RAG latency" });
    expect(result.items.some((item) => item.id === "arxiv-rag-latency")).toBe(true);
  });

  it("filters by tags", () => {
    const result = getFeed({ tag: "Safety" });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((item) => item.tags.includes("Safety"))).toBe(true);
  });

  it("applies freshness window", () => {
    const result = getFeed({ since: "7d" });
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    expect(result.items.every((item) => new Date(item.publishedAt).getTime() > cutoff)).toBe(true);
  });

  it("prioritizes policy stories when requested", () => {
    const result = getFeed({ sort: "policy" });
    expect(result.items[0].tags).toContain("Policy");
  });
});
