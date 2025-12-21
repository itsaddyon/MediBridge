import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ReferralCard } from "@/components/ReferralCard";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Referral } from "@/types";
import { serverTimestamp } from "firebase/firestore";
import {
  listenHospitals,
  addHospital,
  updateHospital,
  HospitalBed,
} from "@/lib/hospitalService";


export default function DoctorDashboard() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
const [hospitals, setHospitals] = useState<HospitalBed[]>([]);
  const [newHospital, setNewHospital] = useState({
    name: "",
    totalBeds: "",
    availableBeds: "",
  });

  useEffect(() => {
  const unsub = listenHospitals(setHospitals);
  return () => unsub();
}, []);


  /* ---------------- FIRESTORE: REFERRALS ---------------- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "referrals"), (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Referral, "id">),
      }));
      setReferrals(list);
    });

    return () => unsub();
  }, []);

  /* ---------------- DASHBOARD COUNTS ---------------- */
  const pendingCount = referrals.filter(r => r.status === "pending").length;

  const inProgressCount = referrals.filter(
    r => r.status === "accepted" || r.status === "diagnosed"
  ).length;

  const completedCount = referrals.filter(r => r.status === "closed").length;

  const incomingReferrals = referrals.slice(0, 3);

  /* ---------------- UI ---------------- */
  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Hospital Dashboard</h1>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
            Doctor
          </span>
        </header>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard title="Total Referrals" value={String(referrals.length)} icon={FileText} />
          <StatsCard title="Pending" value={String(pendingCount)} icon={Clock} />
          <StatsCard title="In Progress" value={String(inProgressCount)} icon={AlertCircle} />
          <StatsCard title="Completed" value={String(completedCount)} icon={CheckCircle} />
        </div>

        {/* Incoming Referrals */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Incoming Referrals</h2>
            <Link to="/doctor/referrals">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {incomingReferrals.length === 0 ? (
              <div className="p-4 bg-muted rounded-md">No referrals yet</div>
            ) : (
              incomingReferrals.map(r => (
                <ReferralCard key={r.id} referral={r} />
              ))
            )}
          </div>
        </div>

        {/* Bed Availability (Manual – Option 1) */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Hospital Bed Availability</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {hospitals.map(h => (
              <div key={h.id} className="p-4 rounded-lg border bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{h.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
  Updated:{" "}
  {h.lastUpdated?.toDate
    ? h.lastUpdated.toDate().toLocaleString()
    : "—"}
</p>

                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{h.availableBeds}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">of {h.totalBeds} beds </p>

                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <input
                    className="
  w-full rounded-md border px-3 py-2 text-sm
  bg-white text-slate-900 border-slate-300
  dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
  focus:outline-none focus:ring-2 focus:ring-blue-500
"

                    // TOTAL beds input
value={h.totalBeds}
onChange={async (e) => {
  await updateHospital(h.id!, {
    totalBeds: Number(e.target.value),
    lastUpdated: serverTimestamp(),
  });
}}


                  />
                  <input
                    className="
  w-full rounded-md border px-3 py-2 text-sm
  bg-white text-slate-900 border-slate-300
  dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
  focus:outline-none focus:ring-2 focus:ring-blue-500
"

                    // AVAILABLE beds input
value={h.availableBeds}
onChange={async (e) => {
  await updateHospital(h.id!, {
    availableBeds: Number(e.target.value),
    lastUpdated: serverTimestamp(),
  });
}}


                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Hospital */}
          <div className="p-4 rounded-lg border bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Add Hospital</h3>
            <div className="grid grid-cols-3 gap-2">
              <input
                className="
  w-full rounded-md border px-3 py-2 text-sm
  bg-white text-slate-900 border-slate-300
  dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
  focus:outline-none focus:ring-2 focus:ring-blue-500
"

                placeholder="Hospital name"
                value={newHospital.name}
                onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
              />
              <input
                className="
  w-full rounded-md border px-3 py-2 text-sm
  bg-white text-slate-900 border-slate-300
  dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
  focus:outline-none focus:ring-2 focus:ring-blue-500
"

                placeholder="Total beds"
                value={newHospital.totalBeds}
                onChange={(e) => setNewHospital({ ...newHospital, totalBeds: e.target.value })}
              />
              <input
                className="
  w-full rounded-md border px-3 py-2 text-sm
  bg-white text-slate-900 border-slate-300
  dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
  focus:outline-none focus:ring-2 focus:ring-blue-500
"

                placeholder="Available beds"
                value={newHospital.availableBeds}
                onChange={(e) => setNewHospital({ ...newHospital, availableBeds: e.target.value })}
              />
            </div>

            <div className="mt-2 flex justify-end">
              <Button
                onClick={() => {
                  if (!newHospital.name) return;
                  addHospital({
                    name: newHospital.name,
                    totalBeds: Number(newHospital.totalBeds) || 0,
                    availableBeds: Number(newHospital.availableBeds) || 0,
                    
                  });
                  setNewHospital({ name: "", totalBeds: "", availableBeds: "" });
                }}
              >
                Add Hospital
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
