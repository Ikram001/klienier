/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This maps 'font-sans' to Plus Jakarta Sans
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        // This maps 'font-mono' to JetBrains Mono
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}