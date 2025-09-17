import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f6ff",
          100: "#e1e7ff",
          200: "#c0c8ff",
          300: "#9ca7ff",
          400: "#7482ff",
          500: "#4250ff",
          600: "#2c3be6",
          700: "#1d2cbc",
          800: "#182693",
          900: "#151f72"
        }
      },
      boxShadow: {
        soft: "0 10px 40px -20px rgba(24, 38, 147, 0.5)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.1)"
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-in-out"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};

export default config;
