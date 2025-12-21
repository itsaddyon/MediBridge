import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { logActivity } from "./activityLogService";

/* =========================
   Types
========================= */

export interface Patient {
  id?: string;
  name: string;
  age?: string;
  gender?: string;
  phone?: string;
  email?: string;
  bloodGroup?: string;
  createdAt?: any;
}

/* =========================
   Firestore Collection
========================= */

const patientsRef = collection(db, "patients");

/* =========================
   Register Patient
========================= */

export const registerPatient = async (patient: Patient) => {
  const docRef = await addDoc(patientsRef, {
    ...patient,
    createdAt: serverTimestamp(),
  });

  /* 🔔 Activity Log */
  await logActivity({
    type: "PATIENT_REGISTERED",
    message: `Patient ${patient.name} registered`,
    actorRole: "clinic",
    metadata: {
      patientId: docRef.id,
      patientName: patient.name,
    },
  });

  return docRef.id;
};

/* =========================
   Get All Patients
========================= */

export const getAllPatients = async (): Promise<Patient[]> => {
  const q = query(patientsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Patient),
  }));
};
