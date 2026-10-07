import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Generated / vendor assets.
    "public/mediapipe/wasm/**",

    // Project backups / archived implementation files.
    ".backup/**",
    "**/*.backup",
  ]),

  {
    rules: {
      /*
       * These React Compiler rules are intentionally disabled for now.
       *
       * Nexa Utility uses localStorage/IndexedDB hydration and browser API
       * synchronization in several hooks. Those patterns are valid for this
       * application architecture and will be refactored later as part of the
       * unified storage/state architecture.
       */
      "react-hooks/set-state-in-effect": "off",

      /*
       * These rules are useful for compiler-oriented code, but the current
       * application contains browser APIs, dynamic Lucide icons and imperative
       * utility integrations that do not need to be rewritten merely to satisfy
       * the compiler lint rules.
       */
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react-hooks/static-components": "off",
    },
  },

  /*
   * These components intentionally use native <img> elements because they
   * render dynamic camera captures, data URLs, blob URLs, or local previews.
   *
   * next/image is not appropriate for these dynamic browser-generated sources.
   */
  {
    files: [
      "src/features/camera/components/PhotoGallery.tsx",
      "src/features/camera/document/components/ScanResult.tsx",
      "src/features/files/components/FilePreview.tsx",
      "src/features/photos/components/PhotoGrid.tsx",
      "src/features/photos/components/PhotoViewer.tsx",
      "src/features/scanner/ocr/components/OCRPage.tsx",
    ],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
