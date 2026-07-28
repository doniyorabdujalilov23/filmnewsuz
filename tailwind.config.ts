import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#070C1A",
          soft: "#0F1830",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          dim: "#F5F6FA",
        },
        accent: {
          DEFAULT: "#E11D2E",
          hover: "#B91424",
          soft: "#FBE3E5",
        },
        navy: {
          DEFAULT: "#0B3D91",
          soft: "#E7EEFC",
          light: "#1B4FB0",
        },
        muted: "#6B7280",
        line: "#E4E7EC",
        "line-dark": "#22293F",
        surface: {
          dark: "#070C1A",
          "dark-card": "#0F1830",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        glow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        ticker: "ticker 30s linear infinite",
        "fade-up": "fade-up 0.4s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
        glow: "glow 2.4s ease-in-out infinite",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            maxWidth: "none",
            a: { color: "#E11D2E" },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
