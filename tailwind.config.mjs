/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        beige: "#faf8f6",
        offBlack: "#0d0c22",
      },
      fontFamily: {
        newsreader: ["Newsreader", "serif"], // Custom font
      },
    },
  },
  plugins: [],
};
