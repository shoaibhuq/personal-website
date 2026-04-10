// Vercel serverless function for the Trash Toss high score.
// Uses Upstash Redis via the REST API when KV_REST_API_URL /
// KV_REST_API_TOKEN are set (these are the same env vars Vercel KV injects).
// Falls back to an in-memory counter so local dev and unconfigured
// deployments still work — just without cross-user persistence.
//
// GET  /api/highscore                 -> { highScore: number }
// POST /api/highscore  { score }      -> { highScore: number, updated: boolean }

import type { VercelRequest, VercelResponse } from "@vercel/node";

const KEY = "trash-toss:highscore";

// In-memory fallback — shared across requests within a single serverless
// instance, which is enough for a casual portfolio game.
let memoryHighScore = 0;

async function kvGet(): Promise<number | null> {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
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
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("cache-control", "no-store");

  if (req.method === "GET") {
    const highScore = await readHighScore();
    res.status(200).json({ highScore });
    return;
  }

  if (req.method === "POST") {
    // Vercel's Node runtime auto-parses JSON bodies when the content-type is
    // application/json, exposing the result on req.body.
    const body = (req.body ?? {}) as { score?: unknown };
    const raw =
      typeof body.score === "number"
        ? body.score
        : typeof body.score === "string"
        ? parseFloat(body.score)
        : NaN;
    const score = Math.floor(raw);
    if (!Number.isFinite(score) || score < 0 || score > 1_000_000) {
      res.status(400).json({ error: "invalid score" });
      return;
    }
    const before = await readHighScore();
    const highScore = await writeHighScore(score);
    res.status(200).json({ highScore, updated: highScore > before });
    return;
  }

  res.status(405).json({ error: "method not allowed" });
}
