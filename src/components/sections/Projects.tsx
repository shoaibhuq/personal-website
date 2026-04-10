import { useState } from "react";
import routoraMobile from "../../assets/Projects/routora.png";
import driverAdv from "../../assets/Projects/driver-adv.png";
import healthify from "../../assets/Projects/healthify.png";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Briefcase,
  Crown,
  FlaskConical,
  Dice5,
  Coffee,
  Dumbbell,
  ScanLine,
  LayoutGrid,
  Rows3,
} from "lucide-react";
import type { ComponentType } from "react";

import SpotlightCard from "../ui/SpotlightCard";
import ScrollStack, { ScrollStackItem } from "../ui/ScrollStack";

type Project = {
  id: number;
  name: string;
  href: string;
  type: string;
  description: string;
  imageUrl: string | null;
  placeholderIcon?: ComponentType<{ className?: string }>;
  placeholderGradient?: string;
  date: string;
  tags: string[];
};

const posts: Project[] = [
  {
    id: 1,
    name: "Routora Mobile App",
    href: "https://www.routora.com/app-install",
    type: "Mobile App",
    description:
      "Cross-platform mobile app that optimizes multi-stop routes. 25,000+ users in 70+ countries — including Amazon drivers, realtors, and small business owners — have saved over 1 million miles on the road.",
    imageUrl: routoraMobile,
    date: "Dec 2022 – Present",
    tags: ["React Native", "Firebase", "Google Maps"],
  },
  {
    id: 2,
    name: "Driver Advisor",
    href: "https://youtu.be/tX4mBHLCjjc",
    type: "Mobile App",
    description:
      "Mobile app that uses an in-house trained machine learning model to recognize and communicate street signs to drivers, making the road safer in real time.",
    imageUrl: driverAdv,
    date: "Nov 2022",
    tags: ["TensorFlow", "Flutter", "Computer Vision"],
  },
  {
    id: 3,
    name: "Healthify",
    href: "https://youtu.be/FmwPfB-qPRg?t=41",
    type: "Mobile App",
    description:
      "Healthcare mobile application that offers a more engaging take on telemedicine through augmented reality assistance.",
    imageUrl: healthify,
    date: "Nov 2023",
    tags: ["ARKit", "Swift", "HealthKit"],
  },
  {
    id: 4,
    name: "Wells Fargo — SWE",
    href: "https://www.linkedin.com/in/shoaibhuq/",
    type: "Professional",
    description:
      "Software engineering role at Wells Fargo — building and maintaining enterprise-grade services in a large-scale production environment.",
    imageUrl: null,
    placeholderIcon: Briefcase,
    placeholderGradient: "from-red-900/40 via-amber-900/30 to-yellow-800/20",
    date: "2024 – Present",
    tags: ["Java", "Spring", "AWS"],
  },
  {
    id: 5,
    name: "AR Chess @ UTD Plaza",
    href: "https://github.com/shoaibhuq",
    type: "AR Experience",
    description:
      "Life-size, three-dimensional augmented reality chess experience designed for the UTD chess plaza. Play on the real plaza with virtual pieces tracked in AR.",
    imageUrl: null,
    placeholderIcon: Crown,
    placeholderGradient:
      "from-indigo-900/40 via-purple-900/30 to-fuchsia-800/20",
    date: "2023",
    tags: ["Unity", "ARKit", "C#"],
  },
  {
    id: 6,
    name: "TI Unit Test Generator",
    href: "https://github.com/shoaibhuq",
    type: "Capstone · AI",
    description:
      "Texas Instruments capstone — a VS Code extension that generates unit tests for TI-specific C modules using LLM workflows. Built with LangChain + LangGraph, with careful thought on retrieval pipelines, classifier selection, evaluation, and reproducibility.",
    imageUrl: null,
    placeholderIcon: FlaskConical,
    placeholderGradient: "from-red-900/40 via-orange-900/30 to-amber-800/20",
    date: "2024 – 2025",
    tags: ["LangChain", "LangGraph", "VS Code", "LLMs", "C"],
  },
  {
    id: 7,
    name: "Restaurant Roulette",
    href: "https://github.com/shoaibhuq",
    type: "Mobile App",
    description:
      "A gamified way to pick where to eat — spin the wheel and discover restaurants based on your cuisine, price, distance, and rating preferences. Designed around product structure, API choice, and playful UX.",
    imageUrl: null,
    placeholderIcon: Dice5,
    placeholderGradient: "from-orange-900/40 via-rose-900/30 to-red-800/20",
    date: "Concept · In progress",
    tags: ["React Native", "Google Places", "Gamification"],
  },
  {
    id: 8,
    name: "Brew — Coffee Rating App",
    href: "https://github.com/shoaibhuq",
    type: "Mobile App",
    description:
      "Beli, but for coffee. Mobile-first app for rating coffee shops and individual drinks, with thinking around AWS/GCP infra, Google Places cost modeling, future commerce for beans and gear, and a clean UX structure.",
    imageUrl: null,
    placeholderIcon: Coffee,
    placeholderGradient: "from-amber-900/40 via-yellow-900/30 to-orange-800/20",
    date: "Concept · In progress",
    tags: ["React Native", "AWS", "GCP", "Google Places"],
  },
  {
    id: 9,
    name: "Lift — Natural Language Gym App",
    href: "https://github.com/shoaibhuq",
    type: "Mobile App",
    description:
      'Workout logging without the friction. Type notes naturally ("bench 3x5 @185") and the app parses exercises, reps, sets, and weight. Roadmap includes fuzzy autocomplete, trainer-uploaded routines, Apple Health sync, and 3D body scanning.',
    imageUrl: null,
    placeholderIcon: Dumbbell,
    placeholderGradient: "from-emerald-900/40 via-teal-900/30 to-cyan-800/20",
    date: "Concept · In progress",
    tags: ["Swift", "NLP", "HealthKit"],
  },
  {
    id: 10,
    name: "Snapshot — Image to Calendar",
    href: "https://github.com/shoaibhuq",
    type: "Mobile App",
    description:
      "Turn any screenshot, flyer, or syllabus photo into calendar events and tasks. OCR + lightweight LLM parsing removes the friction of manually transcribing dates — pure low-friction productivity.",
    imageUrl: null,
    placeholderIcon: ScanLine,
    placeholderGradient: "from-sky-900/40 via-blue-900/30 to-indigo-800/20",
    date: "Concept · In progress",
    tags: ["OCR", "LLMs", "iOS"],
  },
];

/* ------------------- card components ------------------- */

function ProjectCardFull({ post }: { post: Project }) {
  const PlaceholderIcon = post.placeholderIcon;
  return (
    <SpotlightCard
      className="h-full flex flex-col !p-5 sm:!p-6"
      spotlightColor="rgba(16, 185, 129, 0.15)"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-950/60 border border-white/5 mb-5">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={`${post.name} preview`}
            className="absolute inset-0 w-full h-full object-contain p-4"
            loading="lazy"
          />
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${
              post.placeholderGradient ?? "from-neutral-800 to-neutral-900"
            }`}
          >
            {PlaceholderIcon && (
              <PlaceholderIcon className="h-16 w-16 text-white/80" />
            )}
          </div>
        )}
      </div>

      {/* Title + type */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
          {post.name}
        </h3>
        <span className="text-[10px] sm:text-xs font-medium text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1 whitespace-nowrap shrink-0">
          {post.type}
        </span>
      </div>
      <p className="text-xs text-neutral-400 mb-3">{post.date}</p>

      <p className="text-sm text-neutral-300 leading-relaxed mb-4 flex-1">
        {post.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-medium text-neutral-300 bg-white/5 border border-white/10 rounded-full px-2.5 py-1"
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={post.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group/cta inline-flex items-center justify-between gap-2 mt-auto py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-colors min-h-[44px]"
      >
        <span>View Project</span>
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
      </a>
    </SpotlightCard>
  );
}

function ProjectCardCompact({ post }: { post: Project }) {
  const PlaceholderIcon = post.placeholderIcon;
  return (
    <a
      href={post.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/card h-full"
    >
      <SpotlightCard
        className="h-full flex flex-col !p-3 hover:!border-emerald-500/30 transition-colors"
        spotlightColor="rgba(16, 185, 129, 0.12)"
      >
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-950/60 border border-white/5 mb-3">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={`${post.name} preview`}
              className="absolute inset-0 w-full h-full object-contain p-2"
              loading="lazy"
            />
          ) : (
            <div
              className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${
                post.placeholderGradient ?? "from-neutral-800 to-neutral-900"
              }`}
            >
              {PlaceholderIcon && (
                <PlaceholderIcon className="h-10 w-10 text-white/80" />
              )}
            </div>
          )}
          <ArrowUpRight className="absolute top-2 right-2 h-4 w-4 text-white/0 group-hover/card:text-white/90 transition-colors" />
        </div>
        <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
          {post.name}
        </h3>
        <p className="text-[10px] text-emerald-400/90 mt-1 truncate">
          {post.type}
        </p>
      </SpotlightCard>
    </a>
  );
}

/* ------------------- main section ------------------- */

export default function Projects() {
  const titleWords = "Projects".split("");
  const [compact, setCompact] = useState(false);

  return (
    <section id="projects" className="py-16 sm:py-20">
      <motion.h2
        className="text-gray-200 mb-10 sm:mb-14 text-center font-bold text-4xl sm:text-5xl tracking-tight flex justify-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {titleWords.map((letter, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 40, rotateX: -90 },
              show: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                transition: { type: "spring", stiffness: 100, damping: 12 },
              },
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.h2>

      {/* Folder-stack showcase — React Bits ScrollStack pins the section
          and scales each project card as the user scrolls, so it reads like
          flipping through a stack of file folders. */}
      <div className="relative hidden md:block max-w-3xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/80 font-semibold">
            Featured stack
          </span>
          <span className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <span className="inline-block h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
            Scroll to flip
          </span>
        </div>
        <ScrollStack
          useWindowScroll
          itemDistance={80}
          itemScale={0.02}
          itemStackDistance={24}
          stackPosition="22%"
          scaleEndPosition="12%"
          baseScale={0.88}
          rotationAmount={0}
          blurAmount={1}
        >
          {posts.map((post) => (
            <ScrollStackItem
              key={post.id}
              itemClassName="!p-0 !bg-transparent !shadow-none !rounded-3xl"
            >
              <ProjectCardFull post={post} />
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

      {/* Full grid — always accessible, with compact toggle.
          The #projects-all anchor lets the nav bar skip straight to this
          view so visitors can see every project at once. */}
      <div
        id="projects-all"
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 md:mt-24 scroll-mt-24"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-white text-xl sm:text-2xl font-bold">
              All projects
            </h3>
            <p className="text-sm text-neutral-400 mt-1">
              {posts.length} total — toggle the view
            </p>
          </div>
          <div
            role="tablist"
            aria-label="View mode"
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!compact}
              onClick={() => setCompact(false)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors min-h-[36px] ${
                !compact
                  ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30"
                  : "text-neutral-400 hover:text-white border border-transparent"
              }`}
            >
              <Rows3 className="h-3.5 w-3.5" />
              Detailed
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={compact}
              onClick={() => setCompact(true)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors min-h-[36px] ${
                compact
                  ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30"
                  : "text-neutral-400 hover:text-white border border-transparent"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Compact
            </button>
          </div>
        </div>

        <motion.ul
          layout
          role="list"
          className={
            compact
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          }
        >
          <AnimatePresence mode="popLayout">
            {posts.map((post, index) => (
              <motion.li
                layout
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                transition={{
                  layout: {
                    type: "spring",
                    stiffness: 260,
                    damping: 26,
                  },
                  duration: 0.45,
                  delay: index * 0.04,
                  ease: [0.16, 0.77, 0.47, 0.97],
                }}
                className="h-full"
              >
                {compact ? (
                  <ProjectCardCompact post={post} />
                ) : (
                  <ProjectCardFull post={post} />
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
