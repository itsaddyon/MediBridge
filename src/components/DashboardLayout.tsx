import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logActivity } from "@/lib/activityLogService";
import ThemeToggle from "@/components/ThemeToggle";
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
  const [mobileOpen, setMobileOpen] = useState(false);


  const handleLogout = async () => {
    /* 🔔 Activity Log */
    await logActivity({
      type: "LOGOUT",
      message: `${role} logged out`,
      actorRole: role as "clinic" | "doctor" | "admin",
      metadata: {
        role: role,
      },
    });
    
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
  {/* Mobile menu button */}
  <button
    className="md:hidden p-2 rounded-lg hover:bg-muted"
    onClick={() => setMobileOpen(true)}
  >
    ☰
  </button>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">MediBridge</span>
              <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">Connect</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">{config.title}</span>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
  className={cn(
    "fixed inset-y-0 left-0 z-50 w-64 flex-col nav-professional bg-background",
    "transform transition-transform duration-300",
    mobileOpen ? "translate-x-0" : "-translate-x-full",
    "md:static md:translate-x-0 md:flex"
  )}
>
  <button
  className="md:hidden mb-4 px-3 py-2 rounded-lg text-sm hover:bg-muted"
  onClick={() => setMobileOpen(false)}
>
  ✕ Close
</button>


          <nav className="flex-1 space-y-1 p-4">
            {config.navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
  key={item.href}
  to={item.href}
  onClick={() => setMobileOpen(false)}
  className={cn(
    "nav-item-professional",
    isActive && "nav-item-active"
  )}
>

                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 md:p-10 bg-background">
          <div className="mx-auto max-w-7xl space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
