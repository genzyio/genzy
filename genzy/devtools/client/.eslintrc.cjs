module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["**/core/**"],
            message: "Shouldn't reference core by relative path. Use alias '@core' instead.",
          },
          {
            group: ["@core/components/dropdown/**"],
            message:
              "Shouldn't reference dropdown components by relative path. Use default import instead.",
          },
          {
            group: ["@core/components/tabs/**"],
            message:
              "Shouldn't reference tabs components by relative path. Use default import instead.",
          },
          {
            group: ["@core/components/form/**"],
            message:
              "Shouldn't reference form components by relative path. Use default import instead.",
          },
          {
            group: ["**/features/**"],
            message: "Shouldn't reference core by relative path. Use alias '@features' instead.",
          },
          {
            group: ["../**/diagrams/**"],
            message:
              "Shouldn't reference core by relative path. Use alias '@features/diagrams' instead.",
          },
          {
            group: ["../**/plugins/**"],
            message:
              "Shouldn't reference core by relative path. Use alias '@features/plugins' instead.",
          },
          {
            group: ["../**/project-workspace/**"],
            message:
              "Shouldn't reference core by relative path. Use alias '@features/project-workspace' instead.",
          },
          {
            group: ["../**/projects/**"],
            message:
              "Shouldn't reference core by relative path. Use alias '@features/projects' instead.",
          },
        ],
      },
    ],
  },
};
