import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B2545",
          dark: "#071a33",
          light: "#13335f",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#e6c75c",
          dark: "#b8942a",
        },
        paper: "#F8FAFC",
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "Tahoma", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 40px -10px rgba(11,37,69,0.25)",
        gold: "0 4px 20px -4px rgba(212,175,55,0.45)",
      },
      backgroundImage: {
        "royal-gradient": "linear-gradient(135deg, #0B2545 0%, #13335f 60%, #0B2545 100%)",
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #f0d878 50%, #D4AF37 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
