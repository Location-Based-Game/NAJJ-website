module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "linebreak-style": "off",
    "indent": "off",
    "object-curly-spacing": "off",
    "semi": "off",
    "comma-dangle": "off",
    "eol-last": "off",
    "require-jsdoc": "off",
    "spaced-comment": "off",
    "max-len": "off",
    "no-trailing-spaces": "off",
    "no-prototype-builtins": "off"
  },
};
