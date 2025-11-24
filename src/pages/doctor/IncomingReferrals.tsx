import { DashboardLayout } from "@/components/DashboardLayout";
import { ReferralCard } from "@/components/ReferralCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function IncomingReferrals() {
  const referrals = [
    {
      id: "1",
      patientName: "Rajesh Kumar",
      fromClinic: "Rural Health Center, Village A",
      toHospital: "District Hospital",
      status: "pending" as const,
      date: "2025-11-18",
      reason: "Suspected cardiac condition requiring specialist consultation",
    },
    {
      id: "2",
      patientName: "Amit Singh",
      fromClinic: "Rural Health Center, Village B",
      toHospital: "District Hospital",
      status: "pending" as const,
      date: "2025-11-18",
      reason: "Severe abdominal pain and digestive issues",
    },
    {
      id: "3",
      patientName: "Sneha Patel",
      fromClinic: "Community Health Center",
      toHospital: "District Hospital",
      status: "accepted" as const,
      date: "2025-11-17",
      reason: "Respiratory infection requiring specialist care",
    },
    {
      id: "4",
      patientName: "Priya Sharma",
      fromClinic: "Rural Health Center, Village C",
      toHospital: "District Hospital",
      status: "diagnosed" as const,
      date: "2025-11-16",
      reason: "Chronic diabetes management and complications",
    },
    {
      id: "5",
      patientName: "Vikram Reddy",
      fromClinic: "Primary Health Center",
      toHospital: "District Hospital",
      status: "closed" as const,
      date: "2025-11-15",
      reason: "Fracture treatment and follow-up care",
    },
  ];

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Incoming Referrals</h1>
          <p className="text-muted-foreground mt-2">Review and manage patient referrals from clinics</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name..."
              className="pl-10"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="diagnosed">Diagnosed</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="date">
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (Newest)</SelectItem>
              <SelectItem value="date-old">Date (Oldest)</SelectItem>
              <SelectItem value="name">Patient Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Referral Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {referrals.map((referral) => (
            <ReferralCard key={referral.id} {...referral} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
