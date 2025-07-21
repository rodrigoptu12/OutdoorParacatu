// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: "#22c55e", // Verde (tailwind green-500)
            dark: "#16a34a", // Verde escuro (tailwind green-600)
          },
          secondary: {
            DEFAULT: "#5956E9", // Roxo/Azulado do logotipo
          },
        },
        maxWidth: {
          "screen-2xl": "1536px",
        },
      },
    },
    plugins: [],
  };