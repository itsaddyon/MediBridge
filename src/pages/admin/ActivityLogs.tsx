import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Activity, UserPlus, FileText, AlertCircle, Bed, Phone } from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ActivityLogType } from "@/lib/activityLogService";


export default function ActivityLogs() {
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
  const q = query(
    collection(db, "activityLogs"),
    orderBy("createdAt", "desc")
  );

  const unsub = onSnapshot(q, (snap) => {
    setLogs(
      snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  });

  return () => unsub();
}, []);



  const getIcon = (type: ActivityLogType) => {
    switch (type) {
      case "PATIENT_REGISTERED":
        return <UserPlus className="h-5 w-5 text-primary" />;
      case "REFERRAL_CREATED":
        return <FileText className="h-5 w-5 text-secondary" />;
      case "REFERRAL_STATUS_UPDATED":
        return <Activity className="h-5 w-5 text-success" />;
      case "BED_UPDATED":
        return <Bed className="h-5 w-5 text-info" />;
      case "EMERGENCY_TRIGGERED":
        return <Phone className="h-5 w-5 text-destructive" />;
      case "LOGIN":
        return <Activity className="h-5 w-5 text-muted-foreground" />;
      case "LOGOUT":
        return <Activity className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSeverityBadge = (type: ActivityLogType) => {
    switch (type) {
      case "EMERGENCY_TRIGGERED":
        return <Badge variant="destructive">Critical</Badge>;
      case "PATIENT_REGISTERED":
        return <Badge variant="default">Info</Badge>;
      case "REFERRAL_CREATED":
        return <Badge variant="secondary">Info</Badge>;
      case "REFERRAL_STATUS_UPDATED":
        return <Badge variant="default">Info</Badge>;
      case "BED_UPDATED":
        return <Badge variant="default">Info</Badge>;
      case "LOGIN":
        return <Badge variant="outline">Info</Badge>;
      case "LOGOUT":
        return <Badge variant="outline">Info</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity Logs</h1>
          <p className="text-muted-foreground mt-2">Monitor system activities and user actions</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-10"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="referral">Referrals</SelectItem>
              <SelectItem value="user">User Actions</SelectItem>
              <SelectItem value="diagnosis">Diagnosis</SelectItem>
              <SelectItem value="error">Errors</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="today">
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity Logs */}
        <div className="space-y-3">
          {logs.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Activity Logs</h3>
                <p className="text-muted-foreground">Activity logs will appear here as users interact with the system.</p>
              </CardContent>
            </Card>
          ) : (
            logs.map((log) => (
              <Card key={log.id} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getIcon(log.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{log.message}</h3>
                          <p className="text-sm text-muted-foreground mt-1">by {log.actorRole}</p>
                        </div>
                        {getSeverityBadge(log.type)}
                      </div>
                      <p className="text-sm text-muted-foreground">{log.metadata ? JSON.stringify(log.metadata) : "No additional details"}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {log.createdAt?.toDate().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
