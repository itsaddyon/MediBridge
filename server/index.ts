// server/index.ts
// server/index.ts (top of file) — use CommonJS require for runtime compatibility
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// type aliases (TS-only)
type Req = import("express").Request;
type Res = import("express").Response;

const app = express();
app.use(cors());
app.use(express.json());


// --- sample in-memory locations (fallback) ---
const SAMPLE_LOCATIONS = [
  { id: "c1", type: "clinic", name: "PHC Rampur", lat: 26.889, lng: 80.7831, village: "Rampur", state: "Uttar Pradesh", contact: "+9198xxxx", description: "Basic OP, vaccination, referral hub" },
  { id: "d1", type: "doctor", name: "Dr. Meera Sharma (Cardio)", lat: 19.076, lng: 72.8777, state: "Maharashtra", specialty: "Cardiology", contact: "+9199xxxx", description: "Tele-referral slots Wed/Fri" },
  { id: "c2", type: "clinic", name: "Village Health Post Sundarpur", lat: 23.2599, lng: 77.4126, state: "Madhya Pradesh", village: "Sundarpur", contact: "+9197xxxx", description: "Maternal health focus" }
];

function readLocationsFromFile() {
  try {
    const filePath = path.join(__dirname, "data", "locations.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && parsed.locations) return parsed.locations;
    }
  } catch (err) {
    console.warn("readLocationsFromFile error:", (err as Error).message);
  }
  return SAMPLE_LOCATIONS;
}

// GET /api/locations
app.get("/api/locations", (req: Req, res: Res) => {
  const locations = readLocationsFromFile();
  return res.json({ ok: true, locations });
});

// POST /api/auth/clinic-login (demo)
app.post("/api/auth/clinic-login", (req: Req, res: Res) => {
  const { identifier, password } = req.body || {};
  if (!identifier || !password) return res.status(400).json({ ok: false, message: "Missing credentials" });

  // demo credentials
  if (identifier === "demo@clinic" && password === "demo123") {
    return res.json({
      ok: true,
      token: "demo-token-abc123",
      clinic: { id: "demo-clinic", name: "Demo PHC Clinic", email: "demo@clinic" },
    });
  }

  return res.status(401).json({ ok: false, message: "Invalid credentials" });
});

// POST /api/refer (demo)
app.post("/api/refer", (req: Req, res: Res) => {
  console.log("Referral received:", req.body);
  return res.json({ ok: true, message: "Referral received" });
});

// health
app.get("/health", (req: Req, res: Res) => res.json({ ok: true, now: new Date().toISOString() }));

const PORT = Number(process.env.PORT || 4001);
app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`));
