import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aerospace Industrial palette (from /design/DESIGN.md — source of truth)
        background: "#000000",
        surface: "#121414",
        "surface-dim": "#121414",
        "surface-bright": "#383939",
        "surface-container-lowest": "#0d0e0f",
        "surface-container-low": "#1b1c1c",
        "surface-container": "#1f2020",
        "surface-container-high": "#292a2a",
        "surface-container-highest": "#343535",
        "surface-variant": "#343535",
        "on-surface": "#e3e2e2",
        "on-surface-variant": "#c0c7d5",
        "on-background": "#e3e2e2",
        "inverse-surface": "#e3e2e2",
        "inverse-on-surface": "#303031",
        outline: "#8a919f",
        "outline-variant": "#404753",
        // Primary — electric technical blue
        primary: "#a3c9ff",
        "on-primary": "#00315d",
        "primary-container": "#1493ff",
        "on-primary-container": "#002a51",
        "inverse-primary": "#0060ab",
        "surface-tint": "#a3c9ff",
        "primary-fixed": "#d3e3ff",
        "primary-fixed-dim": "#a3c9ff",
        "on-primary-fixed": "#001c39",
        "on-primary-fixed-variant": "#004883",
        // Secondary / tertiary
        secondary: "#c6c6c7",
        "on-secondary": "#2f3131",
        "secondary-container": "#454747",
        "on-secondary-container": "#b4b5b5",
        tertiary: "#c8c6c5",
        "on-tertiary": "#313030",
        // Error / signal
        error: "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
      },
      borderRadius: {
        DEFAULT: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        full: "9999px",
      },
      spacing: {
        unit: "4px",
        gutter: "24px",
        "margin-mobile": "20px",
        "margin-desktop": "80px",
        "section-gap": "160px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        geist: ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        "headline-display": [
          "72px",
          { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "700" },
        ],
        "headline-lg": [
          "48px",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-lg-mobile": [
          "32px",
          { lineHeight: "1.2", fontWeight: "700" },
        ],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-caps": [
          "12px",
          { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" },
        ],
        "mono-data": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      maxWidth: {
        content: "1280px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
