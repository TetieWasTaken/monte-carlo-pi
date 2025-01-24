import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--contentFont)", "ui-sans-serif", "system-ui"],
        title: ["var(--titleFont)", "ui-serif", "Georgia"],
      },
    },
  },
  plugins: [],
} satisfies Config;
