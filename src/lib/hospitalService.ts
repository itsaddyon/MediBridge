import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type HospitalBed = {
  id?: string;
  name: string;
  totalBeds: number;
  availableBeds: number;
  lastUpdated?: any;
};

const colRef = collection(db, "hospitals");

export function listenHospitals(setter: (h: HospitalBed[]) => void) {
  return onSnapshot(colRef, (snap) => {
    const data = snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as HospitalBed),
    }));
    setter(data);
  });
}

export async function addHospital(h: HospitalBed) {
  await addDoc(colRef, {
    ...h,
    lastUpdated: serverTimestamp(),
  });
}

export async function updateHospital(
  id: string,
  data: Partial<HospitalBed>
) {
  await updateDoc(doc(db, "hospitals", id), {
    ...data,
    lastUpdated: serverTimestamp(),
  });
}
