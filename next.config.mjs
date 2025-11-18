import { createMDX } from "fumadocs-mdx/next";
const withMDX = createMDX();

const isProd = process.env.NODE_ENV === "production";
const url = "https://react-picture-selector.zephinax.com/";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: "",
  assetPrefix: isProd ? url : ""
};

export default withMDX(config);
