import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./styles/**/*.css", "./public/**/*.svg", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          primary: "#7dd3fc",
          secondary: "#c084fc",
          tertiary: "#22d3ee",
        },
      },
      boxShadow: {
        panel: "0 10px 40px rgba(0,0,0,0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
