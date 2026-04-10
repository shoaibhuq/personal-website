import { useMemo, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { motion, AnimatePresence } from "motion/react";
import { Plane, BedDouble, Globe2, MapPin } from "lucide-react";

import SpotlightCard from "./SpotlightCard";
import {
  travelLocations,
  formatTravelDate,
  type TravelLocation,
} from "../../data/travelLocations";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

// Optional custom Map ID for cloud-based styling. If not provided, we fall
// back to inline `styles` (works with classic maps, not Advanced Markers in
// every mode — but google tolerates it fine for rendering).
const MAP_ID =
  (import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string | undefined) ??
  "shoaib_travel_map";

// Dark purple/pink themed styles matching the site palette.
const mapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0b0820" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b0820" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8b7ec8" }] },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2e2757" }],
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
    stylers: [{ color: "#1f1b3d" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2a2451" }],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#060418" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6d5bb5" }],
  },
];

const DEFAULT_CENTER = { lat: 20, lng: 20 };

interface MarkerWithInfoProps {
  loc: TravelLocation;
  isSelected: boolean;
  onSelect: (loc: TravelLocation | null) => void;
}

function MarkerWithInfo({ loc, isSelected, onSelect }: MarkerWithInfoProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const isUpcoming = loc.status === "upcoming";
  const position = { lat: loc.coordinates[1], lng: loc.coordinates[0] };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={() => onSelect(isSelected ? null : loc)}
      >
        <div className="relative flex items-center justify-center">
          <span
            className={`absolute h-6 w-6 rounded-full animate-ping opacity-60 ${
              isUpcoming ? "bg-pink-400" : "bg-emerald-400"
            }`}
          />
          <span
            className={`relative h-3.5 w-3.5 rounded-full border-2 border-black shadow-lg ${
              isUpcoming ? "bg-pink-400" : "bg-emerald-400"
            } ${isSelected ? "scale-150" : ""} transition-transform`}
          />
        </div>
      </AdvancedMarker>
      {isSelected && marker && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => onSelect(null)}
          headerDisabled
        >
          <div className="min-w-[180px] rounded-lg bg-neutral-900 p-3 text-white border border-white/10">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-3.5 w-3.5 text-pink-300" />
              {loc.label}
            </div>
            <div className="mt-1 text-[11px] text-gray-400">
              {formatTravelDate(loc)}
            </div>
            {loc.sourceName && (
              <div className="mt-1 text-[11px] text-gray-500 truncate">
                {loc.sourceName}
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default function TravelMap() {
  const [selected, setSelected] = useState<TravelLocation | null>(null);

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
            Every pin is a memory. Tap a dot on the map — or a card on the side —
            to see when I stayed there. Drag and zoom to explore.
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
              <div className="aspect-[16/10] sm:aspect-[16/9] w-full">
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
                        <MarkerWithInfo
                          key={loc.label}
                          loc={loc}
                          isSelected={selected?.label === loc.label}
                          onSelect={setSelected}
                        />
                      ))}
                    </Map>
                  </APIProvider>
                ) : (
                  <MissingKeyFallback />
                )}
              </div>

              {/* Legend */}
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-[11px] sm:text-xs pointer-events-none">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-sm px-2.5 py-1 border border-white/10 text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Past
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-sm px-2.5 py-1 border border-white/10 text-pink-300">
                  <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
                  Upcoming
                </span>
              </div>
            </div>

            {/* Location list */}
            <div className="lg:max-h-[500px] lg:overflow-y-auto lg:pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
              <ul className="space-y-2">
                <AnimatePresence initial={false}>
                  {sortedLocations.map((loc) => {
                    const isSelected = selected?.label === loc.label;
                    return (
                      <motion.li
                        key={loc.label}
                        layout
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <button
                          type="button"
                          onClick={() => setSelected(isSelected ? null : loc)}
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
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}

function MissingKeyFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
      <Globe2 className="h-10 w-10 text-purple-400/60" />
      <p className="text-sm font-semibold text-white">Map unavailable</p>
      <p className="text-xs text-gray-400 max-w-xs">
        Add <code className="text-purple-300">VITE_GOOGLE_MAPS_API_KEY</code> to
        your <code className="text-purple-300">.env</code> file to enable the
        interactive travel map.
      </p>
    </div>
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
