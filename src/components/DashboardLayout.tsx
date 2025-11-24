import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bell, 
  Settings, 
  LogOut,
  Activity,
  UserPlus,
  Send,
  BarChart3,
  ClipboardList,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "clinic" | "doctor" | "admin";
}

const roleConfig = {
  clinic: {
    title: "Clinic Portal",
    navigation: [
      { name: "Dashboard", href: "/clinic/dashboard", icon: LayoutDashboard },
      { name: "Register Patient", href: "/clinic/register-patient", icon: UserPlus },
      { name: "Create Referral", href: "/clinic/create-referral", icon: Send },
      { name: "Referral Status", href: "/clinic/referral-status", icon: Activity },
      { name: "Notifications", href: "/clinic/notifications", icon: Bell },
      { name: "Profile", href: "/clinic/profile", icon: Settings },
    ],
  },
  doctor: {
    title: "Hospital Portal",
    navigation: [
      { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
      { name: "Incoming Referrals", href: "/doctor/referrals", icon: FileText },
      { name: "Patient History", href: "/doctor/patient-history", icon: History },
      { name: "Notifications", href: "/doctor/notifications", icon: Bell },
      { name: "Profile", href: "/doctor/profile", icon: Settings },
    ],
  },
  admin: {
    title: "Admin Portal",
    navigation: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "User Management", href: "/admin/users", icon: Users },
      { name: "Activity Logs", href: "/admin/logs", icon: ClipboardList },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
};

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const config = roleConfig[role];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">MediBridge</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">{config.title}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-background">
          <nav className="flex-1 space-y-1 p-4">
            {config.navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
