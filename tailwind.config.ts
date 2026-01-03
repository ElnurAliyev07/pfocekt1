import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      scrollbarGutter: {
        stable: 'stable',
        'stable-both': 'stable both',
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        background: {
          DEFAULT: "var(--background)",
          dashboard: "#F9F9F9",
        },
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          focus: "var(--primary-focus)",
          disabled: "var(--primary-disabled)",
        },
        secondary: "#6366F1",
        t: {
          black: "var(--t-black)",
          gray: "var(--t-gray)",
        },
        border: {
          gray: "var(--b-gray)",
        },
        custom: {
          red: "var(--custom-red)",
          gray: "var(--custom-gray)",
        },
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        circular: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        marquee: "marquee 15s linear infinite",
        marquee2: "marquee2 15s linear infinite",
        "spin-slow": "spin 3s linear infinite",
        "spin-fast": "spin 0.5s linear infinite",
        "circular": "circular 1.4s linear infinite"
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
