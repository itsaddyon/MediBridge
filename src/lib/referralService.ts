import { db } from "./firebase";
import type { ReferralStatus } from "@/types";
import { logActivity } from "./activityLogService";


import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

export type Referral = {
  id: string;
  patientId: string;
  patientName: string;
  hospital: string;
  department: string;
  urgency: string;
  symptoms: string;
  diagnosis: string;
  tests: string;
  medications: string;
  status: "pending" | "accepted" | "diagnosed" | "closed";
  createdAt?: any;
};

/* CREATE REFERRAL (Clinic) */

export const createReferral = async (data: Omit<Referral, "id" | "createdAt">) => {
  const docRef = await addDoc(collection(db, "referrals"), {
    ...data,
    createdAt: serverTimestamp(),
  });

  /* 🔔 Activity Log */
  await logActivity({
    type: "REFERRAL_CREATED",
    message: `Referral created for ${data.patientName} to ${data.hospital}`,
    actorRole: "clinic",
    metadata: {
      referralId: docRef.id,
      patientId: data.patientId,
      patientName: data.patientName,
      hospital: data.hospital,
      diagnosis: data.diagnosis,
    },
  });

  return docRef.id;
};

export const createReferralDB = createReferral;

/* GET REFERRALS FOR CLINIC */
export const getClinicReferrals = async () => {
  const q = query(
    collection(db, "referrals"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...(d.data() as Omit<Referral, "id">),
  }));
};


/* GET REFERRALS FOR DOCTOR */
export const getDoctorReferrals = async (doctorId: string) => {
  const q = query(
    collection(db, "referrals"),
    where("doctorId", "==", doctorId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...(d.data() as Omit<Referral, "id">),
  }));
};

/* UPDATE REFERRAL STATUS */
export const updateReferralStatus = async (
  referralId: string,
  status: Referral["status"]
) => {

  await updateDoc(doc(db, "referrals", referralId), {
    status,
  });

  /* 🔔 Activity Log */
  await logActivity({
    type: "REFERRAL_STATUS_UPDATED",
    message: `Referral ${referralId} status updated to ${status}`,
    actorRole: "doctor",
    metadata: {
      referralId,
      newStatus: status,
    },
  });
};

// Canonical exports (DO NOT REMOVE)
export const getAllReferralsDB = getClinicReferrals;
export const updateReferralStatusDB = updateReferralStatus;

