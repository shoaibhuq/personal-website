import { useEffect, useMemo, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { motion, AnimatePresence } from "motion/react";
import {
  Plane,
  BedDouble,
  Globe2,
  MapPin,
  X,
  CalendarDays,
  Building2,
} from "lucide-react";

import SpotlightCard from "./SpotlightCard";
import {
  travelLocations,
  formatTravelDate,
  type TravelLocation,
} from "../../data/travelLocations";

// Populated at build time by Vite's `define` from GOOGLE_MAPS_API_KEY in .env
const API_KEY =
  typeof __GOOGLE_MAPS_API_KEY__ !== "undefined" ? __GOOGLE_MAPS_API_KEY__ : "";

const MAP_ID = "shoaib_travel_map";

// Muted dark map style with purple-tinted accents, loosely inspired by modern
// SaaS dashboards — not pitch-black, not too saturated, just enough gradient
// to feel intentional while the markers pop.
const mapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#15131d" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#15131d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b6485" }] },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#3a3452" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#c4b5fd" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#1f1b2e" }],
  },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2a2438" }],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0a0814" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4c4466" }],
  },
];

const DEFAULT_CENTER = { lat: 20, lng: 20 };

/* ---------------- Marker ---------------- */

interface GlassMarkerProps {
  loc: TravelLocation;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (loc: TravelLocation | null) => void;
  onHover: (loc: TravelLocation | null) => void;
}

function GlassMarker({
  loc,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: GlassMarkerProps) {
  const [markerRef] = useAdvancedMarkerRef();
  const isUpcoming = loc.status === "upcoming";
  const position = { lat: loc.coordinates[1], lng: loc.coordinates[0] };
  const Icon = loc.sourceType === "flight" ? Plane : BedDouble;

  const ringClass = isUpcoming
    ? "from-pink-400 via-rose-400 to-fuchsia-500"
    : "from-emerald-400 via-teal-400 to-cyan-500";
  const glowClass = isUpcoming ? "bg-pink-500/40" : "bg-emerald-500/40";

  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      zIndex={isSelected || isHovered ? 1000 : 10}
      onClick={() => onSelect(isSelected ? null : loc)}
    >
      <div
        className="relative flex items-center justify-center cursor-pointer"
        onMouseEnter={() => onHover(loc)}
        onMouseLeave={() => onHover(null)}
      >
        {/* Outer pulsing glow */}
        <span
          className={`absolute h-12 w-12 rounded-full ${glowClass} blur-md animate-ping opacity-40`}
        />
        {/* Gradient ring (visible on hover/selected) */}
        <span
          className={`absolute rounded-full bg-gradient-to-br ${ringClass} transition-all duration-300 ${
            isSelected || isHovered
              ? "h-11 w-11 opacity-100 shadow-[0_0_18px_rgba(236,72,153,0.55)]"
              : "h-9 w-9 opacity-80"
          }`}
        />
        {/* Inner glass circle with icon */}
        <span
          className={`relative flex items-center justify-center rounded-full border border-white/25 bg-black/70 backdrop-blur-sm transition-all duration-300 ${
            isSelected || isHovered ? "h-9 w-9 scale-110" : "h-7 w-7"
          }`}
        >
          <Icon
            className={`${
              isSelected || isHovered ? "h-4 w-4" : "h-3.5 w-3.5"
            } text-white`}
          />
        </span>
        {/* Upcoming badge */}
        {isUpcoming && (
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-pink-300 ring-2 ring-black animate-pulse" />
        )}
      </div>
    </AdvancedMarker>
  );
}

/* ---------------- Main ---------------- */

export default function TravelMap() {
  const [selected, setSelected] = useState<TravelLocation | null>(null);
  const [hovered, setHovered] = useState<TravelLocation | null>(null);

  const stats = useMemo(() => {
    const countries = new Set(travelLocations.map((l) => l.country));
    const cities = new Set(travelLocations.map((l) => l.city));
    const upcoming = travelLocations.filter(
      (l) => l.status === "upcoming"
    ).length;
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

  // Close detail card on Escape for keyboard users.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

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
            Every pin is a memory. Tap a dot on the map — or a card below — to
            see when I stayed there. Drag and zoom to explore.
          </p>
        </motion.div>

        <SpotlightCard
          className="!p-4 sm:!p-6"
          spotlightColor="rgba(236, 72, 153, 0.12)"
        >
          {/* Map stage */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#15131d] ring-1 ring-inset ring-white/5">
            {/* Gradient hints layered above the map */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20"
            >
              <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-purple-600/25 blur-3xl" />
              <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-pink-600/20 blur-3xl" />
              <div className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-fuchsia-500/15 blur-3xl" />
              {/* Vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.6)_100%)]" />
            </div>

            <div className="relative aspect-[16/11] sm:aspect-[16/9] w-full">
              {API_KEY ? (
                <APIProvider apiKey={API_KEY}>
                  <Map
                    mapId={MAP_ID}
                    defaultCenter={DEFAULT_CENTER}
                    defaultZoom={2}
                    minZoom={2}
                    maxZoom={14}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    zoomControl
                    fullscreenControl={false}
                    streetViewControl={false}
                    mapTypeControl={false}
                    styles={mapStyles}
                    className="w-full h-full"
                  >
                    {travelLocations.map((loc) => (
                      <GlassMarker
                        key={loc.label}
                        loc={loc}
                        isSelected={selected?.label === loc.label}
                        isHovered={hovered?.label === loc.label}
                        onSelect={setSelected}
                        onHover={setHovered}
                      />
                    ))}
                  </Map>
                </APIProvider>
              ) : (
                <MissingKeyFallback />
              )}
            </div>

            {/* Top-left stat chips overlay */}
            <div className="pointer-events-none absolute top-3 left-3 sm:top-4 sm:left-4 z-30 flex flex-wrap gap-2">
              <StatChip label="Countries" value={stats.countries} />
              <StatChip label="Cities" value={stats.cities} />
              <StatChip
                label="Upcoming"
                value={stats.upcoming}
                accent="pink"
              />
            </div>

            {/* Top-right legend */}
            <div className="pointer-events-none absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex flex-col gap-1.5 text-[10px] sm:text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 border border-white/10 text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Past
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 border border-white/10 text-pink-300">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-pulse" />
                Upcoming
              </span>
            </div>

            {/* Bottom-right detail card — appears when a location is selected */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                  }}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-30 w-[calc(100%-1.5rem)] sm:w-80 max-w-[calc(100%-1.5rem)]"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/75 backdrop-blur-xl shadow-2xl shadow-black/60">
                    {/* Gradient top border */}
                    <div
                      className={`h-0.5 w-full bg-gradient-to-r ${
                        selected.status === "upcoming"
                          ? "from-pink-400 via-rose-400 to-fuchsia-500"
                          : "from-emerald-400 via-teal-400 to-cyan-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="absolute top-2 right-2 h-7 w-7 rounded-full text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                      aria-label="Close detail"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                            selected.status === "upcoming"
                              ? "bg-pink-500/15 border-pink-400/30 text-pink-300"
                              : "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                          }`}
                        >
                          {selected.sourceType === "flight" ? (
                            <Plane className="h-4 w-4" />
                          ) : (
                            <BedDouble className="h-4 w-4" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1 pr-6">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white truncate">
                              {selected.city}
                            </p>
                            {selected.status === "upcoming" && (
                              <span className="text-[9px] font-semibold uppercase tracking-wide text-pink-300 bg-pink-500/15 border border-pink-400/30 rounded-full px-1.5 py-0.5 shrink-0">
                                Soon
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {selected.country}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1.5 text-xs text-gray-300">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5 text-purple-300/80 shrink-0" />
                          <span>{formatTravelDate(selected)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-purple-300/80 shrink-0" />
                          <span className="truncate">
                            {selected.sourceName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Location cards grid BELOW the map */}
          <div className="mt-6">
            <div className="flex items-end justify-between mb-3">
              <h3 className="text-white font-semibold text-sm sm:text-base">
                All trips
              </h3>
              <p className="text-xs text-gray-500">
                {stats.total} trips · {stats.countries} countries
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {sortedLocations.map((loc) => {
                const isSelected = selected?.label === loc.label;
                return (
                  <li key={loc.label}>
                    <button
                      type="button"
                      onClick={() => setSelected(isSelected ? null : loc)}
                      onMouseEnter={() => setHovered(loc)}
                      onMouseLeave={() => setHovered(null)}
                      className={`group/tc w-full text-left rounded-xl border px-3.5 py-3 transition-all duration-300 min-h-[60px] ${
                        isSelected
                          ? "border-pink-400/50 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent shadow-lg shadow-pink-900/20"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            loc.status === "upcoming"
                              ? "bg-pink-500/15 border-pink-400/30 text-pink-300"
                              : "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                          } group-hover/tc:scale-110 transition-transform`}
                        >
                          {loc.sourceType === "flight" ? (
                            <Plane className="h-3.5 w-3.5" />
                          ) : (
                            <BedDouble className="h-3.5 w-3.5" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-white truncate">
                              {loc.city}
                            </p>
                            {loc.status === "upcoming" && (
                              <span className="text-[9px] font-semibold uppercase tracking-wide text-pink-300 bg-pink-500/15 border border-pink-400/30 rounded-full px-1.5 py-0.5 shrink-0">
                                Soon
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400 truncate">
                            {loc.country}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
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
        </SpotlightCard>
      </div>
    </section>
  );
}

/* ---------------- Helpers ---------------- */

function StatChip({
  label,
  value,
  accent = "purple",
}: {
  label: string;
  value: number;
  accent?: "purple" | "pink";
}) {
  return (
    <div className="pointer-events-auto rounded-xl border border-white/15 bg-black/70 backdrop-blur-xl px-3 py-1.5 shadow-lg shadow-black/40">
      <div className="flex items-baseline gap-1.5">
        <span
          className={`text-base sm:text-lg font-bold ${
            accent === "pink" ? "text-pink-300" : "text-purple-200"
          }`}
        >
          {value}
        </span>
        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-400">
          {label}
        </span>
      </div>
    </div>
  );
}

function MissingKeyFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
      <Globe2 className="h-10 w-10 text-purple-400/60" />
      <p className="text-sm font-semibold text-white">Map unavailable</p>
      <p className="text-xs text-gray-400 max-w-xs">
        Add <code className="text-purple-300">GOOGLE_MAPS_API_KEY</code> to your{" "}
        <code className="text-purple-300">.env</code> file to enable the
        interactive travel map.
      </p>
    </div>
  );
}
