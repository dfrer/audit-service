import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next";

export default defineConfig([
  globalIgnores([".next/**", "out/**", "node_modules/**"]),
  {
    files: ["./**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    plugins: { next },
    rules: {
      ...next.config.rules,
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    },
  },
]);
