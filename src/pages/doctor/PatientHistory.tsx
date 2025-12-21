import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import type { Referral, Patient } from "@/types";

/*
  Patient History (Doctor)
  - Combines Patients + Referrals
  - Shows full patient profile + medical history
*/

type PatientWithReferrals = Patient & {
  referrals: Referral[];
};

export default function PatientHistory() {
  const [patients, setPatients] = useState<Record<string, Patient>>({});
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [search, setSearch] = useState("");

  /* Listen to patients */
  useEffect(() => {
    const unsubPatients = onSnapshot(
      collection(db, "patients"),
      (snap) => {
        const map: Record<string, Patient> = {};
        snap.docs.forEach((d) => {
          map[d.id] = {
            id: d.id,
            ...(d.data() as Omit<Patient, "id">),
          };
        });
        setPatients(map);
      }
    );

    return () => unsubPatients();
  }, []);

  /* Listen to referrals */
  useEffect(() => {
    const q = query(
      collection(db, "referrals"),
      orderBy("createdAt", "desc")
    );

    const unsubReferrals = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Referral, "id">),
      }));
      setReferrals(list);
    });

    return () => unsubReferrals();
  }, []);

  /* Merge patients + referrals */
  const merged: PatientWithReferrals[] = Object.values(patients)
    .map((p) => ({
      ...p,
      referrals: referrals.filter(
        (r) => r.patientId === p.id
      ),
    }))
    .filter((p) => p.referrals.length > 0);

  const filtered = merged.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Patient History</h1>
          <p className="text-muted-foreground mt-2">
            Complete patient profile and referral history
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Patient Cards */}
        {filtered.length === 0 ? (
          <div className="text-muted-foreground">
            No patient history available.
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border bg-card p-5"
              >
                {/* Patient Info */}
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {p.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {p.gender} • {p.age} years
                    </p>
                  </div>

                  <div className="text-sm">
                    {p.phone && <p><b>Phone:</b> {p.phone}</p>}
                    {p.email && <p><b>Email:</b> {p.email}</p>}
                    {p.bloodGroup && (
                      <p><b>Blood Group:</b> {p.bloodGroup}</p>
                    )}
                    {p.address && (
                      <p><b>Address:</b> {p.address}</p>
                    )}
                  </div>
                </div>

                {/* Referral History */}
                <div className="mt-4 space-y-3">
                  {p.referrals.map((r) => (
                    <div
                      key={r.id}
                      className="rounded border p-3 text-sm"
                    >
                      <div className="flex justify-between">
                        <div>
                          <b>{r.department}</b> • {r.hospital}
                        </div>
                        <span className="capitalize">
                          {r.status}
                        </span>
                      </div>

                      <p className="mt-1">
                        <b>Urgency:</b> {r.urgency}
                      </p>
                      <p>
                        <b>Symptoms:</b> {r.symptoms}
                      </p>

                      {r.diagnosis && (
                        <p><b>Diagnosis:</b> {r.diagnosis}</p>
                      )}
                      {r.tests && (
                        <p><b>Tests:</b> {r.tests}</p>
                      )}
                      {r.medications && (
                        <p><b>Medications:</b> {r.medications}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
