// src/components/IndiaMap.tsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

/* -------------------------
   Types & sample fallback data
   ------------------------- */
type LocationItem = {
  id: string;
  type: "clinic" | "doctor" | "pharmacy" | "lab" | "ambulance";
  name: string;
  lat: number;
  lng: number;
  state?: string;
  village?: string;
  contact?: string;
  description?: string;
  specialty?: string;
  lastUpdated?: string;
};

const FALLBACK: LocationItem[] = [
  { id: "c1", type: "clinic", name: "PHC Rampur", lat: 26.889, lng: 80.7831, state: "Uttar Pradesh", description: "Primary health center" },
  { id: "d1", type: "doctor", name: "Dr. Meera Sharma", lat: 19.076, lng: 72.8777, specialty: "Cardiology", description: "Visiting specialist" },
  { id: "p1", type: "pharmacy", name: "Sundar Pharmacy", lat: 22.7, lng: 75.9, description: "24/7 medicines" },
  { id: "l1", type: "lab", name: "Rapid Labs", lat: 23.25, lng: 77.41, description: "Pathology & tests" },
  { id: "a1", type: "ambulance", name: "Ambulance 144", lat: 21.1458, lng: 79.0882, description: "Emergency response" },
];

/* -------------------------
   Colored pulsing icons
   ------------------------- */
function createDivIcon(color: string, size = 28) {
  const html = `
    <span style="
      display:inline-block;
      width:${size}px;height:${size}px;
      border-radius:50%;
      box-shadow: 0 0 10px ${color}66;
      background: radial-gradient(circle at 35% 30%, #fff8 10%, ${color});
      border: 3px solid rgba(255,255,255,0.6);
      ">
    </span>
  `;
  return L.divIcon({
    className: "custom-marker",
    html,
    iconSize: [size, size],
    iconAnchor: [Math.round(size / 2), size],
    popupAnchor: [0, -size - 6],
  });
}

const ICONS: Record<LocationItem["type"], L.DivIcon> = {
  clinic: createDivIcon("#2DD4BF"), // teal
  doctor: createDivIcon("#8B5CF6"), // purple
  pharmacy: createDivIcon("#F59E0B"), // amber
  lab: createDivIcon("#06B6D4"), // cyan
  ambulance: createDivIcon("#EF4444"), // red
};

/* -------------------------
   Fit bounds helper
   ------------------------- */
function FitBoundsOnChange({ markersGroup }: { markersGroup: any | null }) {
  const map = useMap();
  useEffect(() => {
    if (!markersGroup) return;
    const layerBounds = markersGroup.getBounds();
    if (layerBounds.isValid()) {
      map.fitBounds(layerBounds, { padding: [40, 40], maxZoom: 8 });
    }
  }, [markersGroup, map]);
  return null;
}

/* -------------------------
   Main component
   ------------------------- */
export default function IndiaMap() {
  const [data, setData] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  // note: we keep error internally but DO NOT display the red message anymore
  const [error] = useState<string | null>(null);

  const [filterClinic, setFilterClinic] = useState(true);
  const [filterDoctor, setFilterDoctor] = useState(true);
  const [filterPharmacy, setFilterPharmacy] = useState(true);
  const [filterLab, setFilterLab] = useState(true);
  const [filterAmbulance, setFilterAmbulance] = useState(true);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<LocationItem | null>(null);

  const clusterRef = useRef<any | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // API url: uses VITE_API_BASE if set, otherwise same-origin /api
  const API = import.meta.env.VITE_API_BASE
    ? `${import.meta.env.VITE_API_BASE}/api/locations`
    : "/api/locations";

  useEffect(() => {
    setLoading(true);
    fetch(API)
      .then(async (r) => {
        const text = await r.text().catch(() => "");
        let json;
        try {
          json = text ? JSON.parse(text) : null;
        } catch (err) {
          console.warn("[IndiaMap] invalid JSON from API:", text);
          throw new Error("Invalid response");
        }
        // accept { locations: [...] } or raw array
        const locs: LocationItem[] = Array.isArray(json) ? json : json?.locations ?? [];
        return locs;
      })
      .then((locs) => {
        if (!locs || !locs.length) {
          // fallback to demo if API gives empty array
          setData(FALLBACK);
        } else {
          setData(locs);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("[IndiaMap] fetch error:", err);
        // fallback on error
        setData(FALLBACK);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API]);

  // filter logic
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((l) => {
      if (l.type === "clinic" && !filterClinic) return false;
      if (l.type === "doctor" && !filterDoctor) return false;
      if (l.type === "pharmacy" && !filterPharmacy) return false;
      if (l.type === "lab" && !filterLab) return false;
      if (l.type === "ambulance" && !filterAmbulance) return false;
      if (!q) return true;
      return (
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.state && l.state.toLowerCase().includes(q)) ||
        (l.village && l.village.toLowerCase().includes(q)) ||
        (l.specialty && l.specialty.toLowerCase().includes(q))
      );
    });
  }, [data, filterClinic, filterDoctor, filterPharmacy, filterLab, filterAmbulance, query]);

  // create / refresh markers
  useEffect(() => {
    if (!mapRef.current) return;

    // create cluster group if missing
    if (!clusterRef.current) {
      clusterRef.current = (L as any).markerClusterGroup({
        showCoverageOnHover: true,
        spiderfyOnMaxZoom: true,
        chunkedLoading: true,
        // custom cluster icon can be added here if desired
      });
      mapRef.current.addLayer(clusterRef.current);
    } else {
      clusterRef.current.clearLayers();
    }

    // Add markers
    filtered.forEach((loc) => {
      if (!loc || typeof loc.lat !== "number" || typeof loc.lng !== "number") return;

      const marker = L.marker([loc.lat, loc.lng], {
        icon: ICONS[loc.type] ?? createDivIcon("#9CA3AF"),
        title: loc.name,
      });

      const popupHTML = `<div style="min-width:200px;font-family:inherit">
        <strong>${loc.name}</strong><br/>
        <small style="color:#6b7280">${loc.village ?? loc.state ?? ""}</small>
        <p style="margin:6px 0 0 0">${loc.description ?? ""}</p>
        <div style="margin-top:8px;font-size:13px"><strong>Contact:</strong> ${loc.contact ?? "-"}</div>
      </div>`;

      marker.bindPopup(popupHTML, { maxWidth: 320 });

      marker.on("click", () => {
        setSelected(loc);
        if (mapRef.current) {
          mapRef.current.setView([loc.lat, loc.lng], Math.max(mapRef.current.getZoom(), 6), { animate: true });
        }
      });

      clusterRef.current.addLayer(marker);
    });

    // fit bounds (safe)
    setTimeout(() => {
      try {
        const bounds = clusterRef.current.getBounds();
        if (bounds.isValid() && mapRef.current) {
          mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
        }
      } catch (err) {
        console.warn("fitBounds error", err);
      }
    }, 120);

    return () => {
      try {
        clusterRef.current?.clearLayers();
      } catch (err) {
        /* ignore */
      }
    };
  }, [filtered]);

  // capture map instance
  function CaptureMapInstance() {
    const map = useMap();
    useEffect(() => {
      mapRef.current = map;
      map.setMinZoom(4);
      map.setMaxZoom(12);
      map.setView([22.0, 80.0], 5);
      return () => {
        mapRef.current = null;
      };
    }, [map]);
    return null;
  }

  /* small legend component */
  function Legend() {
    const items: { label: string; color: string; key: LocationItem["type"] }[] = [
      { key: "clinic", label: "Clinic", color: "#2DD4BF" },
      { key: "doctor", label: "Doctor", color: "#8B5CF6" },
      { key: "pharmacy", label: "Pharmacy", color: "#F59E0B" },
      { key: "lab", label: "Lab", color: "#06B6D4" },
      { key: "ambulance", label: "Ambulance", color: "#EF4444" },
    ];
    return (
      <div className="absolute left-6 top-6 z-50 bg-white/80 backdrop-blur px-3 py-2 rounded-lg shadow-sm text-sm">
        <div className="font-semibold mb-1">Legend</div>
        <div className="flex gap-2 items-center flex-col">
          {items.map((it) => (
            <div key={it.label} className="flex items-center gap-2 w-full justify-between">
              <div className="flex items-center gap-2">
                <span style={{ width: 14, height: 14, borderRadius: 8, background: it.color, boxShadow: `0 0 6px ${it.color}60` }} />
                <span>{it.label}</span>
              </div>
              <input
                type="checkbox"
                checked={
                  it.key === "clinic"
                    ? filterClinic
                    : it.key === "doctor"
                    ? filterDoctor
                    : it.key === "pharmacy"
                    ? filterPharmacy
                    : it.key === "lab"
                    ? filterLab
                    : filterAmbulance
                }
                onChange={() => {
                  if (it.key === "clinic") setFilterClinic((v) => !v);
                  if (it.key === "doctor") setFilterDoctor((v) => !v);
                  if (it.key === "pharmacy") setFilterPharmacy((v) => !v);
                  if (it.key === "lab") setFilterLab((v) => !v);
                  if (it.key === "ambulance") setFilterAmbulance((v) => !v);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Controls */}
      <div className="map-controls" style={{ position: "absolute", left: 20, top: 18, zIndex: 60 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", background: "rgba(255,255,255,0.9)", padding: "10px 14px", borderRadius: 10, boxShadow: "0 6px 20px rgba(2,6,23,0.12)" }}>
          <input
            placeholder="Search name / state / village"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 8, border: "none", minWidth: 280 }}
          />
          <button onClick={() => { setFilterClinic(true); setFilterDoctor(true); setFilterPharmacy(true); setFilterLab(true); setFilterAmbulance(true); setQuery(""); }} style={{ padding: "8px 12px", borderRadius: 10 }}>Reset</button>
        </div>
      </div>

      {/* Legend */}
      <Legend />

      <div className="h-[340px] md:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden shadow-2xl bg-white/5 border border-white/10">
        <MapContainer center={L.latLng(22, 80) as L.LatLngExpression} zoom={5} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
          <CaptureMapInstance />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          {clusterRef.current && <FitBoundsOnChange markersGroup={clusterRef.current} />}
        </MapContainer>
      </div>

      {/* loading indicator (optional) */}
      {loading && <div className="text-center mt-4 text-sm text-blue-200">Loading locations...</div>}

      {/* note: we intentionally do not render the old red error message */}
      {/* side detail */}
      {selected && (
        <div className="absolute right-4 top-20 z-50 bg-white/95 p-4 rounded-lg shadow-lg w-80">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-lg">{selected.name}</h4>
              <p className="text-sm text-muted-foreground">{selected.village ?? selected.state}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground">✕</button>
          </div>

          <div className="mt-3 text-sm">
            <p><strong>Type:</strong> {selected.type}</p>
            {selected.specialty && <p><strong>Specialty:</strong> {selected.specialty}</p>}
            <p><strong>Contact:</strong> {selected.contact}</p>
            <p className="mt-2">{selected.description}</p>
            <p className="text-xs text-muted-foreground mt-2">Last update: {selected.lastUpdated}</p>

            <div className="mt-3 flex gap-2">
              <a className="text-sm underline text-primary" href={`tel:${selected.contact}`}>Call</a>
              <button onClick={() => { /* wire referral modal here */ }} className="ml-auto px-2 py-1 bg-primary text-white rounded text-sm">Refer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
