import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env files from the project root. Passing "" as the third arg loads
  // ALL env vars, not just ones prefixed with VITE_ — this lets us expose
  // plainly-named variables like GOOGLE_MAPS_API_KEY to the client via
  // `define` without requiring the VITE_ prefix in the user's .env.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    assetsInclude: ["**/*.svg"],
    plugins: [react()],
    root: "./",
    define: {
      __GOOGLE_MAPS_API_KEY__: JSON.stringify(env.GOOGLE_MAPS_API_KEY ?? ""),
    },
  };
});
