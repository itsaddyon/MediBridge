import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { Users, Send, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { listenHospitals, HospitalBed } from "@/lib/hospitalService";
import { getAllPatients, Patient } from "@/lib/patientService";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";



export default function ClinicDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [hospitals, setHospitals] = useState<HospitalBed[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPatients, setTotalPatients] = useState(0);
  const [activeReferrals, setActiveReferrals] = useState(0);
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const patientData = await getAllPatients();
        setPatients(patientData);
      } catch (err) {
        console.error("Failed to load clinic data", err);
      } finally {
        setLoading(false);
      }
    };



    loadData();
  }, []);

  useEffect(() => {
  const unsub = listenHospitals(setHospitals);
  return () => unsub();
}, []);

  useEffect(() => {
  const unsubPatients = onSnapshot(
    collection(db, "patients"),
    (snap) => {
      setTotalPatients(snap.size);
    }
  );

  const unsubReferrals = onSnapshot(
    collection(db, "referrals"),
    (snap) => {
      const referrals = snap.docs.map(d => d.data());

      setActiveReferrals(
        referrals.filter(r => r.status === "accepted").length
      );
      setPending(
        referrals.filter(r => r.status === "pending").length
      );
      setCompleted(
        referrals.filter(r => r.status === "closed").length
      );
    }
  );

  return () => {
    unsubPatients();
    unsubReferrals();
  };
}, []);


  return (
    <DashboardLayout role="clinic">
      <div className="space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.ico"
              alt="MediBridge logo"
              className="h-12 w-12 rounded-full"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, Clinic Team
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Here's a quick snapshot of your clinic activity
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
            Clinic
          </span>
        </header>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Patients"
            value={loading ? "—" : String(totalPatients)}
            icon={Users}
            trend={{ value: "Live", isPositive: true }}
          />
          <StatsCard
            title="Active Referrals"
            value={String(activeReferrals)}
            icon={Send}
            trend={{ value: "—", isPositive: true }}
          />
          <StatsCard
            title="Pending"
            value={String(pending)}
            icon={Clock}
            trend={{ value: "—", isPositive: false }}
          />
          <StatsCard
            title="Completed"
            value={String(completed)}
            icon={CheckCircle}
            trend={{ value: "—", isPositive: true }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link to="/clinic/register-patient">
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Register New Patient
            </Button>
          </Link>

          <Link to="/clinic/create-referral">
            <Button variant="secondary">
              <Send className="mr-2 h-4 w-4" />
              Create Referral
            </Button>
          </Link>
        </div>

        {/* Patients */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Patients</h2>

          {loading ? (
            <div className="p-6 bg-card rounded-lg text-muted-foreground">
              Loading patients from database…
            </div>
          ) : patients.length === 0 ? (
            <div className="p-6 bg-card rounded-lg text-muted-foreground">
              No patients yet. Register one to get started.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {patients.map((p) => (
                <div
                  key={p.id}
                  className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                >
                  <h3 className="font-semibold">{p.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {p.age ? `Age: ${p.age}` : ""}
                    {p.gender ? ` • ${p.gender}` : ""}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
  Registered:{" "}
  {p.createdAt
    ? typeof p.createdAt === "string"
      ? new Date(p.createdAt).toLocaleString()
      : p.createdAt.toDate().toLocaleString()
    : "—"}
</div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hospitals */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Nearby Hospitals — Bed availability
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hospitals.map((h) => (
              <div
                key={h.id}
                className="p-4 rounded-lg border bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-bold">{h.name}</div>
                    <div className="text-sm">
  Updated:{" "}
  {h.lastUpdated?.toDate
    ? h.lastUpdated.toDate().toLocaleString()
    : "—"}
</div>

                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {h.availableBeds}
                    </div>
                    <div className="text-xs">
                      of {h.totalBeds} beds
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
