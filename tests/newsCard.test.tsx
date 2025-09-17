import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NewsCard } from "@components/feed/NewsCard";
import { SummaryModeProvider } from "@context/SummaryModeContext";
import { SavedCollectionsProvider } from "@context/SavedCollectionsContext";
import { getFeed } from "@lib/feed";
import type { ReactNode } from "react";

function renderWithProviders(ui: ReactNode) {
  return render(
    <SummaryModeProvider>
      <SavedCollectionsProvider>{ui}</SavedCollectionsProvider>
    </SummaryModeProvider>
  );
}

describe("NewsCard", () => {
  it("reveals summaries when toggled", async () => {
    const item = getFeed({ sort: "latest" }).items[0];
    renderWithProviders(<NewsCard item={item} summaryMode="beginner" />);

    const showButton = screen.getByRole("button", { name: /show/i });
    fireEvent.click(showButton);

    expect(await screen.findByText(item.summary.beginner)).toBeInTheDocument();
  });
});
