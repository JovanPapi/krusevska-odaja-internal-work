import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import js from "@eslint/js";
import importConfig from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import prettier from "eslint-plugin-prettier";

export default defineConfig([
  globalIgnores(["dist/", "node_modules/"]),
  {
    basePath: "src",

    files: ["**/*.{ts,tsx,js,jsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      globals: globals.browser,
    },

    extends: [
      tseslint.configs.recommended,
      js.configs.recommended,
      importConfig.flatConfigs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.recommended,
    ],

    plugins: {
      prettier: prettier,
    },

    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
        node: {
          extension: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },

    rules: {
      "prettier/prettier": "warn",

      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      camelcase: "error",

      eqeqeq: ["error", "always"],
      curly: ["off", "all"],
      "no-console": "warn",

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "off",

      "react-refresh/only-export-components": "off",

      "import/order": [
        "error",
        {
          groups: [["builtin", "external", "internal", "parent", "sibling", "index"]],
          "newlines-between": "ignore",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
]);
