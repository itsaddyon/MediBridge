import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ClinicLogin from "./pages/ClinicLogin";
import DoctorLogin from "./pages/DoctorLogin";
import AdminLogin from "./pages/AdminLogin";
import { lazy, Suspense } from "react";
const ClinicDashboard = lazy(() => import("./pages/clinic/ClinicDashboard"));
const RegisterPatient = lazy(() => import("./pages/clinic/RegisterPatient"));
const CreateReferral = lazy(() => import("./pages/clinic/CreateReferral"));
const ReferralStatus = lazy(() => import("./pages/clinic/ReferralStatus"));
const Notifications = lazy(() => import("./pages/clinic/Notifications"));
const Profile = lazy(() => import("./pages/clinic/Profile"));
const DoctorDashboard = lazy(() => import("./pages/doctor/DoctorDashboard"));
const IncomingReferrals = lazy(() => import("./pages/doctor/IncomingReferrals"));
const PatientHistory = lazy(() => import("./pages/doctor/PatientHistory"));
const DoctorNotifications = lazy(() => import("./pages/doctor/Notifications"));
const DoctorProfile = lazy(() => import("./pages/doctor/Profile"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ActivityLogs = lazy(() => import("./pages/admin/ActivityLogs"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
import NotFound from "./pages/NotFound";
import PatientForm from './pages/PatientForm';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-muted-foreground">Loading module...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/clinic-login" element={<ClinicLogin />} />
            <Route path="/test-patient-form" element={<PatientForm />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* Clinic Routes */}
            <Route path="/clinic/dashboard" element={<ClinicDashboard />} />
            <Route path="/clinic/register-patient" element={<RegisterPatient />} />
            <Route path="/clinic/create-referral" element={<CreateReferral />} />
            <Route path="/clinic/referral-status" element={<ReferralStatus />} />
            <Route path="/clinic/notifications" element={<Notifications />} />
            <Route path="/clinic/profile" element={<Profile />} />
            
            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/referrals" element={<IncomingReferrals />} />
            <Route path="/doctor/patient-history" element={<PatientHistory />} />
            <Route path="/doctor/notifications" element={<DoctorNotifications />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/logs" element={<ActivityLogs />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
