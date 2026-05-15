import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * `@turbodocx/html-to-docx` ships:
 * - `html-to-docx.browser.js` — browser-safe IIFE ending in `var HTMLToDOCX = …`, but no ESM export
 *   (Vite's dep optimizer then produced a chunk with no `default`, breaking `import X from …`).
 * - `html-to-docx.esm.js` — real default export but imports Node builtins (`events`, `fs`, …) → breaks browser build.
 *
 * We load the browser bundle and append `export default HTMLToDOCX` so both dev and prod get a proper default.
 */
function turbodocxBrowserDefaultExport(): Plugin {
  const virtualId = "\0virtual:turbodocx-html-to-docx";
  const browserPath = path.join(
    __dirname,
    "node_modules/@turbodocx/html-to-docx/dist/html-to-docx.browser.js",
  );

  return {
    name: "turbodocx-browser-default-export",
    enforce: "pre", // run before Vite's built-in resolvers / dep-optimizer rewrite
    resolveId(id) {
      if (id === "@turbodocx/html-to-docx") {
        return virtualId;
      }
      return undefined;
    },
    load(id) {
      if (id !== virtualId) return undefined;
      const code = fs.readFileSync(browserPath, "utf-8");
      if (!code.includes("var HTMLToDOCX")) {
        throw new Error(
          "turbodocx: expected `var HTMLToDOCX` in html-to-docx.browser.js — upstream format may have changed.",
        );
      }
      /**
       * The IIFE references bare `global.Buffer` / `global.Blob` for its return-value
       * branch. In an ESM module scope `global` is not defined → "ReferenceError: global is
       * not defined" the moment the function runs. Aliasing it to `globalThis` lets the
       * Blob branch resolve correctly in browsers.
       */
      const prelude = "var global = globalThis;\n";
      return `${prelude}${code}\nexport default HTMLToDOCX;\n`;
    },
  };
}
const atlasBundleInstalled = fs.existsSync(
  path.join(__dirname, "node_modules/@diligentcorp/atlas-react-bundle/package.json"),
);

export default defineConfig({
  plugins: [turbodocxBrowserDefaultExport(), react()],
  /**
   * Without this, Vite's dep optimizer pre-bundles `@turbodocx/html-to-docx` straight from
   * `node_modules` (browser IIFE, no exports). Our plugin's virtual module — which appends
   * `export default HTMLToDOCX` — is never used for that chunk, so dev loads a file with no default.
   */
  optimizeDeps: {
    exclude: ["@turbodocx/html-to-docx"],
  },
  // If HMR feels stuck after installing/removing deps (e.g. @diligentcorp/atlas-react-bundle), restart
  // the dev server — vite.config.ts is only read at startup and the icon alias depends on node_modules.
  server: {
    // Reduce stale UI in Chrome when toggling between dev sessions (dev only; production uses build output)
    headers: {
      "Cache-Control": "no-store",
    },
    // On some setups (Docker, network drives, WSL) file watchers miss saves; try: VITE_USE_POLLING=1 npm run dev
    watch:
      process.env.VITE_USE_POLLING === "1"
        ? { usePolling: true, interval: 100 }
        : undefined,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      ...(atlasBundleInstalled
        ? {}
        : {
            "@diligentcorp/atlas-react-bundle/icons": path.resolve(__dirname, "./src/icons/muiProxy"),
          }),
    },
  },
});
