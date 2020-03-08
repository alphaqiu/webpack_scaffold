"use strict";

let path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';
const config = require("./config")[devMode ? "devProps" : "prdProps"];

const entry = {
  index: "./index.js"
};

const output = {
  filename: devMode ? "js/[name].js" : "js/[name].[hash].js",
  path: path.resolve(__dirname, "../dist")
};

const devtool = devMode ? "none" : "cheap-module-eval-source-map";

const rules = [
  {
    test: /\.js$/,
    loader: "babel-loader",
    exclude: /node_modules/
  },
  {
    test: /\.css$/,
    exclude: /node_modules/,
    use: [
      { loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader },
      { loader: "css-loader", options: { importLoaders: 1 } },
      { loader: "postcss-loader" }
    ]
  }
];

const plugins = [
  new HtmlWebpackPlugin({
    template: "build/index.html",
	filename: "index.html",
	/* 将环境相关的配置独立在外部 */
    ...config
  }),
  new MiniCssExtractPlugin({
	// Options similar to the same options in webpackOptions.output
	// both options are optional
	filename: devMode ? "css/[name].css" : "css/[name].[hash].css",
	chunkFilename: devMode ? "css/[id].css" : "css/[id].[hash].css"
  }),
  new webpack.SourceMapDevToolPlugin({
	  filename: "[name].js.map",
	  exclude: ["vendor.js"]
  })
];

const optimization = {
	minimizer: [
		new TerserPlugin(),
		new OptimizeCSSAssetsPlugin({})
	]
}

const settings = {
  mode: devMode ? "development" : "production",
  entry,
  output,
  module: { rules },
  plugins,
  optimization,
  devtool
};

module.exports = settings;
