/* ========= Shared Domain Types ========= */

export type Patient = {
  id: string;
  name: string;
  age?: string;
  gender?: string;
  phone?: string;
  email?: string;
  bloodGroup?: string;
  address?: string;
  createdAt?: unknown;
};

export type ReferralStatus =
  | "pending"
  | "accepted"
  | "diagnosed"
  | "closed";

export type Referral = {
  id: string;
  patientId: string;
  patientName: string;

  hospital: string;
  department: string;
  urgency: string;
  symptoms: string;

  diagnosis?: string;
  tests?: string;
  medications?: string;

  status: ReferralStatus;
  date: string;
  createdAt?: unknown;
};
