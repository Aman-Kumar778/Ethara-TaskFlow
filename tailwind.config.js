/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1", // Electric Indigo
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        accent: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4", // Cyan
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        slate: {
          900: "#0f172a", // Deep Navy Slate
          800: "#1e293b", // Surface/Card
          700: "#334155",
          600: "#475569",
          500: "#94a3b8", // Lightened for visibility
          400: "#cbd5e1", // Lightened for visibility
          300: "#e2e8f0",
          200: "#f1f5f9",
          100: "#f8fafc",
          50: "#ffffff",
        },
        wheat: {
          DEFAULT: "#F5DEB3",
          50: "#fffdfa",
          100: "#fef8ec",
          200: "#fdf1d9",
          300: "#fbebc6",
          400: "#f9e5b3",
          500: "#F5DEB3", // Standard Wheat
          600: "#d9c59f",
          700: "#bcab89",
          800: "#a09175",
          900: "#837760",
        },
        success: "#10b981",
        alert: "#ef4444",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif", "system-ui"],
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.2)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.2)',
      }
    },
  },
  plugins: [],
};
