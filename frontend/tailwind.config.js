import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        brand: {
          dark: "#124B2B",
          base: "#1F6E43",
        },
        gray: {
          900: "#111827",
          700: "#374151",
          600: "#4B5563",
          500: "#6B7280",
          400: "#9CA3AF",
          300: "#D1D5DB",
          200: "#E5E7EB",
          100: "#F8F9FA",
        },
        feedback: {
          danger: "#EF4444",
          success: "#19AD70",
        },
        finance: {
          "blue-dark": "#1D4ED8",
          "blue-base": "#2563EB",
          "blue-light": "#DBEAFE",
          "purple-dark": "#7E22CE",
          "purple-base": "#9333EA",
          "purple-light": "#F3E8FF",
          "pink-dark": "#BE185D",
          "pink-base": "#DB2777",
          "pink-light": "#FCE7F3",
          "red-dark": "#B91C1C",
          "red-base": "#DC2626",
          "red-light": "#FEE2E2",
          "orange-dark": "#C2410C",
          "orange-base": "#EA580C",
          "orange-light": "#FFEDD5",
          "yellow-dark": "#A16207",
          "yellow-base": "#CA8A04",
          "yellow-light": "#FEF3C7",
          "green-dark": "#15803D",
          "green-base": "#16A34A",
          "green-light": "#E0FAE9",
        },
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      boxShadow: {
        panel: "0 16px 40px rgba(17, 24, 39, 0.08)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
