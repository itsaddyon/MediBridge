// src/main.tsx
import "leaflet/dist/leaflet.css";
/* marker cluster CSS (needed for clustering UI) */
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// --- Leaflet default icon fix for Vite (important!) ---
// Vite doesn't copy leaflet's marker images automatically, so we import them
// and merge into the default icon options so markers render properly.
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

createRoot(document.getElementById("root")!).render(<App />);
