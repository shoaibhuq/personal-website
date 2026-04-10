// Vercel serverless function for the Trash Toss high score.
// Uses Upstash Redis via the REST API when KV_REST_API_URL /
// KV_REST_API_TOKEN are set (these are the same env vars Vercel KV injects).
// Falls back to an in-memory counter so local dev and unconfigured
// deployments still work — just without cross-user persistence.
//
// GET  /api/highscore                 -> { highScore: number }
// POST /api/highscore  { score }      -> { highScore: number, updated: boolean }

type Handler = (req: Request) => Promise<Response>;

const KEY = "trash-toss:highscore";

// In-memory fallback — shared across requests within a single serverless
// instance, which is enough for a casual portfolio game.
let memoryHighScore = 0;

const kvUrl = process.env.KV_REST_API_URL;
const kvToken = process.env.KV_REST_API_TOKEN;

async function kvGet(): Promise<number | null> {
  if (!kvUrl || !kvToken) return null;
  try {
    const res = await fetch(`${kvUrl}/get/${encodeURIComponent(KEY)}`, {
      headers: { Authorization: `Bearer ${kvToken}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result: string | null };
    const parsed = data.result == null ? 0 : parseInt(data.result, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return null;
  }
}

async function kvSet(value: number): Promise<boolean> {
  if (!kvUrl || !kvToken) return false;
  try {
    const res = await fetch(
      `${kvUrl}/set/${encodeURIComponent(KEY)}/${value}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${kvToken}` },
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

async function readHighScore(): Promise<number> {
  const fromKv = await kvGet();
  if (fromKv != null) {
    memoryHighScore = Math.max(memoryHighScore, fromKv);
    return fromKv;
  }
  return memoryHighScore;
}

async function writeHighScore(score: number): Promise<number> {
  const current = await readHighScore();
  if (score <= current) return current;
  memoryHighScore = score;
  await kvSet(score);
  return score;
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });

const handler: Handler = async (req) => {
  if (req.method === "GET") {
    const highScore = await readHighScore();
    return json({ highScore });
  }

  if (req.method === "POST") {
    let score = 0;
    try {
      const body = (await req.json()) as { score?: unknown };
      score = typeof body.score === "number" ? Math.floor(body.score) : 0;
    } catch {
      return json({ error: "invalid body" }, 400);
    }
    if (!Number.isFinite(score) || score < 0 || score > 1_000_000) {
      return json({ error: "invalid score" }, 400);
    }
    const before = await readHighScore();
    const highScore = await writeHighScore(score);
    return json({ highScore, updated: highScore > before });
  }

  return json({ error: "method not allowed" }, 405);
};

export default handler;

// Vercel's Node runtime also accepts the legacy (req, res) signature.
// Provide a compatible wrapper so this file works with either style.
export const config = { runtime: "edge" as const };
