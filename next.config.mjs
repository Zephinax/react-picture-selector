import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true
  },
  basePath: isProd ? "/react-picture-selector" : "",
  assetPrefix: isProd ? "/react-picture-selector/" : ""
};

export default withMDX(config);
