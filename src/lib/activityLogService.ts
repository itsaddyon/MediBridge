import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/* =========================
   Activity Log Types
========================= */

export type ActivityLogType =
  | "PATIENT_REGISTERED"
  | "REFERRAL_CREATED"
  | "REFERRAL_STATUS_UPDATED"
  | "BED_UPDATED"
  | "EMERGENCY_TRIGGERED"
  | "LOGIN"
  | "LOGOUT";

export type ActivityActorRole = "admin" | "clinic" | "doctor" | "system";

export interface ActivityLog {
  type: ActivityLogType;
  message: string;
  actorRole: ActivityActorRole;
  actorId?: string;
  metadata?: Record<string, unknown>;
}

/* =========================
   Firestore Collection
========================= */

const activityLogsRef = collection(db, "activityLogs");

/* =========================
   Create Activity Log
========================= */

export const logActivity = async (log: ActivityLog) => {
  try {
    await addDoc(activityLogsRef, {
      ...log,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to write activity log:", error);
  }
};
