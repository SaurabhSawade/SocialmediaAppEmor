// eslint.config.js

const prettierPlugin = require("eslint-plugin-prettier");

module.exports = [
  {
    // Files/folders to ignore
    ignores: ["node_modules", "dist", "public", "log-files"],

    // Files to lint
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: 2020, // modern JS
      sourceType: "module", // use 'commonjs' if you use require()
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      // Enforce Prettier formatting
      "prettier/prettier": "error",

      // JS code style rules
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      semi: ["error", "always"],
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": "off", // allow console.log in Node.js
    },
  },
];
