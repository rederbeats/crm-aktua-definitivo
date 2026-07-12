import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#c81022",
          redDark: "#9f0c1b",
          black: "#080808",
          ink: "#141414",
          paper: "#f6f5f3",
          line: "#dedbd6"
        }
      },
      boxShadow: {
        work: "0 1px 2px rgba(10, 10, 10, 0.06), 0 8px 24px rgba(10, 10, 10, 0.05)"
      }
    }
  },
  plugins: []
};

export default config;
