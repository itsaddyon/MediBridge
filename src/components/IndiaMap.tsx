import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

/* =========================
   FitBounds helper (SAFE)
========================= */
function FitBounds({ locations }: { locations: { lat: number; lng: number }[] }) {
  const map = useMap();

  useEffect(() => {
    if (!locations.length) return;

    const bounds = L.latLngBounds(
      locations.map((l) => [l.lat, l.lng])
    );

    map.fitBounds(bounds, { padding: [60, 60] });
  }, [locations, map]);

  return null;
}

/* =========================
   Marker Icon Factory
========================= */
function createIcon(color: string) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

const ICONS = {
  hospital: createIcon("blue"),
  clinic: createIcon("green"),
  ambulance: createIcon("red"),
  specialist: createIcon("violet"),
};

/* =========================
   Types
========================= */
type LocationType = "hospital" | "clinic" | "ambulance" | "specialist";

type Location = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: LocationType;
  description?: string;
};

/* =========================
   INDIA-WIDE DATA (extendable)
========================= */


const LOCATIONS: Location[] = [
  // 🏥 AIIMS & Major Hospitals
  { id: "aiims-chennai", 
    name: "AIIMS Chennai",
    lat: 13.0827, 
    lng: 80.2707, 
    type: "hospital" 
  },

  { id: "aiims-patna",name:"AIIMS PATNA", lat: 25.5941, lng: 85.1376, type: "hospital" },
  { id: "aiims-patna",name: "AIIMS JODHPUR", lat: 25.5941, lng: 85.1376, type: "hospital" },
  { id: "ambulance-108",name:"Ambulance", lat: 29.8679, lng: 77.8934, type: "ambulance" },
  {
    id: "aiims-delhi",
    name: "AIIMS New Delhi",
    lat: 28.5672,
    lng: 77.2100,
    type: "hospital",
  },
  {
    id: "safdarjung",
    name: "Safdarjung Hospital",
    lat: 28.5665,
    lng: 77.2081,
    type: "hospital",
  },

  // =========================
  // 🟩 UTTARAKHAND
  // =========================
  {
    id: "aiims-rishikesh",
    name: "AIIMS Rishikesh",
    lat: 30.0870,
    lng: 78.2690,
    type: "hospital",
  },
  {
    id: "civil-roorkee",
    name: "Civil Hospital Roorkee",
    lat: 29.8666,
    lng: 77.8917,
    type: "clinic",
  },

  // =========================
  // 🟨 MAHARASHTRA (West)
  // =========================
  {
    id: "aiims-nagpur",
    name: "AIIMS Nagpur",
    lat: 21.1458,
    lng: 79.0882,
    type: "hospital",
  },
  {
    id: "jj-mumbai",
    name: "JJ Hospital Mumbai",
    lat: 18.9633,
    lng: 72.8331,
    type: "hospital",
  },

  // =========================
  // 🟥 TAMIL NADU (South)
  // =========================
  {
    id: "aiims-madurai",
    name: "AIIMS Madurai",
    lat: 9.9252,
    lng: 78.1198,
    type: "hospital",
  },
  {
    id: "apollo-chennai",
    name: "Apollo Hospital Chennai",
    lat: 13.0827,
    lng: 80.2707,
    type: "specialist",
  },

  // =========================
  // 🟪 KARNATAKA
  // =========================
  {
    id: "nimhans",
    name: "NIMHANS Bengaluru",
    lat: 12.9430,
    lng: 77.5963,
    type: "specialist",
  },
  {
    id: "bowring",
    name: "Bowring & Lady Curzon Hospital",
    lat: 12.9789,
    lng: 77.5917,
    type: "hospital",
  },

  // =========================
  // 🟦 BIHAR (East)
  // =========================
  {
    id: "aiims-patna",
    name: "AIIMS Patna",
    lat: 25.5941,
    lng: 85.1376,
    type: "hospital",
  },

  // =========================
  // 🟧 RAJASTHAN
  // =========================
  {
    id: "aiims-jodhpur",
    name: "AIIMS Jodhpur",
    lat: 26.2389,
    lng: 73.0243,
    type: "hospital",
  },

  // =========================
  // 🟫 WEST BENGAL
  // =========================
  {
    id: "sskm-kolkata",
    name: "SSKM Hospital Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    type: "hospital",
  },

  // =========================
  // 🚑 AMBULANCES (Pan-India samples)
  // =========================
  {
    id: "ambulance-108-delhi",
    name: "Emergency Ambulance 108 - Delhi",
    lat: 28.6139,
    lng: 77.2090,
    type: "ambulance",
  },
  {
    id: "ambulance-108-roorkee",
    name: "Emergency Ambulance 108 - Roorkee",
    lat: 29.8680,
    lng: 77.8920,
    type: "ambulance",
  },
  {
    id: "aiims-delhi",
    name: "AIIMS Delhi",
    lat: 28.5672,
    lng: 77.2100,
    type: "hospital",
  },
  
  {
    id: "aiims-rishikesh",
    name: "AIIMS Rishikesh",
    lat: 30.0765,
    lng: 78.2819,
    type: "hospital",
  },

  // 🏥 Roorkee
  {
    id: "civil-roorkee",
    name: "Civil Hospital Roorkee",
    lat: 29.8666,
    lng: 77.8917,
    type: "hospital",
  },

  // 🧑‍⚕️ Specialist
  {
    id: "ortho-roorkee",
    name: "OrthoCare Specialist",
    lat: 29.8701,
    lng: 77.8992,
    type: "specialist",
  },

  // 🚑 Ambulance
  {
    id: "ambulance-108",
    name: "108 Ambulance – Roorkee",
    lat: 29.8679,
    lng: 77.8934,
    type: "ambulance",
  },
];

/* =========================
   Main Component
========================= */
export default function IndiaMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[420px] rounded-xl bg-muted animate-pulse flex items-center justify-center">
        Loading map…
      </div>
    );
  }

  return (
    <div className="w-full h-[420px] rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={[22.9734, 78.6569]} // 🇮🇳 India center
        zoom={5}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* OPTIONAL auto-fit */}
        {/* <FitBounds locations={LOCATIONS} /> */}

        {LOCATIONS.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={ICONS[loc.type]}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{loc.name}</div>
                <div className="text-xs capitalize text-muted-foreground">
                  {loc.type}
                </div>
                {loc.description && (
                  <div className="mt-1">{loc.description}</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
