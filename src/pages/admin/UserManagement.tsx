import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Edit, Trash2 } from "lucide-react";

export default function UserManagement() {
  const users = [
    {
      id: "1",
      name: "Dr. Ravi Kumar",
      email: "ravi@clinic-a.com",
      role: "Clinic Admin",
      location: "Village A",
      status: "active",
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      name: "Dr. Sharma",
      email: "sharma@hospital.com",
      role: "Doctor",
      location: "District Hospital",
      status: "active",
      lastActive: "30 minutes ago",
    },
    {
      id: "3",
      name: "Nurse Priya",
      email: "priya@clinic-b.com",
      role: "Health Worker",
      location: "Village B",
      status: "active",
      lastActive: "1 hour ago",
    },
    {
      id: "4",
      name: "Admin Kumar",
      email: "admin@medibridge.gov",
      role: "System Admin",
      location: "Central Office",
      status: "active",
      lastActive: "5 minutes ago",
    },
    {
      id: "5",
      name: "Dr. Amit Patel",
      email: "amit@clinic-c.com",
      role: "Clinic Admin",
      location: "Village C",
      status: "inactive",
      lastActive: "2 days ago",
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-2">Manage system users and their permissions</p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
          />
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{user.name}</h3>
                        <Badge variant={user.status === "active" ? "success" : "secondary"}>
                          {user.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          <strong>Role:</strong> {user.role}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          <strong>Location:</strong> {user.location}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Last active: {user.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
