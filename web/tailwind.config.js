/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: "Roboto, sans-serif",
      },
      backgroundImage: {
        app: "url(/app-bg.png)",
      },
      colors: {
        green: {
          ignite: "#129E57",
        },
        gray: {
          200: "#E1E1E6",
          250: "#C4C4CC",
          300: "#8D8D99",
          600: "#323238",
          800: "#202024",
          900: "#121214",
        },
        yellow: {
          500: "#F7DD43",
          600: "#d1bb36",
        },
      },
    },
  },
  plugins: [],
};
