// src/main.tsx
import "leaflet/dist/leaflet.css";
/* marker cluster CSS (needed for clustering UI) */
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// --- Leaflet default icon fix for Vite (important!) ---
// Vite doesn't copy leaflet's marker images automatically, so we set the paths directly
import L from "leaflet";

// Fix for default markers in Vite
delete (L.Icon.Default.prototype as unknown)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Initialize theme from localStorage before React mounts
const STORAGE_KEY = "medibridge_theme";
type Theme = "light" | "dark" | "system";

function applyTheme(theme: Theme) {
  if (theme === "system") {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", prefersDark);
  } else {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
}

// Apply saved theme immediately on app load
try {
  const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
  const theme = (savedTheme as Theme) ?? "system";
  applyTheme(theme);
} catch {
  // Fallback to system preference
  applyTheme("system");
}

createRoot(document.getElementById("root")!).render(<App />);
