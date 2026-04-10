import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import { CalendarDaysIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

import SpotlightCard from "../ui/SpotlightCard";
import BookingModal from "../ui/BookingModal";
import Aurora from "../ui/Aurora";
import RotatingText from "../ui/RotatingText";
import TravelMap from "../ui/TravelMap";

import photo1 from "../../assets/Photography/photo1.jpg";
import photo2 from "../../assets/Photography/photo2.jpg";
import photo3 from "../../assets/Photography/photo3.jpg";
import photo4 from "../../assets/Photography/photo4.jpg";
import photo5 from "../../assets/Photography/photo5.jpg";
import photo6 from "../../assets/Photography/photo6.jpg";
import photo7 from "../../assets/Photography/photo7.jpg";
import photo8 from "../../assets/Photography/photo8.jpg";
import photo9 from "../../assets/Photography/photo9.jpg";
import photo10 from "../../assets/Photography/photo10.jpg";
import photo11 from "../../assets/Photography/photo11.jpg";
import photo12 from "../../assets/Photography/photo12.jpg";
import photo13 from "../../assets/Photography/photo13.jpg";
import photo14 from "../../assets/Photography/photo14.jpg";
import photo15 from "../../assets/Photography/photo15.jpg";

type Photo = { title: string; thumbnail: string };

const photos: Photo[] = [
  { title: "Photo 1", thumbnail: photo1 },
  { title: "Photo 2", thumbnail: photo2 },
  { title: "Photo 3", thumbnail: photo3 },
  { title: "Photo 4", thumbnail: photo4 },
  { title: "Photo 5", thumbnail: photo5 },
  { title: "Photo 6", thumbnail: photo6 },
  { title: "Photo 7", thumbnail: photo7 },
  { title: "Photo 8", thumbnail: photo8 },
  { title: "Photo 9", thumbnail: photo9 },
  { title: "Photo 10", thumbnail: photo10 },
  { title: "Photo 11", thumbnail: photo11 },
  { title: "Photo 12", thumbnail: photo12 },
  { title: "Photo 13", thumbnail: photo13 },
  { title: "Photo 14", thumbnail: photo14 },
  { title: "Photo 15", thumbnail: photo15 },
];

const firstRow = photos.slice(0, 5);
const secondRow = photos.slice(5, 10);
const thirdRow = photos.slice(10, 15);

const services = [
  "Weddings",
  "Portraits",
  "Graduation",
  "Events",
  "Lifestyle",
];

// Simple media query hook
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export default function Photography() {
  const [bookingOpen, setBookingOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950 overflow-x-hidden">
      <Hero onBook={() => setBookingOpen(true)} />
      <ServicesStrip />
      {isDesktop ? <ParallaxGallery /> : <MobileGallery />}
      <TravelMap />
      <ScheduleCTA onBook={() => setBookingOpen(true)} />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}

/* ---------- Hero ---------- */

const Hero = ({ onBook }: { onBook: () => void }) => {
  const line1 = "Capturing Moments".split(" ");
  const line2 = "That Last Forever".split(" ");

  return (
    <section className="relative isolate overflow-hidden px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-16 sm:pb-24">
      {/* React Bits-style aurora background */}
      <Aurora />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Left — content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-purple-200 backdrop-blur-sm mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-400" />
              </span>
              Now booking sessions
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight bg-gradient-to-br from-white via-purple-200 to-pink-400 bg-clip-text text-transparent"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.1 },
                },
              }}
            >
              <span className="flex flex-wrap gap-x-3 sm:gap-x-4">
                {line1.map((word, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
                      show: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: {
                          type: "spring",
                          stiffness: 80,
                          damping: 20,
                        },
                      },
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="flex flex-wrap gap-x-3 sm:gap-x-4">
                {line2.map((word, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
                      show: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: {
                          type: "spring",
                          stiffness: 80,
                          damping: 20,
                        },
                      },
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            {/* Rotating tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-5 sm:mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-xl sm:text-2xl md:text-3xl font-semibold text-white/90"
            >
              <span>Specializing in</span>
              <RotatingText
                texts={[
                  "weddings",
                  "graduations",
                  "portraits",
                  "engagements",
                  "events",
                ]}
                mainClassName="inline-flex overflow-hidden rounded-lg bg-gradient-to-r from-purple-600/90 to-pink-600/90 px-3 py-1 text-white shadow-lg shadow-purple-900/40"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.018}
                splitLevelClassName="overflow-hidden"
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                rotationInterval={2400}
              />
            </motion.div>

            <motion.p
              className="max-w-xl text-base sm:text-lg mt-6 text-gray-300/90 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              Professional photography for weddings, portraits, graduation, and
              special events. Let's create timeless memories together.
            </motion.p>

            <motion.div
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.05 }}
            >
              <button
                type="button"
                onClick={onBook}
                className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[52px] px-7 rounded-full text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-900/40 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <CalendarDaysIcon className="h-5 w-5" />
                Book a Session
              </button>
              <a
                href="#gallery"
                className="inline-flex items-center justify-center w-full sm:w-auto min-h-[52px] px-7 rounded-full text-sm sm:text-base font-semibold text-white/90 border border-white/15 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-colors"
              >
                View Gallery
              </a>
            </motion.div>
          </div>

          {/* Right — orbital showcase card (fills the empty space) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="hidden lg:block relative h-[420px] xl:h-[480px]"
          >
            <OrbitalShowcase />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Orbital Showcase (hero right side) ---------- */

const orbitStats = [
  { label: "Sessions", value: "120+", accent: "from-purple-500 to-fuchsia-500" },
  { label: "Countries", value: "6", accent: "from-pink-500 to-rose-500" },
  { label: "Years", value: "5", accent: "from-indigo-500 to-purple-500" },
  { label: "Smiles", value: "∞", accent: "from-fuchsia-500 to-pink-500" },
];

const OrbitalShowcase = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Rotating conic ring */}
      <motion.div
        aria-hidden
        className="absolute inset-8 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(168,85,247,0.0), rgba(168,85,247,0.6), rgba(236,72,153,0.6), rgba(168,85,247,0.0))",
          mask: "radial-gradient(circle, transparent 55%, black 57%, black 60%, transparent 62%)",
          WebkitMask:
            "radial-gradient(circle, transparent 55%, black 57%, black 60%, transparent 62%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Dashed static ring */}
      <div
        aria-hidden
        className="absolute inset-16 rounded-full border border-dashed border-white/15"
      />

      {/* Inner glowing core */}
      <motion.div
        className="relative h-48 w-48 xl:h-56 xl:w-56 rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 shadow-[0_0_80px_rgba(168,85,247,0.45)] flex flex-col items-center justify-center"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Inner ring */}
        <div className="absolute inset-2 rounded-full border border-white/20" />
        <div className="absolute inset-4 rounded-full border border-white/10" />
        <span className="text-white/90 text-xs font-medium uppercase tracking-[0.2em]">
          Shoaib Huq
        </span>
        <span className="mt-1 text-white text-2xl xl:text-3xl font-bold">
          Photography
        </span>
        <span className="mt-1 text-white/70 text-[11px] tracking-wider uppercase">
          est. 2020
        </span>
      </motion.div>

      {/* Orbiting stat chips */}
      {orbitStats.map((stat, i) => {
        const angle = (i / orbitStats.length) * Math.PI * 2;
        const radius = 170;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <motion.div
            key={stat.label}
            className="absolute"
            style={{ left: "50%", top: "50%" }}
            animate={{
              x: [x, x + 8, x],
              y: [y, y - 8, y],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md px-4 py-2.5 shadow-xl shadow-purple-900/30">
              <div
                className={`text-lg font-bold bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 text-center">
                {stat.label}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

/* ---------- Services strip ---------- */

const ServicesStrip = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
      <motion.ul
        className="mx-auto max-w-5xl flex flex-wrap justify-center gap-2 sm:gap-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {services.map((svc) => (
          <motion.li
            key={svc}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm font-medium text-gray-200 backdrop-blur-sm"
          >
            {svc}
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};

/* ---------- Parallax gallery (desktop only) ---------- */

const ParallaxGallery = () => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 400]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -400]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [10, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [12, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-300, 200]),
    springConfig
  );

  return (
    <div
      id="gallery"
      ref={ref}
      className="min-h-[150vh] py-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-12 lg:space-x-16 mb-12 lg:mb-16">
          {firstRow.map((photo) => (
            <PhotoCard
              photo={photo}
              translate={translateX}
              key={photo.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-12 lg:mb-16 space-x-12 lg:space-x-16">
          {secondRow.map((photo) => (
            <PhotoCard
              photo={photo}
              translate={translateXReverse}
              key={photo.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-12 lg:space-x-16">
          {thirdRow.map((photo) => (
            <PhotoCard
              photo={photo}
              translate={translateX}
              key={photo.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const PhotoCard = ({
  photo,
  translate,
}: {
  photo: Photo;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{
        y: -16,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      key={photo.title}
      className="group/photo h-80 w-[22rem] lg:h-96 lg:w-[28rem] relative flex-shrink-0"
    >
      <div className="block h-full w-full rounded-2xl overflow-hidden border border-purple-900/40 group-hover/photo:border-purple-400/70 group-hover/photo:shadow-2xl group-hover/photo:shadow-purple-500/30 transition-all duration-300">
        <img
          src={photo.thumbnail}
          className="h-full w-full object-cover object-center"
          alt={photo.title}
          loading="lazy"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

/* ---------- Mobile gallery ---------- */

const MobileGallery = () => {
  return (
    <section
      id="gallery"
      className="px-4 sm:px-6 pb-16 sm:pb-20"
    >
      <motion.div
        className="mx-auto max-w-2xl columns-2 gap-3 sm:gap-4 [column-fill:_balance]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.04 } },
        }}
      >
        {photos.map((photo) => (
          <motion.div
            key={photo.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                },
              },
            }}
            className="mb-3 sm:mb-4 break-inside-avoid rounded-2xl overflow-hidden border border-purple-900/40"
          >
            <img
              src={photo.thumbnail}
              alt={photo.title}
              loading="lazy"
              className="w-full h-auto block"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

/* ---------- Schedule CTA ---------- */

const ScheduleCTA = ({ onBook }: { onBook: () => void }) => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto">
        <SpotlightCard
          className="!p-6 sm:!p-10 lg:!p-12"
          spotlightColor="rgba(236, 72, 153, 0.18)"
        >
          <div className="flex flex-col gap-6 sm:gap-8">
            <div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 bg-clip-text text-transparent leading-tight">
                Ready to create something timeless?
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
                Pick a time on my calendar and let's talk about your session.
                Whether it's a wedding, portrait, or graduation — I'll help
                make it unforgettable.
              </p>
            </div>

            <button
              type="button"
              onClick={onBook}
              className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start min-h-[56px] px-8 rounded-full text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-900/40 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <CalendarDaysIcon className="h-5 w-5" />
              Book an Appointment
            </button>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-white/10">
              <a
                href="tel:+14693890421"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group/contact min-h-[44px]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/15 border border-purple-400/20 shrink-0 group-hover/contact:bg-purple-500/25 transition-colors">
                  <PhoneIcon className="h-5 w-5 text-purple-300" />
                </span>
                <span className="text-sm sm:text-base">+1 (469) 389-0421</span>
              </a>
              <a
                href="mailto:huq.shoaib@gmail.com"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group/contact min-h-[44px]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/15 border border-pink-400/20 shrink-0 group-hover/contact:bg-pink-500/25 transition-colors">
                  <EnvelopeIcon className="h-5 w-5 text-pink-300" />
                </span>
                <span className="text-sm sm:text-base break-all">
                  huq.shoaib@gmail.com
                </span>
              </a>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
};
