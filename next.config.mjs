import { createMDX } from "fumadocs-mdx/next";
const withMDX = createMDX();

const isProd = process.env.NODE_ENV === "production";
const repoName = "react-picture-selector";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true, // حیاتی: بدون این، routes خراب می‌شن
  images: {
    unoptimized: true
  },
  basePath: isProd ? `/${repoName}` : "", // پیشوند برای همه لینک‌ها
  assetPrefix: isProd ? `https://zephinax.github.io/${repoName}/` : "" // کامل URL برای assets (نه فقط /repo/)
};

export default withMDX(config);
