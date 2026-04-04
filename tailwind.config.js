/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          base: "#0b0f14",
          glow: "#35f3c4",
          blue: "#4cc3ff",
        },
      },
    },
  },
  plugins: [],
}

