import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ClinicLogin from "./pages/ClinicLogin";
import DoctorLogin from "./pages/DoctorLogin";
import AdminLogin from "./pages/AdminLogin";
import ClinicDashboard from "./pages/clinic/ClinicDashboard";
import RegisterPatient from "./pages/clinic/RegisterPatient";
import CreateReferral from "./pages/clinic/CreateReferral";
import ReferralStatus from "./pages/clinic/ReferralStatus";
import Notifications from "./pages/clinic/Notifications";
import Profile from "./pages/clinic/Profile";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import IncomingReferrals from "./pages/doctor/IncomingReferrals";
import PatientHistory from "./pages/doctor/PatientHistory";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ActivityLogs from "./pages/admin/ActivityLogs";
import NotFound from "./pages/NotFound";
import PatientForm from './pages/PatientForm';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/logs" element={<ActivityLogs />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
