import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";

import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintReact from "@eslint-react/eslint-plugin";
import perfectionist from "eslint-plugin-perfectionist";
import sort from "eslint-plugin-sort";
import react from "eslint-plugin-react";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
      parserOptions: {
        project: path.resolve(__dirname, "./tsconfig.app.json"),
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "@typescript-eslint": tsPlugin,
      "simple-import-sort": simpleImportSort,
      "@eslint-react": eslintReact,
      perfectionist,
      sort,
      react,
    },
    rules: {
      curly: ["error", "all"],
      semi: ["error", "always"],
      "no-else-return": "error",
      "no-console": "warn",
      "no-debugger": "warn",
      //"func-style": ["error", "expression"],
      //"func-style": ["error", "declaration", { allowArrowFunctions: false }],

      "perfectionist/sort-variable-declarations": [
        "error",
        {
          type: "alphabetical", // O "line-length" si prefieres que ordene de la más corta a la más larga
          order: "asc",
        },
      ],
      "perfectionist/sort-imports": "error",
      "perfectionist/sort-interfaces": [
        "error",
        {
          type: "natural", // Orden alfabético
          order: "asc", // Orden ascendente
          partitionByComment: false,
          groups: [
            "required-property", // Propiedades requeridas
            "optional-property", // Propiedades opcionales
            "method", // Métodos
            "index-signature", // Firmas de índice
            "unknown", // Otros elementos
          ],
        },
      ],

      "perfectionist/sort-classes": [
        "error",
        {
          type: "alphabetical", // Orden alfabético
          order: "asc", // Orden ascendente
          groups: [
            "static-property", // Propiedades estáticas
            "instance-property", // Propiedades de instancia
            "constructor", // Constructor
            "static-method", // Métodos estáticos
            "instance-method", // Métodos de instancia
          ],
        },
      ],
      "perfectionist/sort-jsx-props": [
        "error",
        {
          type: "natural", // or 'alphabetical', 'line-length', 'custom'
          order: "asc",
        },
      ],

      "react/react-in-jsx-scope": "off", // JSX moderno, pero no aplica si usás preserve
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all", // Marca error si hay variables no usadas
          args: "after-used", // Marca error si hay argumentos no usados en implementaciones
          argsIgnorePattern: "^_", // Ignora parámetros que comiencen con "_"
          ignoreRestSiblings: true,
        },
      ],

      "react/destructuring-assignment": ["error", "always", { destructureInSignature: "ignore" }],
      "prefer-destructuring": [
        "error",
        {
          VariableDeclarator: { array: true, object: true },
          AssignmentExpression: { array: true, object: true },
        },
        {
          enforceForRenamedProperties: false,
        },
      ],

      "no-restricted-syntax": [
        "error",
        {
          selector: "FunctionDeclaration > ObjectPattern",
          message: "Avoid destructuring in function signature; accept props and destructure inside the body.",
        },
        {
          selector: "FunctionExpression > ObjectPattern",
          message: "Avoid destructuring in function signature; accept props and destructure inside the body.",
        },
        {
          selector: "ArrowFunctionExpression > ObjectPattern",
          message: "Avoid destructuring in function signature; accept props and destructure inside the body.",
        },
      ],

      "@typescript-eslint/member-ordering": [
        "error",
        {
          default: {
            memberTypes: [
              "private-static-field",
              "public-static-field",
              "protected-static-field",
              "private-instance-field",
              "public-instance-field",
              "protected-instance-field",
              "constructor",
              "public-method",
              "protected-method",
              "private-method",
              "public-get",
              "protected-get",
              "private-get",
            ],
            order: "alphabetically",
          },
        },
      ],
      //"simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@eslint-react/no-missing-key": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/typedef": [
        "error",
        {
          arrayDestructuring: false,
          objectDestructuring: false,
          variableDeclaration: true,
          variableDeclarationIgnoreFunction: false,
          parameter: false,
          propertyDeclaration: false,
        },
      ],
    },
  },
]);
