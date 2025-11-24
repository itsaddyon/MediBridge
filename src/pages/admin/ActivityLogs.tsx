import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Activity, UserPlus, FileText, AlertCircle } from "lucide-react";

export default function ActivityLogs() {
  const logs = [
    {
      id: "1",
      type: "referral",
      action: "Referral Created",
      user: "Dr. Ravi Kumar",
      details: "Created referral for patient Rajesh Kumar to District Hospital",
      timestamp: "2025-11-18 14:30",
      severity: "info",
    },
    {
      id: "2",
      type: "user",
      action: "User Login",
      user: "Dr. Sharma",
      details: "Successful login from IP 192.168.1.100",
      timestamp: "2025-11-18 14:15",
      severity: "info",
    },
    {
      id: "3",
      type: "diagnosis",
      action: "Diagnosis Updated",
      user: "Dr. Sharma",
      details: "Updated diagnosis for patient Sneha Patel",
      timestamp: "2025-11-18 13:45",
      severity: "info",
    },
    {
      id: "4",
      type: "patient",
      action: "Patient Registered",
      user: "Nurse Priya",
      details: "New patient Amit Singh registered at Village B clinic",
      timestamp: "2025-11-18 12:20",
      severity: "success",
    },
    {
      id: "5",
      type: "error",
      action: "Failed Login Attempt",
      user: "Unknown",
      details: "Failed login attempt from IP 203.0.113.42",
      timestamp: "2025-11-18 11:50",
      severity: "warning",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "referral":
        return <FileText className="h-5 w-5 text-primary" />;
      case "user":
        return <UserPlus className="h-5 w-5 text-secondary" />;
      case "diagnosis":
        return <Activity className="h-5 w-5 text-success" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "success":
        return <Badge variant="success">Success</Badge>;
      case "warning":
        return <Badge variant="warning">Warning</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
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
          {logs.map((log) => (
            <Card key={log.id} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getIcon(log.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{log.action}</h3>
                        <p className="text-sm text-muted-foreground mt-1">by {log.user}</p>
                      </div>
                      {getSeverityBadge(log.severity)}
                    </div>
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                    <p className="text-xs text-muted-foreground mt-2">{log.timestamp}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
