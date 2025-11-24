// src/components/ChatBot.tsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Small client-side chatbot that suggests prompts and finds nearby clinics
 * using the browser geolocation API and a local sample dataset (replace with API as needed).
 *
 * Usage:
 *  - Place <ChatBot /> in your page (e.g. Index.tsx).
 *  - On suggestion click, it will request location and display nearest clinics.
 */

/* ---------- helper: haversine distance (km) ---------- */
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* ---------- sample clinics dataset (demo) ----------
   Replace or load dynamically from your backend.
   Give each clinic a { id, name, type, lat, lon, address, phone }.
*/
const SAMPLE_CLINICS = [
  { id: "c1", name: "Rural Health Center - Rampur", type: "PHC", lat: 29.864, lon: 77.888, address: "Rampur village, Block A", phone: "+91 98100 00001" },
  { id: "c2", name: "District Hospital - City", type: "Hospital", lat: 29.870, lon: 77.890, address: "District Rd, City Center", phone: "+91 98100 00002" },
  { id: "c3", name: "Community Clinic - Bazar", type: "Clinic", lat: 29.860, lon: 77.880, address: "Market Road, Bazar", phone: "+91 98100 00003" },
  { id: "c4", name: "Primary Health SubCenter - Village B", type: "PHC", lat: 29.855, lon: 77.875, address: "Village B, Sector 5", phone: "+91 98100 00004" },
  { id: "c5", name: "City Medical Center", type: "Hospital", lat: 29.880, lon: 77.895, address: "MG Road, City", phone: "+91 98100 00005" },
];

/* ---------- Component ---------- */
export default function ChatBot(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { id: string; from: "bot" | "user"; text: string }[]
  >([
    { id: "m1", from: "bot", text: "Hi! I can help you find nearby clinics or hospitals. Try a suggestion below." },
  ]);

  const [loading, setLoading] = useState(false);
  const [nearby, setNearby] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // default suggestions
  const suggestions = [
    { id: "s1", label: "Find clinics near me", prompt: "nearby_clinics" },
    { id: "s2", label: "Find hospitals nearby", prompt: "nearby_hospitals" },
    { id: "s3", label: "Show PHC/Primary health centers", prompt: "nearby_phc" },
  ];

  // append a message
  function pushMessage(from: "bot" | "user", text: string) {
    setMessages((m) => [...m, { id: String(Date.now()) + Math.random(), from, text }]);
    // scroll after a tick
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 60);
  }

  // core: locate user then find nearest clinics (filter by type if provided)
  async function locateAndFind(prompt: string) {
    setNearby(null);
    setError(null);
    setLoading(true);
    pushMessage("user", prompt === "nearby_clinics" ? "Find clinics near me" : (prompt === "nearby_hospitals" ? "Find hospitals near me" : "Find PHC nearby"));

    function onSuccess(position: GeolocationPosition) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      pushMessage("bot", `Got your location (lat: ${lat.toFixed(4)}, lon: ${lon.toFixed(4)}). Searching...`);
      findNearest(lat, lon, prompt);
    }

    function onError(posError: GeolocationPositionError) {
      // allow manual lat/lon input fallback
      setLoading(false);
      setError("Geolocation failed or permission denied. Please enter your approximate coordinates manually.");
      pushMessage("bot", "I couldn't get your location. Please enter latitude and longitude below or allow location access.");
    }

    if ("geolocation" in navigator) {
      // prompt user for permission
      navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 12000 });
    } else {
      onError({ code: 0, message: "Geolocation not supported" } as any);
    }
  }

  // compute distances & set nearby list (demo local dataset)
  function findNearest(lat: number, lon: number, prompt: string) {
    const desiredType =
      prompt === "nearby_hospitals" ? "Hospital" : prompt === "nearby_phc" ? "PHC" : null;

    const withDist = SAMPLE_CLINICS.map((c) => ({
      ...c,
      distanceKm: haversineDistanceKm(lat, lon, c.lat, c.lon),
    }));

    const filtered = withDist
      .filter((c) => (desiredType ? c.type === desiredType : true))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 5);

    setNearby(filtered);
    setLoading(false);
    if (filtered.length === 0) {
      pushMessage("bot", "No nearby clinics found in the demo dataset. You can add more entries to SAMPLE_CLINICS or hook an API.");
    } else {
      pushMessage("bot", `Found ${filtered.length} nearby ${desiredType ?? "clinics/hospitals"} — tap one for details.`);
    }
  }

  // when user provides manual coords via a small inline form
  function handleManualSearch(latStr: string, lonStr: string, prompt: string) {
    const lat = Number(latStr);
    const lon = Number(lonStr);
    if (!isFinite(lat) || !isFinite(lon)) {
      setError("Please enter valid numeric coordinates (e.g. 29.86, 77.88)");
      return;
    }
    setError(null);
    setLoading(true);
    pushMessage("user", `Manual location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    setTimeout(() => findNearest(lat, lon, prompt), 350);
  }

  // click a suggestion
  function handleSuggestion(s: { id: string; label: string; prompt: string }) {
    locateAndFind(s.prompt);
  }

  // click a clinic result to reveal details
  function showClinicPopup(c: any) {
    pushMessage("bot", `${c.name} — ${c.address} • ${c.phone} • ${c.distanceKm.toFixed(2)} km away`);
    // also open google maps in a new tab
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.lat + "," + c.lon)}&query_place_id=${encodeURIComponent(c.name)}`;
    window.open(mapsUrl, "_blank");
  }

  // small helper to render message bubble
  function renderMessage(m: { id: string; from: "bot" | "user"; text: string }) {
    const isBot = m.from === "bot";
    return (
      <div key={m.id} className={`flex ${isBot ? "justify-start" : "justify-end"} mb-2`}>
        <div className={`max-w-[78%] p-2 rounded-lg ${isBot ? "bg-white/6 text-white" : "bg-teal-400 text-slate-900"} text-sm`}>
          {m.text}
        </div>
      </div>
    );
  }

  // a11y: focus open/close button
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, messages]);

  return (
    <div aria-live="polite">
      {/* floating chat button */}
      <div style={{ position: "fixed", right: 18, bottom: 18, zIndex: 9999 }}>
        {!open ? (
          <button
            aria-label="Open assistant"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-400 hover:bg-teal-300 text-slate-900 shadow-lg"
          >
            <span style={{ fontWeight: 700 }}>Ask MediBot</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        ) : (
          <div className="w-[360px] max-w-[92vw] bg-slate-900/90 text-white rounded-xl shadow-2xl border border-white/8">
            <div className="flex items-center justify-between p-3 border-b border-white/6">
              <div className="flex items-center gap-2">
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#0ea5a4", display: "flex", alignItems: "center", justifyContent: "center", color: "#042022", fontWeight: 700 }}>MB</div>
                <div>
                  <div style={{ fontWeight: 700 }}>MediBot</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Find nearby clinics & hospitals</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button aria-label="Close assistant" onClick={() => setOpen(false)} className="px-2 py-1 rounded hover:bg-white/6">Close</button>
              </div>
            </div>

            {/* messages */}
            <div ref={scrollRef} style={{ maxHeight: 280, overflowY: "auto", padding: 12 }}>
              {messages.map(renderMessage)}
              {loading ? <div className="text-sm text-slate-300">Searching for nearby clinics...</div> : null}
              {error ? <div className="text-sm text-rose-300 mt-2">{error}</div> : null}
            </div>

            {/* suggestions */}
            <div style={{ padding: 10, borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSuggestion(s)}
                    className="px-3 py-1 rounded-md bg-white/6 hover:bg-white/8 text-sm"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* manual lat/lon input fallback (hidden until error) */}
              {error ? (
                <ManualCoordForm onSubmit={(latStr, lonStr) => handleManualSearch(latStr, lonStr, "nearby_clinics")} />
              ) : null}

              {/* results list */}
              {nearby && nearby.length > 0 ? (
                <div style={{ paddingTop: 6 }}>
                  {nearby.map((c) => (
                    <div key={c.id} className="p-2 rounded-md bg-white/4 mb-2 flex items-start justify-between">
                      <div>
                        <div style={{ fontWeight: 700 }}>{c.name} <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>• {c.type}</span></div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>{c.address}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{(c.distanceKm).toFixed(2)} km away • {c.phone}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <button onClick={() => showClinicPopup(c)} className="px-3 py-1 rounded bg-teal-400 text-slate-900 text-sm">Open</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- small manual coord form ---------- */
function ManualCoordForm({ onSubmit }: { onSubmit: (lat: string, lon: string) => void }) {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(lat, lon); }} className="flex gap-2 items-center">
      <input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="lat" className="px-2 py-1 rounded bg-white/6 text-sm outline-none" />
      <input value={lon} onChange={(e) => setLon(e.target.value)} placeholder="lon" className="px-2 py-1 rounded bg-white/6 text-sm outline-none" />
      <button type="submit" className="px-3 py-1 rounded bg-emerald-300 text-slate-900 text-sm">Search</button>
    </form>
  );
}
