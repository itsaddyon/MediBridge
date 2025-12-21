// AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, TrendingUp, MapPin, BarChart, BarChart3 } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { readHospitals, updateHospital, HospitalBed, KEY as BEDS_KEY } from "@/lib/bedStore";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";




export default function AdminDashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>(() => readHospitals());
  const [editingNeeds, setEditingNeeds] = useState<Record<string, string>>({});

  useEffect(() => {
  const q = query(
    collection(db, "patients"),
    orderBy("createdAt", "desc")
  );

  const unsub = onSnapshot(q, (snap) => {
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPatients(list);
  });

  return () => unsub();
}, []);

useEffect(() => {
  const q = query(
    collection(db, "referrals"),
    orderBy("createdAt", "desc")
  );

  const unsub = onSnapshot(q, (snap) => {
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setReferrals(list);
  });

  return () => unsub();
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

  const pendingReferrals = referrals.filter(
  (r) => r.status === "pending"
).length;

const activeReferrals = referrals.filter(
  (r) => r.status === "accepted" || r.status === "diagnosed"
).length;

const completedReferrals = referrals.filter(
  (r) => r.status === "completed" || r.status === "closed"
).length;


  return (
    <DashboardLayout role="admin">
      <style>{`
        .logo-pulse { animation: breathe 4s ease-in-out infinite; }
        @keyframes breathe { 0%{transform:scale(1)}50%{transform:scale(1.03)}100%{transform:scale(1)} }
        .soft-card { border-radius: 12px; box-shadow: 0 16px 30px rgba(2,6,23,0.06); transition: transform .18s ease, box-shadow .18s ease; }
        .soft-card:hover{ transform: translateY(-8px); box-shadow: 0 26px 40px rgba(2,6,23,0.09); }
      `}</style>

      <div className="space-y-8">
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/8 via-background to-secondary/8 border border-primary/20 p-8 shadow-xl backdrop-blur-sm"
                 style={{
                   backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.03) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(var(--secondary) / 0.03) 0%, transparent 50%)`
                 }}>
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-60">
            {/* Floating geometric shapes */}
            <div className="absolute top-4 right-12 w-20 h-20 rounded-full bg-primary/20 border border-primary/30 animate-float-slow shadow-lg"></div>
            <div className="absolute top-16 right-32 w-12 h-12 rounded-lg bg-secondary/25 border border-secondary/40 animate-float-medium rotate-45 shadow-md"></div>
            <div className="absolute bottom-8 left-16 w-16 h-16 rounded-full bg-accent/20 border border-accent/30 animate-float-fast shadow-lg"></div>
            <div className="absolute bottom-12 right-20 w-8 h-8 rounded-lg bg-primary/25 border border-primary/40 animate-float-slow rotate-12 shadow-md"></div>

            {/* Animated lines */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent animate-pulse-slow animation-delay-1000"></div>
            <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-pulse-slow animation-delay-500"></div>
            <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-secondary/30 to-transparent animate-pulse-slow animation-delay-1500"></div>
          </div>

          <div className="relative z-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 border-2 border-primary/30 shadow-lg backdrop-blur-sm">
                <BarChart3 className="h-8 w-8 text-primary animate-pulse-gentle drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground tracking-tight animate-fade-in-up">
                  Admin Dashboard
                </h1>
                <p className="text-lg text-muted-foreground animate-fade-in-up animation-delay-200">
                  System-wide analytics and management overview
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-1 w-12 bg-primary rounded-full animate-expand-width shadow-sm shadow-primary/50"></div>
                  <div className="h-1 w-8 bg-secondary rounded-full animate-expand-width animation-delay-300 shadow-sm shadow-secondary/50"></div>
                  <div className="h-1 w-6 bg-accent rounded-full animate-expand-width animation-delay-500 shadow-sm shadow-accent/50"></div>
                </div>
              </div>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Live System</span>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="dashboard-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="dashboard-card">
            <StatsCard title="Total Patients" value={String(patients.length)} icon={Users} trend={{ value: "Live", isPositive: true }} />
          </div>
          <div className="dashboard-card">
            <StatsCard title="Active Referrals" value={String(activeReferrals)} icon={MapPin} trend={{ value: "Live", isPositive: true }}/>
          </div>
          <div className="dashboard-card">
            <StatsCard
  title="Pending"
  value={String(pendingReferrals)}
  icon={Activity}
  trend={{ value: "Live", isPositive: false }}
/>
          </div>
          <div className="dashboard-card">
            <StatsCard
  title="Completed"
  value={String(completedReferrals)}
  icon={TrendingUp}
  trend={{ value: "Live", isPositive: true }}
/>
          </div>
        </div>

        {/* Charts */}
        <div className="dashboard-grid grid-cols-1 md:grid-cols-2">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="text-medical-heading flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Referral Trends
              </CardTitle>
              <CardDescription className="text-medical-subheading">Monthly referral activity over time</CardDescription>
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

          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="text-medical-heading flex items-center gap-2">
                <Activity className="h-5 w-5 text-secondary" />
                Disease Distribution
              </CardTitle>
              <CardDescription className="text-medical-subheading">Common conditions requiring referrals</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={diseaseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="disease" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="cases" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Hospital Bed Status */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="text-medical-heading flex items-center justify-between">
              <span className="flex items-center gap-2"><BarChart className="h-5 w-5 text-primary" /> Hospital Bed Status</span>
              <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">Full: {hospitals.filter(h => h.availableBeds <= 0).length}</span>
            </CardTitle>
            <CardDescription className="text-medical-subheading">Real-time bed availability across hospitals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {hospitals.map((h) => (
                <div key={h.id} className="p-4 bg-muted/30 rounded-lg border border-border/50 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground">{h.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {h.availableBeds <= 0 ? (
                        <span className="text-destructive font-medium">Full</span>
                      ) : (
                        <span>{h.availableBeds} available of {h.totalBeds}</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">Last updated: {new Date(h.lastUpdated || "").toLocaleString()}</div>
                  </div>

                  <div className="mt-3 md:mt-0 md:w-1/2">
                    <label className="block text-sm font-medium mb-2">Extra needs / notes</label>
                    <textarea
                      className="w-full rounded-md border px-3 py-2 text-sm
  bg-white text-slate-900 border-slate-300
  dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
  focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      value={editingNeeds[h.id] ?? (h.needs ?? "")}
                      onChange={(e) => setEditingNeeds(prev => ({ ...prev, [h.id]: e.target.value }))}
                      placeholder="e.g. need oxygen concentrators, isolation beds, staff"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        className="btn-medical-secondary text-sm px-3 py-1"
                        onClick={() => {
                          setEditingNeeds(prev => ({ ...prev, [h.id]: h.needs ?? "" }));
                        }}
                      >
                        Revert
                      </button>
                      <button
                        className="btn-medical-primary text-sm px-3 py-1"
                        onClick={() => {
                          const text = editingNeeds[h.id] ?? (h.needs ?? "");
                          updateHospital(h.id, { needs: text });
                          setHospitals(readHospitals());
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
