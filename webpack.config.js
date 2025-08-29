import HtmlWebPackPlugin from "html-webpack-plugin";
import EmitRegistryPlugin from "./emit-serializable.js";
import collectSerializable from "./collect-serializable.js";

export default {
  entry: "./index.js",
  output: {
    filename: "build.js",
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new HtmlWebPackPlugin({
      title: "React Template",
      template: "./index.html",
    }),
    new EmitRegistryPlugin({ outputFile: "./src/registry.js" }) // <-- add this
  ],
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [collectSerializable]
          },
        },
      },
      {
        test: /\.s?[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"],
  },
};
