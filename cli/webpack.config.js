const webpack = require("webpack");
const path = require("path");
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const CopyPlugin = require("copy-webpack-plugin");

const { NODE_ENV = "production" } = process.env;
module.exports = {
  entry: "./src/index.ts",
  mode: NODE_ENV,
  target: ["node", "es2015"],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        keepNames: true,
      }),
    ],
  },
  externals: {
    prettier: {
      commonjs: "prettier",
      commonjs2: "prettier",
      amd: "prettier",
    },
    ["prettier-plugin-organize-imports"]: {
      commonjs: "prettier-plugin-organize-imports",
      commonjs2: "prettier-plugin-organize-imports",
      amd: "prettier-plugin-organize-imports",
    },
  },
  output: {
    path: path.resolve(__dirname, "bin"),
    filename: "index.js",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      fsevents$: path.resolve(__dirname, `fsevents.js`),
    },
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/javascript/views-client/"),
          to: "javascript/views-client/",
        },
        {
          from: path.resolve(__dirname, "src/typescript/views-client/"),
          to: "typescript/views-client/",
        },
        {
          from: path.resolve(__dirname, "src/csharp/views-client/"),
          to: "csharp/views-client/",
        },
        {
          from: path.resolve(__dirname, "src/javascript/views-server/"),
          to: "javascript/views-server/",
        },
        {
          from: path.resolve(__dirname, "src/typescript/views-server/"),
          to: "typescript/views-server/",
        },
        {
          from: path.resolve(__dirname, "src/index.d.ts"),
          to: ".",
        },
        {
          from: path.resolve(__dirname, "src/types.d.ts"),
          to: ".",
        },
      ],
    }),
  ],
};
