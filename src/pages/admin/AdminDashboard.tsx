// AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, TrendingUp, MapPin, BarChart } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { readHospitals, updateHospital, HospitalBed, KEY as BEDS_KEY } from "@/lib/bedStore";

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

export default function AdminDashboard() {
  const [patients, setPatients] = useState<any[]>(() => readPatientsList());
  const [hospitals, setHospitals] = useState<HospitalBed[]>(() => readHospitals());
  const [editingNeeds, setEditingNeeds] = useState<Record<string, string>>({});

  useEffect(() => {
    if (localStorage.getItem(LIST_KEY) == null) localStorage.setItem(LIST_KEY, JSON.stringify([]));
    const handler = (e: StorageEvent) => {
      if (e.key === LIST_KEY) setPatients(readPatientsList());
      if (e.key === BEDS_KEY) setHospitals(readHospitals());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const referralTrendData = [
    { month: "Jun", referrals: 45 },
    { month: "Jul", referrals: 52 },
    { month: "Aug", referrals: 48 },
    { month: "Sep", referrals: 61 },
    { month: "Oct", referrals: 58 },
    { month: "Nov", referrals: 73 },
  ];

  const diseaseData = [
    { disease: "Cardiac", cases: 145 },
    { disease: "Diabetes", cases: 132 },
    { disease: "Respiratory", cases: 98 },
    { disease: "Orthopedic", cases: 87 },
    { disease: "Neurological", cases: 65 },
  ];

  return (
    <DashboardLayout role="admin">
      <style>{`
        .logo-pulse { animation: breathe 4s ease-in-out infinite; }
        @keyframes breathe { 0%{transform:scale(1)}50%{transform:scale(1.03)}100%{transform:scale(1)} }
        .soft-card { border-radius: 12px; box-shadow: 0 16px 30px rgba(2,6,23,0.06); transition: transform .18s ease, box-shadow .18s ease; }
        .soft-card:hover{ transform: translateY(-8px); box-shadow: 0 26px 40px rgba(2,6,23,0.09); }
      `}</style>

      <div className="space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/favicon.ico" alt="MediBridge logo" className="h-12 w-12 rounded-md logo-pulse" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">System-wide analytics and management</p>
            </div>
          </div>
      
          {/* Bed overview for admin: show which hospitals are full and record extra needs */}
          <div className="mt-6">
            <Card className="border-border soft-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><BarChart className="h-5 w-5 text-primary" /> Hospital Bed Status</span>
                  <span className="text-sm text-muted-foreground">Full hospitals: {hospitals.filter(h => h.availableBeds <= 0).length}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {hospitals.map((h) => (
                    <div key={h.id} className="p-3 bg-white/4 rounded-md border border-white/6 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div style={{ color: "#000" }} className="font-bold">{h.name}</div>
                        <div className="text-sm" style={{ color: "#000" }}>
                          {h.availableBeds <= 0 ? (
                            <span className="text-red-600 font-semibold">Full</span>
                          ) : (
                            <span>{h.availableBeds} available of {h.totalBeds}</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Last: {new Date(h.lastUpdated || "").toLocaleString()}</div>
                      </div>

                      <div className="mt-3 md:mt-0 md:w-1/2">
                        <label className="block text-sm mb-1">Extra needs / notes</label>
                        <textarea
                          className="w-full input"
                          rows={2}
                          value={editingNeeds[h.id] ?? (h.needs ?? "")}
                          onChange={(e) => setEditingNeeds(prev => ({ ...prev, [h.id]: e.target.value }))}
                          placeholder="e.g. need oxygen concentrators, isolation beds, staff"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            className="btn btn-ghost"
                            onClick={() => {
                              // revert
                              setEditingNeeds(prev => ({ ...prev, [h.id]: h.needs ?? "" }));
                            }}
                          >Revert</button>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              const text = editingNeeds[h.id] ?? (h.needs ?? "");
                              updateHospital(h.id, { needs: text });
                              setHospitals(readHospitals());
                            }}
                          >Save</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-sm font-medium">Administrator</span>
          </div>
        </header>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="soft-card">
            <StatsCard title="Total Patients" value={String(patients.length)} icon={Users} trend={{ value: "—", isPositive: true }} />
          </div>
          <div className="soft-card">
            <StatsCard title="Active Referrals" value="0" icon={MapPin} trend={{ value: "—", isPositive: true }} />
          </div>
          <div className="soft-card">
            <StatsCard title="Pending" value="0" icon={Activity} trend={{ value: "—", isPositive: false }} />
          </div>
          <div className="soft-card">
            <StatsCard title="Completed" value="0" icon={TrendingUp} trend={{ value: "—", isPositive: true }} />
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border soft-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Referral Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={referralTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="referrals" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border soft-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-secondary" />
                Disease Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={diseaseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="disease" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="cases" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
