import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintConfigPrettier from "eslint-config-prettier";

const tsconfigRootDir = new URL(".", import.meta.url).pathname;
const tsTypeCheckedRules =
  tseslint.configs["recommended-type-checked"]?.rules ?? {};
const reactRecommendedRules = reactPlugin.configs.recommended?.rules ?? {};
const reactHooksRules = reactHooks.configs.recommended?.rules ?? {};
const jsxA11yRules = jsxA11y.configs.recommended?.rules ?? {};

export default [
  {
    ignores: ["dist", "node_modules"]
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    }
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsTypeCheckedRules,
      ...reactRecommendedRules,
      ...reactHooksRules,
      ...jsxA11yRules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unknown-property": ["error", { ignore: ["css"] }],
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-floating-promises": "error"
    }
  },
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactRecommendedRules,
      ...reactHooksRules,
      ...jsxA11yRules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unknown-property": ["error", { ignore: ["css"] }],
      "react-hooks/set-state-in-effect": "off"
    }
  },
  eslintConfigPrettier
];
