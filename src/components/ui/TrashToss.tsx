import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Trophy, X, RotateCcw, Play } from "lucide-react";

/* ------------------------------------------------------------------ */
/* World + physics constants                                          */
/* ------------------------------------------------------------------ */

// The whole game lives in a fixed SVG viewBox so physics math is
// resolution-independent — we do not care about the CSS pixel size of the
// SVG, we only reason about world units.
const WORLD_W = 1000;
const WORLD_H = 260;
const GROUND_Y = 220; // y of top-of-ground surface

// Player (paper-ball spawn point) sits on the left on the ground.
const PLAYER_X = 110;
const PLAYER_Y = GROUND_Y - 16;

// Paper ball radius.
const BALL_R = 12;

// Trash can dimensions (rectangle) — top line is the opening.
const CAN_W = 82;
const CAN_H = 86;
const CAN_MIN_X = 520;
const CAN_MAX_X = WORLD_W - CAN_W - 40;

const GRAVITY = 1400; // world units / s^2
const POWER_MULT = 4.0; // drag length → launch speed
const MAX_LAUNCH_SPEED = 1700;
const BOUNCE = 0.42; // vertical energy retained per bounce
const H_FRICTION = 0.7; // horizontal speed retained per bounce
const ROLL_FRICTION = 0.985; // per-frame horizontal damping when rolling
const SETTLE_SPEED = 16; // below this total speed → stop simulating a missed ball
const MAX_SETTLED = 40; // cap ground-litter so the DOM stays cheap

const LS_KEY = "trash-toss:localHigh";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type LiveBall = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  spin: number; // deg/s
  scored: boolean; // already counted (prevents double-score on overlap)
};

type SettledBall = {
  id: number;
  x: number;
  y: number;
  rotation: number;
};

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const randInt = (min: number, max: number) =>
  Math.floor(min + Math.random() * (max - min + 1));

const pickCanX = (prev: number) => {
  // Avoid the can teleporting to within 120 units of its previous spot so
  // consecutive shots feel different.
  let next = randInt(CAN_MIN_X, CAN_MAX_X);
  let attempts = 0;
  while (Math.abs(next - prev) < 120 && attempts < 10) {
    next = randInt(CAN_MIN_X, CAN_MAX_X);
    attempts++;
  }
  return next;
};

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function TrashToss() {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const saved = window.localStorage.getItem(LS_KEY);
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [canX, setCanX] = useState(() => randInt(CAN_MIN_X, CAN_MAX_X));

  const svgRef = useRef<SVGSVGElement | null>(null);
  const liveBallsRef = useRef<LiveBall[]>([]);
  const settledBallsRef = useRef<SettledBall[]>([]);
  const nextIdRef = useRef(1);
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const canXRef = useRef(canX);
  useEffect(() => {
    canXRef.current = canX;
  }, [canX]);

  // Dragging state — tracked in refs so the RAF loop does not re-render.
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  }>({ active: false, startX: 0, startY: 0, currentX: 0, currentY: 0 });
  const [, forceRender] = useReducer((n: number) => n + 1, 0);

  /* ---------------- high-score bootstrap + persistence --------------- */

  useEffect(() => {
    let cancelled = false;
    fetch("/api/highscore", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const remote = typeof data.highScore === "number" ? data.highScore : 0;
        setHighScore((local) => Math.max(local, remote));
      })
      .catch(() => {
        /* no-op: fall back to localStorage */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const postHighScore = useCallback((value: number) => {
    fetch("/api/highscore", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ score: value }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data || typeof data.highScore !== "number") return;
        setHighScore((cur) => Math.max(cur, data.highScore));
      })
      .catch(() => {
        /* no-op */
      });
  }, []);

  const bumpHighScore = useCallback(
    (newScore: number) => {
      setHighScore((prev) => {
        if (newScore <= prev) return prev;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(LS_KEY, String(newScore));
        }
        postHighScore(newScore);
        return newScore;
      });
    },
    [postHighScore]
  );

  /* ---------------- game loop ---------------- */

  const step = useCallback(
    (now: number) => {
      const last = lastTimeRef.current ?? now;
      const dt = Math.min(0.033, (now - last) / 1000); // cap at 30ms to avoid warps
      lastTimeRef.current = now;

      const live = liveBallsRef.current;
      const settled = settledBallsRef.current;
      const currentCanX = canXRef.current;
      const canTopY = GROUND_Y - CAN_H;
      const openingLeft = currentCanX + 6;
      const openingRight = currentCanX + CAN_W - 6;

      let didScore = false;
      const stillLive: LiveBall[] = [];
      const canLeft = currentCanX;
      const canRight = currentCanX + CAN_W;

      for (const b of live) {
        // Integrate.
        const prevX = b.x;
        const prevY = b.y;
        b.vy += GRAVITY * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.rotation += b.spin * dt;

        // Did the ball cross the rim line downward this frame?
        const crossedRim =
          !b.scored && b.vy > 0 && prevY <= canTopY && b.y + BALL_R >= canTopY;

        if (crossedRim) {
          if (b.x > openingLeft && b.x < openingRight) {
            // Fell into the opening — score and remove.
            b.scored = true;
            didScore = true;
            continue;
          }
          // Hit the rim (left or right edge). Bounce the ball off the top.
          b.y = canTopY - BALL_R;
          b.vy = -Math.abs(b.vy) * 0.35;
          b.vx *= 0.55;
          b.spin *= 0.5;
        }

        // Side-wall collisions — if the ball enters the can body from the
        // side (e.g. a hard horizontal throw that doesn't arc), bounce it.
        if (
          b.y + BALL_R > canTopY &&
          b.y - BALL_R < GROUND_Y &&
          b.x + BALL_R > canLeft &&
          b.x - BALL_R < canRight
        ) {
          if (prevX + BALL_R <= canLeft) {
            // Came from the left, hitting left wall.
            b.x = canLeft - BALL_R;
            b.vx = -Math.abs(b.vx) * 0.45;
          } else if (prevX - BALL_R >= canRight) {
            // Came from the right, hitting right wall.
            b.x = canRight + BALL_R;
            b.vx = Math.abs(b.vx) * 0.45;
          }
        }

        // Walls of the arena.
        if (b.x - BALL_R < 0) {
          b.x = BALL_R;
          b.vx = -b.vx * 0.5;
        } else if (b.x + BALL_R > WORLD_W) {
          b.x = WORLD_W - BALL_R;
          b.vx = -b.vx * 0.5;
        }

        // Ground collision.
        if (b.y + BALL_R > GROUND_Y) {
          b.y = GROUND_Y - BALL_R;
          if (Math.abs(b.vy) > 55) {
            b.vy = -b.vy * BOUNCE;
            b.vx *= H_FRICTION;
            b.spin *= 0.6;
          } else {
            // Rolling phase.
            b.vy = 0;
            b.vx *= ROLL_FRICTION;
            b.spin = b.vx * 4;
          }
        }

        // Settle check.
        const totalSpeed = Math.abs(b.vx) + Math.abs(b.vy);
        if (b.y + BALL_R >= GROUND_Y - 1 && totalSpeed < SETTLE_SPEED) {
          settled.push({
            id: b.id,
            x: b.x,
            y: GROUND_Y - BALL_R,
            rotation: b.rotation,
          });
          continue;
        }

        // Remove ball if it falls way off-screen (shouldn't happen but just
        // in case).
        if (b.y > WORLD_H + 200) continue;

        stillLive.push(b);
      }

      // Cap settled balls.
      while (settled.length > MAX_SETTLED) settled.shift();

      liveBallsRef.current = stillLive;
      settledBallsRef.current = settled;

      if (didScore) {
        setScore((prev) => {
          const next = prev + 1;
          bumpHighScore(next);
          return next;
        });
        setCanX((prev) => pickCanX(prev));
      }

      forceRender();
      rafRef.current = requestAnimationFrame(step);
    },
    [bumpHighScore]
  );

  useEffect(() => {
    if (!open) return;
    lastTimeRef.current = null;
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [open, step]);

  /* ---------------- pointer handlers (aim & fire) ---------------- */

  const toWorld = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * WORLD_W;
    const y = ((clientY - rect.top) / rect.height) * WORLD_H;
    return { x, y };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const { x, y } = toWorld(e.clientX, e.clientY);
      dragRef.current = {
        active: true,
        startX: x,
        startY: y,
        currentX: x,
        currentY: y,
      };
      (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
      forceRender();
    },
    [toWorld]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragRef.current.active) return;
      const { x, y } = toWorld(e.clientX, e.clientY);
      dragRef.current.currentX = x;
      dragRef.current.currentY = y;
      forceRender();
    },
    [toWorld]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const d = dragRef.current;
      if (!d.active) return;
      dragRef.current = {
        active: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
      };
      try {
        (e.currentTarget as SVGSVGElement).releasePointerCapture(e.pointerId);
      } catch {
        /* no-op */
      }

      // Drag vector = (start - current). Longer drag = more power. We
      // launch *away* from the drag direction (pull back to shoot).
      const dx = d.startX - d.currentX;
      const dy = d.startY - d.currentY;
      const len = Math.hypot(dx, dy);
      if (len < 8) {
        forceRender();
        return;
      }

      const speed = Math.min(MAX_LAUNCH_SPEED, len * POWER_MULT);
      const nx = dx / len;
      const ny = dy / len;

      const ball: LiveBall = {
        id: nextIdRef.current++,
        x: PLAYER_X,
        y: PLAYER_Y,
        vx: nx * speed,
        vy: ny * speed,
        rotation: 0,
        spin: (Math.random() - 0.5) * 400 + nx * 200,
        scored: false,
      };
      liveBallsRef.current.push(ball);
      forceRender();
    },
    []
  );

  /* ---------------- derived: trajectory preview ---------------- */

  // Recomputed on every render, which is fine because forceRender() is
  // called from the pointer handlers and the RAF loop.
  const buildTrajectoryPath = (): string => {
    const d = dragRef.current;
    if (!d.active) return "";
    const dx = d.startX - d.currentX;
    const dy = d.startY - d.currentY;
    const len = Math.hypot(dx, dy);
    if (len < 8) return "";
    const speed = Math.min(MAX_LAUNCH_SPEED, len * POWER_MULT);
    const vx = (dx / len) * speed;
    const vy = (dy / len) * speed;

    // Simulate forward ~1.4s to draw a dotted arc.
    const steps = 28;
    const dt = 1.4 / steps;
    let x = PLAYER_X;
    let y = PLAYER_Y;
    let vvx = vx;
    let vvy = vy;
    const pts: string[] = [`M ${x} ${y}`];
    for (let i = 0; i < steps; i++) {
      vvy += GRAVITY * dt;
      x += vvx * dt;
      y += vvy * dt;
      if (y > GROUND_Y || x < 0 || x > WORLD_W) break;
      pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };

  const trajectoryPath = buildTrajectoryPath();

  /* ---------------- render ---------------- */

  const reset = () => {
    setScore(0);
    liveBallsRef.current = [];
    settledBallsRef.current = [];
    setCanX((prev) => pickCanX(prev));
  };

  const liveBalls = liveBallsRef.current;
  const settledBalls = settledBallsRef.current;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="panel"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="pointer-events-auto w-full max-w-4xl mx-2 sm:mx-4 mb-2 sm:mb-4 rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden"
            style={{
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10">
              <div className="flex items-center gap-3 sm:gap-5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-semibold">
                    Score
                  </span>
                  <span className="text-xl font-bold text-white tabular-nums">
                    {score}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-semibold">
                    High
                  </span>
                  <span className="text-xl font-bold text-amber-300 tabular-nums">
                    {highScore}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Reset game"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close game"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Instruction strip */}
            <div className="px-4 sm:px-5 pt-2 pb-1 text-[11px] text-neutral-400">
              Drag anywhere to aim &amp; set power — release to throw
            </div>

            {/* Play area */}
            <div className="px-2 sm:px-3 pb-3">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
                className="w-full h-44 sm:h-52 md:h-60 touch-none select-none"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="tt-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0b1226" />
                    <stop offset="100%" stopColor="#141028" />
                  </linearGradient>
                  <linearGradient id="tt-ground" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1f1b35" />
                    <stop offset="100%" stopColor="#0a0814" />
                  </linearGradient>
                  <linearGradient id="tt-player" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="tt-can" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#be185d" />
                  </linearGradient>
                </defs>

                {/* Sky */}
                <rect
                  x={0}
                  y={0}
                  width={WORLD_W}
                  height={WORLD_H}
                  fill="url(#tt-sky)"
                />

                {/* Stars / ambient dots */}
                {Array.from({ length: 14 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={(i * 73) % WORLD_W}
                    cy={(i * 29) % (GROUND_Y - 30)}
                    r={0.8}
                    fill="white"
                    opacity={0.25}
                  />
                ))}

                {/* Ground */}
                <rect
                  x={0}
                  y={GROUND_Y}
                  width={WORLD_W}
                  height={WORLD_H - GROUND_Y}
                  fill="url(#tt-ground)"
                />
                <line
                  x1={0}
                  y1={GROUND_Y}
                  x2={WORLD_W}
                  y2={GROUND_Y}
                  stroke="#34d399"
                  strokeWidth={1}
                  opacity={0.5}
                />

                {/* Trash can (animated target) */}
                <motion.g
                  animate={{ x: canX }}
                  initial={false}
                  transition={{ type: "spring", stiffness: 200, damping: 22 }}
                >
                  {/* Can glow */}
                  <ellipse
                    cx={CAN_W / 2}
                    cy={GROUND_Y}
                    rx={CAN_W / 1.4}
                    ry={6}
                    fill="#f472b6"
                    opacity={0.25}
                  />
                  {/* Can body */}
                  <rect
                    x={2}
                    y={GROUND_Y - CAN_H + 6}
                    width={CAN_W - 4}
                    height={CAN_H - 6}
                    fill="url(#tt-can)"
                    rx={3}
                    opacity={0.15}
                  />
                  <rect
                    x={2}
                    y={GROUND_Y - CAN_H + 6}
                    width={CAN_W - 4}
                    height={CAN_H - 6}
                    fill="none"
                    stroke="url(#tt-can)"
                    strokeWidth={2.5}
                    rx={3}
                  />
                  {/* Can rim (opening) */}
                  <line
                    x1={0}
                    y1={GROUND_Y - CAN_H}
                    x2={CAN_W}
                    y2={GROUND_Y - CAN_H}
                    stroke="#f472b6"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                  {/* Rim caps */}
                  <circle cx={4} cy={GROUND_Y - CAN_H} r={3} fill="#f472b6" />
                  <circle
                    cx={CAN_W - 4}
                    cy={GROUND_Y - CAN_H}
                    r={3}
                    fill="#f472b6"
                  />
                  {/* Vertical lines hint */}
                  <line
                    x1={CAN_W * 0.35}
                    y1={GROUND_Y - CAN_H + 14}
                    x2={CAN_W * 0.35}
                    y2={GROUND_Y - 6}
                    stroke="#f472b6"
                    strokeWidth={1}
                    opacity={0.4}
                  />
                  <line
                    x1={CAN_W * 0.65}
                    y1={GROUND_Y - CAN_H + 14}
                    x2={CAN_W * 0.65}
                    y2={GROUND_Y - 6}
                    stroke="#f472b6"
                    strokeWidth={1}
                    opacity={0.4}
                  />
                </motion.g>

                {/* Player (thrower) */}
                <g>
                  <ellipse
                    cx={PLAYER_X}
                    cy={GROUND_Y}
                    rx={22}
                    ry={4}
                    fill="#34d399"
                    opacity={0.25}
                  />
                  <line
                    x1={PLAYER_X}
                    y1={GROUND_Y}
                    x2={PLAYER_X}
                    y2={GROUND_Y - 30}
                    stroke="url(#tt-player)"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                  <circle
                    cx={PLAYER_X}
                    cy={GROUND_Y - 40}
                    r={9}
                    fill="none"
                    stroke="url(#tt-player)"
                    strokeWidth={3}
                  />
                </g>

                {/* Settled (missed) paper balls on the ground */}
                {settledBalls.map((b) => (
                  <g
                    key={`s-${b.id}`}
                    transform={`translate(${b.x} ${b.y}) rotate(${b.rotation})`}
                  >
                    <circle
                      r={BALL_R}
                      fill="#f8fafc"
                      opacity={0.9}
                      stroke="#cbd5e1"
                      strokeWidth={1}
                    />
                    <path
                      d={`M ${-BALL_R * 0.4} ${-BALL_R * 0.2} L ${
                        BALL_R * 0.3
                      } ${BALL_R * 0.3}`}
                      stroke="#94a3b8"
                      strokeWidth={1}
                      fill="none"
                    />
                  </g>
                ))}

                {/* Live paper balls (in flight) */}
                {liveBalls.map((b) => (
                  <g
                    key={`l-${b.id}`}
                    transform={`translate(${b.x} ${b.y}) rotate(${b.rotation})`}
                  >
                    <circle
                      r={BALL_R}
                      fill="#ffffff"
                      stroke="#e2e8f0"
                      strokeWidth={1}
                    />
                    <path
                      d={`M ${-BALL_R * 0.5} ${-BALL_R * 0.2} Q 0 ${
                        -BALL_R * 0.6
                      } ${BALL_R * 0.4} ${BALL_R * 0.1}`}
                      stroke="#94a3b8"
                      strokeWidth={1}
                      fill="none"
                    />
                  </g>
                ))}

                {/* Trajectory preview while dragging */}
                {trajectoryPath && (
                  <path
                    d={trajectoryPath}
                    fill="none"
                    stroke="#34d399"
                    strokeWidth={2}
                    strokeDasharray="4 6"
                    strokeLinecap="round"
                    opacity={0.85}
                  />
                )}

                {/* Aim line (start → current drag pos) */}
                {dragRef.current.active && (
                  <line
                    x1={dragRef.current.startX}
                    y1={dragRef.current.startY}
                    x2={dragRef.current.currentX}
                    y2={dragRef.current.currentY}
                    stroke="#34d399"
                    strokeWidth={1.5}
                    opacity={0.6}
                    strokeDasharray="2 4"
                  />
                )}
              </svg>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="pill"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="pointer-events-auto mb-3 sm:mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-black/80 backdrop-blur-xl pl-3 pr-4 py-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:border-emerald-400/40 hover:bg-black/90 transition-colors"
            aria-label="Open Trash Toss mini-game"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/40">
              <Play className="h-3 w-3 text-emerald-300" />
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white">
              Trash Toss
            </span>
            <span className="inline-flex items-center gap-1 pl-2 border-l border-white/10">
              <Trophy className="h-3 w-3 text-amber-400" />
              <span className="text-[11px] font-bold text-amber-300 tabular-nums">
                {highScore}
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
