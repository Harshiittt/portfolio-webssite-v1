import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0d0f14",
          light: "#112240",
          border: "#1e2535",
        },
        slate: {
          DEFAULT: "#8892b0",
          light: "#ccd6f6",
          lightest: "#e2e8f0",
        },
        teal: "#64ffda",
      },
      fontFamily: {
        mono: ["'Courier New'", "Courier", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
