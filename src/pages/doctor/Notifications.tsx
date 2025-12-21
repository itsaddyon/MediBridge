import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, FileText, User, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Referral {
  id: string;
  patientName: string;
  hospital: string;
  diagnosis: string;
  status: string;
  urgency: string;
  createdAt?: any;
}

interface ActivityLog {
  id: string;
  type: string;
  message: string;
  actorRole: string;
  createdAt?: any;
  metadata?: any;
}

export default function DoctorNotifications() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Get recent referrals (as notifications)
    const referralsUnsub = onSnapshot(
      query(collection(db, "referrals"), orderBy("createdAt", "desc")),
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Referral));
        const pendingReferrals = data.filter(r => r.status === "pending");
        setReferrals(pendingReferrals.slice(0, 10)); // Show last 10 pending referrals
        setUnreadCount(pendingReferrals.length);
      }
    );

    // Get recent activities related to referrals
    const activitiesUnsub = onSnapshot(
      query(
        collection(db, "activityLogs"),
        orderBy("createdAt", "desc"),
        where("type", "in", ["REFERRAL_CREATED", "REFERRAL_STATUS_UPDATED"])
      ),
      (snap) => {
        setActivities(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ActivityLog)).slice(0, 20));
      }
    );

    return () => {
      referralsUnsub();
      activitiesUnsub();
    };
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "emergency":
        return "destructive";
      case "urgent":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "diagnosed":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return "Unknown";
    const now = new Date();
    const time = timestamp.toDate();
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return "Just now";
  };

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-2">Stay updated with patient referrals and system activities</p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="px-3 py-1">
              <Bell className="h-3 w-3 mr-1" />
              {unreadCount} New
            </Badge>
          )}
        </div>

        {/* Pending Referrals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pending Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending referrals at the moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div key={referral.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                    <div className="mt-1">
                      {getStatusIcon(referral.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            New referral for {referral.patientName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            From {referral.hospital} • {referral.diagnosis}
                          </p>
                        </div>
                        <Badge variant={getUrgencyColor(referral.urgency)}>
                          {referral.urgency}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatTimeAgo(referral.createdAt)}</span>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activities</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {activity.actorRole}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              System Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No system notifications at this time</p>
              <p className="text-sm mt-2">System announcements and updates will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}