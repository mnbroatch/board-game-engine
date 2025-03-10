export default {
  presets: [
    "@babel/preset-typescript",
    ["@babel/preset-env", { targets: { node: "current" } }],
  ],
  plugins: ["@babel/plugin-transform-runtime"],
};
