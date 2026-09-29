import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Images are resized by Hygraph's CDN, not `next/image`.
      "@next/next/no-img-element": "off",
      // Existing violations; raised back to errors once fixed.
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
    },
  },
  globalIgnores([".next/**", "next-env.d.ts", "coverage/**", "playwright-report/**", "test-results/**"]),
]);
