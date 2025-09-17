"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode, useState } from "react";
import { SummaryModeProvider } from "@context/SummaryModeContext";
import { SavedCollectionsProvider } from "@context/SavedCollectionsContext";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={client}>
        <SummaryModeProvider>
          <SavedCollectionsProvider>{children}</SavedCollectionsProvider>
        </SummaryModeProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
