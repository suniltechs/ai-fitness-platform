/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        primary: {
          DEFAULT: "#ccff00", // Neon Green
          dark: "#a3cc00",
        },
        secondary: {
          DEFAULT: "#00d4ff", // Electric Blue
          dark: "#00a3cc",
        },
        accent: "#ff007a", // Vivid Pink for highlights
        card: "rgba(255, 255, 255, 0.05)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
