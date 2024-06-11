import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: "#FAFAFA",
        accentBlue: "#4C75E0",
        accent: "#E09958",
        accentHover: "#946841",
        heading: "#4F5258",
        black: "#2D2D2D",
        grey: "#AFB0B2",
        error: "#EA1A1A",
        orange: "#FFF0E2",
        blue: "#E4EAFB",
      },
      fontFamily: {
        workSans: ['"Work Sans", sans-serif;'],
      },
      boxShadow: {
        button: "0 5px 10px 0 rgba(0, 0, 0, 0.15)",
        buttonHover: "0 3px 6px 0 rgba(0, 0, 0, 0.15)",
        card: "0 10px 20px 0 rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
