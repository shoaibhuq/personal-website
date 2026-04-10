export type TravelStatus = "past" | "upcoming";
export type TravelSourceType = "hotel" | "flight";

export interface TravelLocation {
  label: string;
  city: string;
  region: string | null;
  country: string;
  status: TravelStatus;
  sourceType: TravelSourceType;
  sourceName: string;
  checkIn?: string;
  checkOut?: string;
  departDate?: string;
  returnDate?: string;
  route?: string;
  /** [longitude, latitude] — GeoJSON order */
  coordinates: [number, number];
}

export const travelLocations: TravelLocation[] = [
  {
    label: "Houston, TX, USA",
    city: "Houston",
    region: "Texas",
    country: "USA",
    status: "past",
    sourceType: "hotel",
    sourceName: "SpringHill Suites Houston Medical Center/NRG Park",
    checkIn: "2025-08-08",
    checkOut: "2025-08-10",
    coordinates: [-95.3698, 29.7604],
  },
  {
    label: "Busan, South Korea",
    city: "Busan",
    region: null,
    country: "South Korea",
    status: "past",
    sourceType: "hotel",
    sourceName: "Travel Light Hostel",
    checkIn: "2025-07-10",
    checkOut: "2025-07-11",
    coordinates: [129.0756, 35.1796],
  },
  {
    label: "Seoul, South Korea",
    city: "Seoul",
    region: null,
    country: "South Korea",
    status: "past",
    sourceType: "hotel",
    sourceName: "Namsan Guesthouse",
    checkIn: "2025-07-11",
    checkOut: "2025-07-16",
    coordinates: [126.978, 37.5665],
  },
  {
    label: "Osaka, Japan",
    city: "Osaka",
    region: "Osaka Prefecture",
    country: "Japan",
    status: "past",
    sourceType: "hotel",
    sourceName: "Hostel Q",
    checkIn: "2025-07-16",
    checkOut: "2025-07-20",
    coordinates: [135.5023, 34.6937],
  },
  {
    label: "Kyoto, Japan",
    city: "Kyoto",
    region: "Kyoto Prefecture",
    country: "Japan",
    status: "past",
    sourceType: "hotel",
    sourceName: "Piece Hostel Sanjo",
    checkIn: "2025-07-20",
    checkOut: "2025-07-25",
    coordinates: [135.7681, 35.0116],
  },
  {
    label: "Tokyo, Japan",
    city: "Tokyo",
    region: "Tokyo",
    country: "Japan",
    status: "past",
    sourceType: "hotel",
    sourceName: "Hotel Plus Hostel TOKYO ASAKUSA 1",
    checkIn: "2025-07-25",
    checkOut: "2025-07-29",
    coordinates: [139.6917, 35.6895],
  },
  {
    label: "Newark, NJ, USA",
    city: "Newark",
    region: "New Jersey",
    country: "USA",
    status: "past",
    sourceType: "flight",
    sourceName: "Spirit Airlines",
    departDate: "2026-01-22",
    returnDate: "2026-01-25",
    route: "DFW ↔ EWR",
    coordinates: [-74.1724, 40.7357],
  },
  {
    label: "Mexico City, Mexico",
    city: "Mexico City",
    region: null,
    country: "Mexico",
    status: "past",
    sourceType: "hotel",
    sourceName: "Casa Carmelia La Condesa",
    checkIn: "2026-02-11",
    checkOut: "2026-02-17",
    coordinates: [-99.1332, 19.4326],
  },
  {
    label: "Fort Lauderdale, FL, USA",
    city: "Fort Lauderdale",
    region: "Florida",
    country: "USA",
    status: "past",
    sourceType: "flight",
    sourceName: "Spirit Airlines",
    departDate: "2026-03-26",
    returnDate: "2026-03-30",
    route: "DFW ↔ FLL",
    coordinates: [-80.1373, 26.1224],
  },
  {
    label: "Dania Beach, FL, USA",
    city: "Dania Beach",
    region: "Florida",
    country: "USA",
    status: "past",
    sourceType: "hotel",
    sourceName: "Wyndham Garden Ft Lauderdale Airport & Cruise Port",
    checkIn: "2026-03-30",
    checkOut: "2026-03-31",
    coordinates: [-80.1439, 26.0526],
  },
  {
    label: "Las Vegas, NV, USA",
    city: "Las Vegas",
    region: "Nevada",
    country: "USA",
    status: "upcoming",
    sourceType: "hotel",
    sourceName: "SAHARA Las Vegas",
    checkIn: "2026-05-21",
    checkOut: "2026-05-22",
    coordinates: [-115.1398, 36.1699],
  },
  {
    label: "St. George, UT, USA",
    city: "St. George",
    region: "Utah",
    country: "USA",
    status: "upcoming",
    sourceType: "hotel",
    sourceName: "St. George Inn and Suites",
    checkIn: "2026-05-22",
    checkOut: "2026-05-24",
    coordinates: [-113.5684, 37.0965],
  },
];

/** Format a location's date range for display */
export function formatTravelDate(loc: TravelLocation): string {
  const start = loc.checkIn ?? loc.departDate;
  const end = loc.checkOut ?? loc.returnDate;
  if (!start) return "";

  const fmt = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (end && end !== start) {
    return `${fmt(start)} – ${fmt(end)}`;
  }
  return fmt(start);
}
