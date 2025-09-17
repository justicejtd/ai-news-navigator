import { describe, expect, it } from "vitest";
import { generateChatResponse } from "@lib/chat";

describe("generateChatResponse", () => {
  it("returns cited answers for safety questions", async () => {
    const response = await generateChatResponse({
      message: "Summarize the top 3 stories on AI safety today and compare their stances",
      context: { summaryMode: "beginner" },
    });
    expect(response.answer.toLowerCase()).toContain("safety");
    expect(response.citations.length).toBeGreaterThan(0);
    expect(response.citations.every((citation) => typeof citation.url === "string")).toBe(true);
  });

  it("adjusts summary mode when expert is requested", async () => {
    const response = await generateChatResponse({
      message: "Give me an expert comparison of Gemini and Phi-3",
      context: { summaryMode: "beginner" },
    });
    expect(response.answer.toLowerCase()).toContain("gemini");
    expect(response.answer.toLowerCase()).toContain("phi");
  });
});
