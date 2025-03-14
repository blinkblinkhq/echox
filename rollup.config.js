import terser from "@rollup/plugin-terser";

const config = {
  input: "src/index.js",
  output: {
    file: "dist/echox.umd.js",
    name: "ex",
    format: "umd",
  },
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      file: "dist/echox.umd.min.js",
    },
    plugins: [terser()],
  },
];
