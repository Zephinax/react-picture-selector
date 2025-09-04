module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // کلاس‌های سفارشی اگر لازم بود اینجا تعریف می‌کنیم
      backdropBlur: {
        xs: "2px", // تعریف custom blur xs
      },
      colors: {
        "black-20": "rgba(0, 0, 0, 0.2)",
      },
    },
  },
  safelist: [
    "animate-spin",
    "backdrop-blur-xs",
    "bg-black/20",
    "bg-opacity-80",
  ],
  plugins: [],
};
