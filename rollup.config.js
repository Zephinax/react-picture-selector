import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import autoExternal from "rollup-plugin-auto-external";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import analyze from "rollup-plugin-analyzer";
import replace from "@rollup/plugin-replace";
import packageJson from "./package.json" assert { type: "json" };

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: false,
      },
    ],
    external: ["react", "react-dom"],
    plugins: [
      replace({
        preventAssignment: true,
        __APP_VERSION__: JSON.stringify(packageJson.version),
      }),
      autoExternal(),
      resolve(),
      commonjs(),
      json(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss({
        inject: true,
        extract: false,
        minimize: true,
        config: {
          path: "./postcss.config.js",
        },
      }),
      terser(),
      analyze({ summaryOnly: true }),
    ],
  },
  {
    input: "./src/index.ts",
    output: [{ file: packageJson.types }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
];
