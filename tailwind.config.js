import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-fixed-dim": "#b9c3ff",
        "error-container": "#ffdad6",
        "tertiary-fixed-dim": "#d6baff",
        "on-primary-container": "#ecedff",
        "error": "#ba1a1a",
        "on-error-container": "#93000a",
        "on-secondary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "inverse-on-surface": "#f3f0ef",
        "on-surface": "#1c1b1b",
        "on-background": "#1c1b1b",
        "secondary-fixed-dim": "#99d927",
        "secondary-container": "#b1f342",
        "surface-variant": "#e5e2e1",
        "inverse-surface": "#313030",
        "outline": "#747688",
        "on-primary": "#ffffff",
        "surface": "#fcf9f8",
        "outline-variant": "#c4c5d9",
        "surface-dim": "#dcd9d9",
        "on-tertiary": "#ffffff",
        "surface-container-highest": "#e5e2e1",
        "on-secondary-container": "#496d00",
        "surface-container": "#f0eded",
        "on-secondary-fixed-variant": "#334f00",
        "secondary": "#456800",
        "on-tertiary-fixed-variant": "#6000bf",
        "primary-container": "#2b59ff",
        "on-primary-fixed-variant": "#0035be",
        "secondary-fixed": "#b4f645",
        "on-primary-fixed": "#001356",
        "on-secondary-fixed": "#121f00",
        "primary-fixed": "#dde1ff",
        "on-tertiary-fixed": "#280056",
        "surface-bright": "#fcf9f8",
        "on-error": "#ffffff",
        "on-surface-variant": "#434656",
        "tertiary-container": "#8841e9",
        "background": "#fcf9f8",
        "primary": "#003fdd",
        "on-tertiary-container": "#f6eaff",
        "tertiary-fixed": "#ecdcff",
        "tertiary": "#6e1ecf",
        "surface-container-high": "#eae7e7",
        "surface-tint": "#1049f1",
        "inverse-primary": "#b9c3ff",
        "surface-container-low": "#f6f3f2"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "section-gap": "80px",
        "margin-mobile": "16px",
        "base": "8px",
        "gutter": "24px",
        "margin-desktop": "40px",
        "container-max": "1280px"
      },
      fontFamily: {
        "body-md": ["\"Source Serif 4\"", "serif"],
        "headline-md": ["Anton", "sans-serif"],
        "headline-xl": ["Anton", "sans-serif"],
        "display-lg-mobile": ["Anton", "sans-serif"],
        "display-lg": ["Anton", "sans-serif"],
        "label-bold": ["Hanken Grotesk", "sans-serif"],
        "label-md": ["Hanken Grotesk", "sans-serif"],
        "body-lg": ["\"Source Serif 4\"", "serif"]
      },
      fontSize: {
        "body-md": ["17px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-md": ["32px", { lineHeight: "38px", fontWeight: "400" }],
        "headline-xl": ["48px", { lineHeight: "56px", fontWeight: "400" }],
        "display-lg-mobile": ["48px", { lineHeight: "52px", fontWeight: "400" }],
        "display-lg": ["84px", { lineHeight: "90px", letterSpacing: "-0.02em", fontWeight: "400" }],
        "label-bold": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "700" }],
        "label-md": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "body-lg": ["20px", { lineHeight: "32px", fontWeight: "400" }]
      }
    },
  },
  plugins: [
    forms,
    containerQueries,
    typography,
  ],
}
