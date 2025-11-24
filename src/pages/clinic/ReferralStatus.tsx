import { DashboardLayout } from "@/components/DashboardLayout";
import { ReferralCard } from "@/components/ReferralCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReferralStatus() {
  const referrals = {
    pending: [
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
        fromClinic: "Rural Health Center, Village A",
        toHospital: "Government General Hospital",
        status: "pending" as const,
        date: "2025-11-18",
        reason: "Severe abdominal pain and digestive issues",
      },
    ],
    accepted: [
      {
        id: "3",
        patientName: "Priya Sharma",
        fromClinic: "Rural Health Center, Village A",
        toHospital: "City Medical Center",
        status: "accepted" as const,
        date: "2025-11-17",
        reason: "Chronic diabetes management and complications",
      },
    ],
    diagnosed: [
      {
        id: "4",
        patientName: "Sneha Patel",
        fromClinic: "Rural Health Center, Village A",
        toHospital: "Specialty Care Hospital",
        status: "diagnosed" as const,
        date: "2025-11-16",
        reason: "Respiratory infection requiring specialist care",
      },
    ],
    closed: [
      {
        id: "5",
        patientName: "Vikram Reddy",
        fromClinic: "Rural Health Center, Village A",
        toHospital: "District Hospital",
        status: "closed" as const,
        date: "2025-11-15",
        reason: "Fracture treatment and follow-up care",
      },
    ],
  };

  return (
    <DashboardLayout role="clinic">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Referral Status</h1>
          <p className="text-muted-foreground mt-2">Track all patient referrals and their current status</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="diagnosed">Diagnosed</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {[...referrals.pending, ...referrals.accepted, ...referrals.diagnosed, ...referrals.closed].map((ref) => (
                <ReferralCard key={ref.id} {...ref} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {referrals.pending.map((ref) => (
                <ReferralCard key={ref.id} {...ref} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {referrals.accepted.map((ref) => (
                <ReferralCard key={ref.id} {...ref} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="diagnosed" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {referrals.diagnosed.map((ref) => (
                <ReferralCard key={ref.id} {...ref} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="closed" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {referrals.closed.map((ref) => (
                <ReferralCard key={ref.id} {...ref} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
