// ClinicDashboard.tsx
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ReferralCard }  from "@/components/ReferralCard";
import { Users, Send, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { readHospitals, HospitalBed, KEY as BEDS_KEY } from "@/lib/bedStore";

const COUNT_KEY = "medibridge_patients_count";
const LIST_KEY = "medibridge_patients_list";

type Patient = {
  id: string;
  name: string;
  age?: string;
  gender?: string;
  contact?: string;
  createdAt: string;
  notes?: string;
};

function readPatientsList(): Patient[] {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch {
    return [];
  }
}
function writePatientsList(list: Patient[]) {
  try {
    localStorage.setItem(LIST_KEY, JSON.stringify(list));
    localStorage.setItem(COUNT_KEY, String(list.length));
  } catch {}
}

export default function ClinicDashboard() {
  const [patients, setPatients] = useState<Patient[]>(() => readPatientsList());
  const [hospitals, setHospitals] = useState<HospitalBed[]>(() => readHospitals());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", gender: "", contact: "", notes: "" });

  useEffect(() => {
    // ensure keys exist
    if (localStorage.getItem(COUNT_KEY) == null) localStorage.setItem(COUNT_KEY, "0");
    if (localStorage.getItem(LIST_KEY) == null) localStorage.setItem(LIST_KEY, JSON.stringify([]));
    const handler = (e: StorageEvent) => {
      if (e.key === LIST_KEY || e.key === COUNT_KEY) {
        setPatients(readPatientsList());
      }
      if (e.key === BEDS_KEY) {
        setHospitals(readHospitals());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  function openRegister() {
    setForm({ name: "", age: "", gender: "", contact: "", notes: "" });
    setShowModal(true);
  }

  function registerPatient(e?: React.FormEvent) {
    e?.preventDefault();
    const id = `p_${Date.now()}`;
    const newPatient: Patient = {
      id,
      name: form.name || `Patient ${patients.length + 1}`,
      age: form.age || "",
      gender: form.gender || "",
      contact: form.contact || "",
      notes: form.notes || "",
      createdAt: new Date().toISOString(),
    };
    const next = [newPatient, ...patients];
    writePatientsList(next);
    setPatients(next);
    setShowModal(false);
    // broadcast
    try {
      window.dispatchEvent(new StorageEvent("storage", { key: LIST_KEY, newValue: JSON.stringify(next) }))
    } catch {}
  }

  function deletePatient(id: string) {
    const next = patients.filter(p => p.id !== id);
    writePatientsList(next);
    setPatients(next);
  }

  return (
    <DashboardLayout role="clinic">
      <style>{`
        .logo-pulse { animation: breathe 4.2s ease-in-out infinite; }
        @keyframes breathe { 0%{transform:scale(1)}50%{transform:scale(1.035)}100%{transform:scale(1)} }
        .card-hover:hover{ transform: translateY(-6px); box-shadow: 0 18px 30px rgba(2,6,23,0.08); }
        .icon-pulse { animation: subtlePulse 3.8s ease-in-out infinite; }
        @keyframes subtlePulse { 0%{opacity:1; transform:translateY(0)}50%{opacity:0.9; transform:translateY(-4px)}100%{opacity:1; transform:translateY(0)} }
        .mbg{ background: rgba(2,6,23,0.45); backdrop-filter: blur(4px); }
      `}</style>

      <div className="space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/favicon.ico" alt="MediBridge logo" className="h-12 w-12 rounded-full logo-pulse" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, Clinic Team</h1>
              <p className="text-sm text-muted-foreground mt-1">Here's a quick snapshot of your clinic activity</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">Clinic</span>
          </div>
        </header>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="transition-transform card-hover">
            <StatsCard title="Total Patients" value={String(patients.length)} icon={Users} trend={{ value: "—", isPositive: true }} />
          </div>
          <div className="transition-transform card-hover">
            <StatsCard title="Active Referrals" value="0" icon={Send} trend={{ value: "—", isPositive: true }} />
          </div>
          <div className="transition-transform card-hover">
            <StatsCard title="Pending" value="0" icon={Clock} trend={{ value: "—", isPositive: false }} />
          </div>
          <div className="transition-transform card-hover">
            <StatsCard title="Completed" value="0" icon={CheckCircle} trend={{ value: "—", isPositive: true }} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button className="shadow-sm" onClick={openRegister}>
            <Users className="mr-2 h-4 w-4 icon-pulse" />
            Register New Patient
          </Button>
          <Link to="/clinic/create-referral">
            <Button variant="secondary" className="shadow-sm">
              <Send className="mr-2 h-4 w-4 icon-pulse" />
              Create Referral
            </Button>
          </Link>
        </div>

        {/* Patients List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Patients</h2>
          {patients.length === 0 ? (
            <div className="p-6 bg-card rounded-lg text-muted-foreground">No patients yet. Click "Register New Patient" to add one.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {patients.map(p => (
                <div key={p.id} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{p.name}</h3>
                      <div className="text-sm text-muted-foreground">{p.age ? `Age: ${p.age}` : ""} {p.gender ? ` • ${p.gender}` : ""}</div>
                      <div className="text-xs text-muted-foreground mt-2">Registered: {new Date(p.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <button className="text-xs text-destructive" onClick={() => deletePatient(p.id)}>Delete</button>
                    </div>
                  </div>
                  {p.notes ? <div className="mt-3 text-sm text-muted-foreground"><strong>Notes:</strong> {p.notes}</div> : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nearby hospitals / bed availability */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Nearby Hospitals — Bed availability</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((h) => (
            <div key={h.id} className="p-4 bg-white/4 rounded-lg backdrop-blur border border-white/6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold" style={{ color: "#000" }}>{h.name}</div>
                  <div className="text-sm" style={{ color: "#000" }}>Updated: {new Date(h.lastUpdated || "").toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{h.availableBeds}</div>
                  <div className="text-xs" style={{ color: "#000" }}>of {h.totalBeds} beds</div>
                </div>
              </div>
              <div className="mt-3">
                <small className="text-xs" style={{ color: "#000" }}>Tip: Contact hospital to request available bed or create a referral.</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center mbg p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Register New Patient</h3>
            <p className="text-sm text-muted-foreground mb-4">Fill details to create a full patient record (demo stored on this browser).</p>
            <form onSubmit={registerPatient} className="space-y-3">
              <div>
                <label className="block text-sm">Full name</label>
                <input className="w-full mt-1 input" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} placeholder="e.g. Sita Devi"/>
              </div>
              <div>
                <label className="block text-sm">Age</label>
                <input className="w-full mt-1 input" value={form.age} onChange={(e)=>setForm({...form, age: e.target.value})} placeholder="e.g. 45"/>
              </div>
              <div>
                <label className="block text-sm">Gender</label>
                <input className="w-full mt-1 input" value={form.gender} onChange={(e)=>setForm({...form, gender: e.target.value})} placeholder="e.g. Female"/>
              </div>
              <div>
                <label className="block text-sm">Contact</label>
                <input className="w-full mt-1 input" value={form.contact} onChange={(e)=>setForm({...form, contact: e.target.value})} placeholder="Phone or ID"/>
              </div>
              <div>
                <label className="block text-sm">Notes</label>
                <textarea className="w-full mt-1 input" value={form.notes} onChange={(e)=>setForm({...form, notes: e.target.value})} placeholder="Short clinical notes"/>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button type="button" className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Register Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
