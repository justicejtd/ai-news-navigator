import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    coverage: {
      reporter: ["text", "html"],
    },
  },
  esbuild: {
    jsx: "automatic",
    jsxDev: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@components": path.resolve(__dirname, "components"),
      "@context": path.resolve(__dirname, "context"),
      "@lib": path.resolve(__dirname, "lib"),
      "@data": path.resolve(__dirname, "data"),
      "@hooks": path.resolve(__dirname, "hooks"),
    },
  },
});
