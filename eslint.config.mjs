import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import storybook from "eslint-plugin-storybook";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    name: "jsx-a11y/recommended-rules",
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  ...storybook.configs["flat/recommended"],
];

export default eslintConfig;
