import next from "@next/eslint-plugin-next";

export default [
  {
    files: ["app/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ignores: [".next/**", "out/**", "node_modules/**"],
    plugins: { next },
    rules: {
      ...next.configs["core-web-vitals"].rules,
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
