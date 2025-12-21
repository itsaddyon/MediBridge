export type HospitalBed = {
  id: string;
  name: string;
  totalBeds: number;
  availableBeds: number;
  lastUpdated: string;
  needs?: string;
};

export const KEY = "hospital_beds";

/* ---------------- READ ---------------- */
export function readHospitals(): HospitalBed[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return []; // ❌ NO DEFAULT DATA

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

/* ---------------- WRITE ---------------- */
function saveHospitals(hospitals: HospitalBed[]) {
  localStorage.setItem(KEY, JSON.stringify(hospitals));
}

/* ---------------- ADD ---------------- */
export function addHospital(input: {
  name: string;
  totalBeds: number;
  availableBeds: number;
}) {
  const hospitals = readHospitals();

  const hospital: HospitalBed = {
    id: crypto.randomUUID(),
    name: input.name,
    totalBeds: input.totalBeds,
    availableBeds: input.availableBeds,
    lastUpdated: new Date().toISOString(),
  };

  saveHospitals([...hospitals, hospital]);
}

/* ---------------- UPDATE ---------------- */
export function updateHospital(
  id: string,
  updates: Partial<Omit<HospitalBed, "id">>
) {
  const hospitals = readHospitals();

  const updated = hospitals.map((h) =>
    h.id === id
      ? { ...h, ...updates, lastUpdated: new Date().toISOString() }
      : h
  );

  saveHospitals(updated);
}
