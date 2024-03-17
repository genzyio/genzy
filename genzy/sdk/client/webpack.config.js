import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { NODE_ENV = "production" } = process.env;
export default {
  entry: "./src/index.ts",
  mode: NODE_ENV,
  target: ["web", "es2022"],
  node: {
    __dirname: true,
    __filename: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  experiments: {
    outputModule: true,
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    library: {
      type: "module",
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
