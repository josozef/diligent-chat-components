import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const atlasBundleInstalled = fs.existsSync(
  path.join(__dirname, "node_modules/@diligentcorp/atlas-react-bundle/package.json"),
);

export default defineConfig({
  plugins: [react()],
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
