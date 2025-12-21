import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Activity, Users, FileText, TrendingUp } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  createdAt?: any;
}

interface Referral {
  id: string;
  hospital: string;
  diagnosis: string;
  status: string;
  createdAt?: any;
}

interface ActivityLog {
  id: string;
  type: string;
  createdAt?: any;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AdminAnalytics() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // Patients
    const patientsUnsub = onSnapshot(
      query(collection(db, "patients"), orderBy("createdAt", "desc")),
      (snap) => {
        setPatients(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Patient)));
      }
    );

    // Referrals
    const referralsUnsub = onSnapshot(
      query(collection(db, "referrals"), orderBy("createdAt", "desc")),
      (snap) => {
        setReferrals(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Referral)));
      }
    );

    // Activity Logs
    const logsUnsub = onSnapshot(
      query(collection(db, "activityLogs"), orderBy("createdAt", "desc")),
      (snap) => {
        setLogs(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ActivityLog)));
      }
    );

    return () => {
      patientsUnsub();
      referralsUnsub();
      logsUnsub();
    };
  }, []);

  // Process data for charts
  const getPatientRegistrationsOverTime = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    return last30Days.map((date) => {
      const count = patients.filter((p) => {
        if (!p.createdAt) return false;
        const patientDate = p.createdAt.toDate().toISOString().split("T")[0];
        return patientDate === date;
      }).length;
      return { date: date.split("-")[2], count };
    });
  };

  const getReferralsByHospital = () => {
    const hospitalCounts: { [key: string]: number } = {};
    referrals.forEach((r) => {
      hospitalCounts[r.hospital] = (hospitalCounts[r.hospital] || 0) + 1;
    });
    return Object.entries(hospitalCounts).map(([hospital, count]) => ({
      hospital,
      count,
    }));
  };

  const getReferralStatusDistribution = () => {
    const statusCounts: { [key: string]: number } = {};
    referrals.forEach((r) => {
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  };

  const getTopDiseases = () => {
    const diseaseCounts: { [key: string]: number } = {};
    referrals.forEach((r) => {
      if (r.diagnosis) {
        diseaseCounts[r.diagnosis] = (diseaseCounts[r.diagnosis] || 0) + 1;
      }
    });
    return Object.entries(diseaseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([disease, count]) => ({ disease, count }));
  };

  const getActivityTrends = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    return last7Days.map((date) => {
      const count = logs.filter((l) => {
        if (!l.createdAt) return false;
        const logDate = l.createdAt.toDate().toISOString().split("T")[0];
        return logDate === date;
      }).length;
      return { date: date.split("-")[2], count };
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">Real-time insights into system performance and trends</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground">Registered in system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referrals.length}</div>
              <p className="text-xs text-muted-foreground">Created by clinics</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Activities</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.length}</div>
              <p className="text-xs text-muted-foreground">Logged in system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Referrals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {referrals.filter((r) => r.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Registrations Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Registrations (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getPatientRegistrationsOverTime()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Referrals by Hospital */}
          <Card>
            <CardHeader>
              <CardTitle>Referrals to Hospital</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getReferralsByHospital()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hospital" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Referral Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Referral Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getReferralStatusDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getReferralStatusDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Diseases */}
          <Card>
            <CardHeader>
              <CardTitle>Top Diseases (From Referrals)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTopDiseases()} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="disease" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Activity Trends */}
        <Card>
          <CardHeader>
            <CardTitle>System Activity Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getActivityTrends()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#ff7300" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}