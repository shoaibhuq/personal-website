import { useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Plane, BedDouble, Globe2 } from "lucide-react";

import SpotlightCard from "./SpotlightCard";
import {
  travelLocations,
  formatTravelDate,
  type TravelLocation,
} from "../../data/travelLocations";

// Public topojson from world-atlas. Loaded at runtime.
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface TooltipState {
  loc: TravelLocation;
  x: number;
  y: number;
}

function MarkerDot({
  loc,
  onEnter,
  onLeave,
  isActive,
}: {
  loc: TravelLocation;
  onEnter: (e: React.MouseEvent, l: TravelLocation) => void;
  onLeave: () => void;
  isActive: boolean;
}) {
  const isUpcoming = loc.status === "upcoming";
  const fill = isUpcoming ? "#f472b6" : "#34d399";
  const ring = isUpcoming
    ? "rgba(244, 114, 182, 0.35)"
    : "rgba(52, 211, 153, 0.35)";

  return (
    <Marker coordinates={loc.coordinates}>
      {/* Pulsing ring */}
      <circle r={9} fill={ring}>
        <animate
          attributeName="r"
          values="6;12;6"
          dur="2.4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0;0.6"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>
      {/* Solid dot */}
      <circle
        r={isActive ? 5 : 3.5}
        fill={fill}
        stroke="#0a0a0a"
        strokeWidth={1}
        onMouseEnter={(e) => onEnter(e, loc)}
        onMouseLeave={onLeave}
        style={{ cursor: "pointer", transition: "r 0.2s ease-out" }}
      />
    </Marker>
  );
}

export default function TravelMap() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [selected, setSelected] = useState<TravelLocation | null>(null);

  const stats = useMemo(() => {
    const countries = new Set(travelLocations.map((l) => l.country));
    const cities = new Set(travelLocations.map((l) => l.city));
    const upcoming = travelLocations.filter((l) => l.status === "upcoming")
      .length;
    return {
      countries: countries.size,
      cities: cities.size,
      upcoming,
      total: travelLocations.length,
    };
  }, []);

  const sortedLocations = useMemo(() => {
    return [...travelLocations].sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "upcoming" ? -1 : 1;
      }
      const aDate = a.checkIn ?? a.departDate ?? "";
      const bDate = b.checkIn ?? b.departDate ?? "";
      return bDate.localeCompare(aDate);
    });
  }, []);

  const handleEnter = (e: React.MouseEvent, loc: TravelLocation) => {
    setTooltip({ loc, x: e.clientX, y: e.clientY });
  };
  const handleLeave = () => setTooltip(null);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-pink-200 backdrop-blur-sm mb-4">
            <Globe2 className="h-3.5 w-3.5" />
            On the road
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-br from-white via-purple-200 to-pink-400 bg-clip-text text-transparent leading-tight">
            Places I've been
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-300/80 max-w-2xl mx-auto">
            Every pin is a memory. Hover a dot on the map — or tap a card — to
            see when I stayed there.
          </p>
        </motion.div>

        <SpotlightCard
          className="!p-4 sm:!p-6 lg:!p-8"
          spotlightColor="rgba(236, 72, 153, 0.12)"
        >
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <StatBox label="Countries" value={stats.countries} />
            <StatBox label="Cities" value={stats.cities} />
            <StatBox label="Total trips" value={stats.total} />
            <StatBox label="Upcoming" value={stats.upcoming} accent="pink" />
          </div>

          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
            {/* Map */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0b0820]">
              <div className="aspect-[16/10] sm:aspect-[16/9]">
                <ComposableMap
                  projectionConfig={{ scale: 155 }}
                  width={900}
                  height={500}
                  style={{ width: "100%", height: "100%" }}
                >
                  <defs>
                    <radialGradient id="oceanGlow" cx="50%" cy="50%" r="70%">
                      <stop
                        offset="0%"
                        stopColor="#1e1b4b"
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor="#0b0820"
                        stopOpacity={1}
                      />
                    </radialGradient>
                  </defs>
                  <rect
                    x="0"
                    y="0"
                    width="900"
                    height="500"
                    fill="url(#oceanGlow)"
                  />
                  <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          style={{
                            default: {
                              fill: "#1f1b3d",
                              stroke: "#2e2757",
                              strokeWidth: 0.4,
                              outline: "none",
                            },
                            hover: {
                              fill: "#2a2451",
                              stroke: "#3a3270",
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                            pressed: {
                              fill: "#2a2451",
                              outline: "none",
                            },
                          }}
                        />
                      ))
                    }
                  </Geographies>
                  {travelLocations.map((loc) => (
                    <MarkerDot
                      key={loc.label}
                      loc={loc}
                      onEnter={handleEnter}
                      onLeave={handleLeave}
                      isActive={selected?.label === loc.label}
                    />
                  ))}
                </ComposableMap>
              </div>

              {/* Legend */}
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-[11px] sm:text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 border border-white/10 text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Past
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 border border-white/10 text-pink-300">
                  <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
                  Upcoming
                </span>
              </div>
            </div>

            {/* Location list */}
            <div className="lg:max-h-[500px] lg:overflow-y-auto lg:pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
              <ul className="space-y-2">
                {sortedLocations.map((loc) => {
                  const isSelected = selected?.label === loc.label;
                  return (
                    <li key={loc.label}>
                      <button
                        type="button"
                        onClick={() =>
                          setSelected(isSelected ? null : loc)
                        }
                        onMouseEnter={() =>
                          setSelected(loc)
                        }
                        className={`w-full text-left rounded-xl border px-4 py-3 transition-all min-h-[56px] ${
                          isSelected
                            ? "border-pink-400/40 bg-pink-500/10"
                            : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                              loc.status === "upcoming"
                                ? "bg-pink-500/15 border-pink-400/30 text-pink-300"
                                : "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                            }`}
                          >
                            {loc.sourceType === "flight" ? (
                              <Plane className="h-4 w-4" />
                            ) : (
                              <BedDouble className="h-4 w-4" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-white truncate">
                                {loc.city}
                              </p>
                              {loc.status === "upcoming" && (
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-pink-300 bg-pink-500/15 border border-pink-400/30 rounded-full px-2 py-0.5 shrink-0">
                                  Soon
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 truncate">
                              {loc.country}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatTravelDate(loc)}
                            </p>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Tooltip (desktop hover) */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              left: tooltip.x + 14,
              top: tooltip.y + 14,
              pointerEvents: "none",
              zIndex: 50,
            }}
            className="rounded-xl border border-white/10 bg-neutral-900/95 backdrop-blur-md px-3 py-2 shadow-xl shadow-black/50"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <MapPin className="h-3.5 w-3.5 text-pink-300" />
              {tooltip.loc.label}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              {formatTravelDate(tooltip.loc)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function StatBox({
  label,
  value,
  accent = "purple",
}: {
  label: string;
  value: number;
  accent?: "purple" | "pink";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center">
      <div
        className={`text-2xl sm:text-3xl font-bold ${
          accent === "pink" ? "text-pink-300" : "text-purple-200"
        }`}
      >
        {value}
      </div>
      <div className="text-[11px] sm:text-xs uppercase tracking-wider text-gray-400 mt-0.5">
        {label}
      </div>
    </div>
  );
}
