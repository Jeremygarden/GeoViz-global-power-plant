/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          50: "#edf9ff",
          100: "#d6f1ff",
          200: "#a6e1ff",
          300: "#6fcaff",
          400: "#34abff",
          500: "#0c86ff",
          600: "#0066e6",
          700: "#004bb4",
          800: "#00347d",
          900: "#001b40",
          950: "#0b0f1f",
        },
      },
    },
  },
  plugins: [],
}

