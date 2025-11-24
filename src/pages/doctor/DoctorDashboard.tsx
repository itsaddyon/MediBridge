// DoctorDashboard.tsx
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ReferralCard } from "@/components/ReferralCard";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { readHospitals, updateHospital, addHospital, HospitalBed, KEY as BEDS_KEY } from "@/lib/bedStore";

const LIST_KEY = "medibridge_patients_list";

function readPatientsList() {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<any[]>(() => readPatientsList());
  const [hospitals, setHospitals] = useState<HospitalBed[]>(() => readHospitals());
  const [newHospital, setNewHospital] = useState({ name: "", totalBeds: "", availableBeds: "" });

  useEffect(() => {
    if (localStorage.getItem(LIST_KEY) == null) localStorage.setItem(LIST_KEY, JSON.stringify([]));
    const handler = (e: StorageEvent) => {
      if (e.key === LIST_KEY) setPatients(readPatientsList());
      if (e.key === BEDS_KEY) setHospitals(readHospitals());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const incomingReferrals = []; // zero referrals

  return (
    <DashboardLayout role="doctor">
      <style>{`
        .logo-pulse { animation: breathe 4.1s ease-in-out infinite; }
        @keyframes breathe { 0%{transform:scale(1)}50%{transform:scale(1.03)}100%{transform:scale(1)} }
        .card-hover:hover{ transform: translateY(-6px); box-shadow: 0 18px 30px rgba(2,6,23,0.08); }
      `}</style>

      <div className="space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/favicon.ico" alt="MediBridge logo" className="h-12 w-12 rounded-md logo-pulse" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Hospital Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage incoming referrals and patient care</p>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-sm font-medium">Doctor</span>
          </div>
        </header>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="card-hover">
            <StatsCard title="Total Patients" value={String(patients.length)} icon={FileText} trend={{ value: "—", isPositive: true }} />
          </div>
          <div className="card-hover">
            <StatsCard title="Pending Review" value="0" icon={Clock} trend={{ value: "—", isPositive: false }} />
          </div>
          <div className="card-hover">
            <StatsCard title="In Progress" value="0" icon={AlertCircle} trend={{ value: "—", isPositive: true }} />
          </div>
          <div className="card-hover">
            <StatsCard title="Completed" value="0" icon={CheckCircle} trend={{ value: "—", isPositive: true }} />
          </div>
        </div>

        {/* Incoming Referrals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-foreground">Incoming Referrals</h2>
            <Link to="/doctor/referrals">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {incomingReferrals.length === 0 ? (
              <div className="p-6 bg-card rounded-lg text-muted-foreground">No incoming referrals</div>
            ) : incomingReferrals.map(r => (
              <div key={r.id} className="transition-transform card-hover"><ReferralCard {...r} /></div>
            ))}
          </div>
        </div>

        {/* Bed availability manager (for hospitals) */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-foreground">Manage Bed Availability</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {hospitals.map((h) => (
              <div key={h.id} className="p-4 bg-white/4 rounded-lg backdrop-blur border border-white/6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold" style={{ color: "#000" }}>{h.name}</div>
                    <div className="text-sm" style={{ color: "#000" }}>Last: {new Date(h.lastUpdated || "").toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{h.availableBeds}</div>
                    <div className="text-xs" style={{ color: "#000" }}>of {h.totalBeds} beds</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input
                    className="input"
                    value={String(h.totalBeds)}
                    onChange={(e) => {
                      const v = parseInt(e.target.value || "0", 10) || 0;
                      const updated = updateHospital(h.id, { totalBeds: v });
                      if (updated) setHospitals(readHospitals());
                    }}
                  />
                  <input
                    className="input"
                    value={String(h.availableBeds)}
                    onChange={(e) => {
                      const v = parseInt(e.target.value || "0", 10) || 0;
                      const updated = updateHospital(h.id, { availableBeds: v });
                      if (updated) setHospitals(readHospitals());
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-white/3 rounded-lg border border-white/6">
            <h3 className="font-semibold mb-2">Add new hospital</h3>
            <div className="grid grid-cols-3 gap-2">
              <input className="input col-span-2" placeholder="Hospital name" value={newHospital.name} onChange={(e)=>setNewHospital({...newHospital, name: e.target.value})} />
              <input className="input" placeholder="Total beds" value={newHospital.totalBeds} onChange={(e)=>setNewHospital({...newHospital, totalBeds: e.target.value})} />
              <input className="input" placeholder="Available beds" value={newHospital.availableBeds} onChange={(e)=>setNewHospital({...newHospital, availableBeds: e.target.value})} />
              <div />
              <div className="flex justify-end">
                <Button onClick={() => {
                  const tot = parseInt(newHospital.totalBeds || "0", 10) || 0;
                  const av = parseInt(newHospital.availableBeds || "0", 10) || 0;
                  if (!newHospital.name) return;
                  addHospital({ name: newHospital.name, totalBeds: tot, availableBeds: av });
                  setHospitals(readHospitals());
                  setNewHospital({ name: "", totalBeds: "", availableBeds: "" });
                }}>Add</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
