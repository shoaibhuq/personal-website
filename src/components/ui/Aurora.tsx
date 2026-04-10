import { motion } from "motion/react";

interface AuroraProps {
  className?: string;
}

/**
 * Pure-CSS aurora effect inspired by React Bits Aurora.
 * Uses animated radial gradients instead of WebGL to avoid
 * adding the `ogl` dependency.
 */
export default function Aurora({ className = "" }: AuroraProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Base dark wash so the blobs read against any background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

      {/* Drifting aurora ribbons */}
      <motion.div
        className="absolute -top-1/3 left-1/2 h-[120%] w-[140%] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 40%, rgba(139, 92, 246, 0.45), transparent 60%), radial-gradient(55% 45% at 70% 55%, rgba(236, 72, 153, 0.35), transparent 65%), radial-gradient(50% 40% at 45% 70%, rgba(168, 85, 247, 0.30), transparent 60%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: ["-6%", "6%", "-6%"],
          y: ["-3%", "3%", "-3%"],
          rotate: [0, 2, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary counter-drift */}
      <motion.div
        className="absolute top-1/4 -right-1/4 h-[90%] w-[80%]"
        style={{
          background:
            "radial-gradient(55% 50% at 50% 50%, rgba(244, 114, 182, 0.35), transparent 65%)",
          filter: "blur(70px)",
        }}
        animate={{
          x: ["4%", "-4%", "4%"],
          y: ["2%", "-6%", "2%"],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle grain overlay via SVG */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="aurora-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#aurora-noise)" />
      </svg>
    </div>
  );
}
