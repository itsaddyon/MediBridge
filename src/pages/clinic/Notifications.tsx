import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Bell } from "lucide-react";

export default function Notifications() {
  const notifications = [
    {
      id: "1",
      type: "success",
      title: "Referral Accepted",
      message: "Dr. Sharma has accepted the referral for Priya Sharma at City Medical Center",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "Diagnosis Updated",
      message: "New diagnosis notes available for patient Sneha Patel",
      time: "5 hours ago",
      read: false,
    },
    {
      id: "3",
      type: "pending",
      title: "Referral Pending",
      message: "Referral for Rajesh Kumar is awaiting hospital response",
      time: "1 day ago",
      read: true,
    },
    {
      id: "4",
      type: "success",
      title: "Case Closed",
      message: "Treatment completed for Vikram Reddy. Case has been closed successfully",
      time: "2 days ago",
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "pending":
        return <Clock className="h-5 w-5 text-warning" />;
      case "info":
        return <AlertCircle className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout role="clinic">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-2">Stay updated with referral status and system alerts</p>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`border-border transition-colors ${
                !notification.read ? "bg-primary/5" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground">{notification.title}</h3>
                      {!notification.read && (
                        <Badge variant="default" className="ml-2">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
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
