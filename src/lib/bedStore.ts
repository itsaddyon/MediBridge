export type HospitalBed = {
  id: string;
  name: string;
  totalBeds: number;
  availableBeds: number;
  needs?: string; // free-form note of extra things hospital requires
  lastUpdated?: string;
};

const KEY = "medibridge_hospitals_beds";

function defaultHospitals(): HospitalBed[] {
  return [
    { id: "h_1", name: "District Hospital - Rajpur", totalBeds: 120, availableBeds: 12, needs: "", lastUpdated: new Date().toISOString() },
    { id: "h_2", name: "Community Hospital - Sundarpur", totalBeds: 42, availableBeds: 3, needs: "", lastUpdated: new Date().toISOString() },
    { id: "h_3", name: "Government Medical Center - Nadi", totalBeds: 88, availableBeds: 28, needs: "", lastUpdated: new Date().toISOString() },
  ];
}

export function readHospitals(): HospitalBed[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const defs = defaultHospitals();
      localStorage.setItem(KEY, JSON.stringify(defs));
      return defs;
    }
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return defaultHospitals();
    return arr as HospitalBed[];
  } catch {
    return defaultHospitals();
  }
}

export function writeHospitals(list: HospitalBed[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    // best-effort broadcast for same-window listeners
    try {
      window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: JSON.stringify(list) }));
    } catch {}
  } catch {}
}

export function updateHospital(id: string, patch: Partial<HospitalBed>) {
  const list = readHospitals();
  const idx = list.findIndex((h) => h.id === id);
  if (idx === -1) return null;
  const updated = { ...list[idx], ...patch, lastUpdated: new Date().toISOString() };
  list[idx] = updated;
  writeHospitals(list);
  return updated;
}

export function addHospital(h: Omit<HospitalBed, "id" | "lastUpdated">) {
  const list = readHospitals();
  const id = `h_${Date.now()}`;
  const entry: HospitalBed = { id, ...h, lastUpdated: new Date().toISOString() };
  list.unshift(entry);
  writeHospitals(list);
  return entry;
}

export { KEY };
