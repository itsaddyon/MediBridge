// src/data/locations.ts
export type LocationItem = {
  id: string;
  type: "clinic" | "doctor";
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

const LOCATIONS: LocationItem[] = [
  {
    id: "c1",
    type: "clinic",
    name: "PHC Rampur",
    lat: 26.8890,
    lng: 80.7831,
    state: "Uttar Pradesh",
    village: "Rampur",
    contact: "+91-98xxxx",
    description: "Basic OP, vaccination, referral hub",
    lastUpdated: "2025-10-01",
  },
  {
    id: "d1",
    type: "doctor",
    name: "Dr. Meera Sharma (Cardio)",
    lat: 19.0760,
    lng: 72.8777,
    state: "Maharashtra",
    specialty: "Cardiology",
    contact: "+91-99xxxx",
    description: "Tele-referral slots Wed/Fri",
    lastUpdated: "2025-10-10",
  },
  {
    id: "c2",
    type: "clinic",
    name: "Village Health Post Sundarpur",
    lat: 23.2599,
    lng: 77.4126,
    state: "Madhya Pradesh",
    village: "Sundarpur",
    contact: "+91-97xxxx",
    description: "Maternal health focus",
    lastUpdated: "2025-09-15",
  },
];

export default LOCATIONS;
