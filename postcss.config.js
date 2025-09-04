module.exports = {
  plugins: {
    "@tailwindcss/postcss": {
      content: ["./src/**/*.{js,jsx,ts,tsx}"],
      safelist: [
        "animate-spin",
        "backdrop-blur-xs",
        "bg-black/20",
        "bg-opacity-80",
      ],
    },
    autoprefixer: {},
  },
};
