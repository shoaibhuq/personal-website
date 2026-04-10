import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// In-dev stand-in for the /api/highscore Vercel serverless function. Reads
// and updates a single integer stored in the module closure so hitting
// /api/highscore during `vite dev` behaves like a real backend (minus
// cross-process persistence, which is fine for a local game prototype).
function devHighScoreApi(): Plugin {
  let memoryHighScore = 0;
  return {
    name: "dev-high-score-api",
    configureServer(server) {
      server.middlewares.use("/api/highscore", (req, res) => {
        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader("content-type", "application/json");
          res.setHeader("cache-control", "no-store");
          res.end(JSON.stringify(body));
        };

        if (req.method === "GET") {
          return send(200, { highScore: memoryHighScore });
        }

        if (req.method === "POST") {
          let raw = "";
          req.on("data", (chunk) => {
            raw += chunk;
          });
          req.on("end", () => {
            try {
              const parsed = JSON.parse(raw || "{}") as { score?: unknown };
              const score =
                typeof parsed.score === "number" ? Math.floor(parsed.score) : 0;
              if (!Number.isFinite(score) || score < 0 || score > 1_000_000) {
                return send(400, { error: "invalid score" });
              }
              const before = memoryHighScore;
              if (score > memoryHighScore) memoryHighScore = score;
              return send(200, {
                highScore: memoryHighScore,
                updated: memoryHighScore > before,
              });
            } catch {
              return send(400, { error: "invalid body" });
            }
          });
          return;
        }

        return send(405, { error: "method not allowed" });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env files from the project root. Passing "" as the third arg loads
  // ALL env vars, not just ones prefixed with VITE_ — this lets us expose
  // plainly-named variables like GOOGLE_MAPS_API_KEY to the client via
  // `define` without requiring the VITE_ prefix in the user's .env.
  //
  // IMPORTANT: loadEnv ONLY reads .env* files on disk. It does NOT read
  // from process.env, so Vercel-injected build-time env vars (configured
  // in the Vercel dashboard) are invisible to loadEnv. Fall back to
  // process.env so the same config works locally (.env) and on Vercel
  // (dashboard env vars) without any duplication.
  const env = loadEnv(mode, process.cwd(), "");
  const googleMapsApiKey =
    env.GOOGLE_MAPS_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY ?? "";

  return {
    assetsInclude: ["**/*.svg"],
    plugins: [react(), devHighScoreApi()],
    root: "./",
    define: {
      __GOOGLE_MAPS_API_KEY__: JSON.stringify(googleMapsApiKey),
    },
  };
});
