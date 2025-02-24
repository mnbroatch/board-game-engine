import path from "path";
import globals from "globals";
import json from "eslint-plugin-json";
import react from "eslint-plugin-react";
import js from "@eslint/js";
import love from "eslint-config-love";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";

const __dirname = path.resolve();

export default [
  {
    ...love,
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
  },
  js.configs.recommended,
  json.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  prettier,
  {
    files: ["**/*.ts", "**/*.js", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: path.join(__dirname, "tsconfig.json"),
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
      },
    },
    plugins: {
      react,
      love,
    },
    rules: {
      "operator-linebreak": ["error", "before"],
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      "@typescript-eslint/no-magic-numbers": [
        "warn",
        {
          ignore: [0, 1],
        },
      ],
    },
  },
  {
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
];
