const path = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

const {
  NODE_ENV = 'production',
} = process.env;
module.exports = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  target: ['node', 'es2015'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
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
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  }
}