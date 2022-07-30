const webpack = require('webpack');
const path = require("path");
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const CopyPlugin = require('copy-webpack-plugin');

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
          from: path.resolve(__dirname, "src/views-js/"),
          to: "views-js/",
        },
        {
          from: path.resolve(__dirname, "src/views-ts/"),
          to: "views-ts/",
        },
        {
          from: path.resolve(__dirname, "src/views-cs/"),
          to: "views-cs/",
        },
      ],
    }),
  ]
};
