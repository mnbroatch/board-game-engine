import HtmlWebPackPlugin from "html-webpack-plugin";
import PrebuildRegistryPlugin from "./webpack-prebuild-registry.js";

export default {
  entry: "./index.js",
  output: { filename: "board-game-engine.js" },
  plugins: [
    new HtmlWebPackPlugin({ template: "./index.html" }),
    new PrebuildRegistryPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader", options: { presets: ["@babel/preset-env","@babel/preset-react"] } },
      },
      { test: /\.s?[ac]ss$/i, use: ["style-loader","css-loader","sass-loader"] },
    ],
  },
  resolve: { extensions: [".js",".ts",".tsx",".jsx",".json"] },
};
