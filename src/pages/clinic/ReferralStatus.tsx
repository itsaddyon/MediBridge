import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReferralCard } from "@/components/ReferralCard";

import { getAllReferralsDB, Referral } from "@/lib/referralService";

/*
  IMPORTANT:
  - Same variable name: referrals
  - Same grouping structure
  - Only data source changed to Firestore
*/

export default function ReferralStatus() {
  const [referrals, setReferrals] = useState<{
    pending: Referral[];
    accepted: Referral[];
    diagnosed: Referral[];
    closed: Referral[];
  }>({
    pending: [],
    accepted: [],
    diagnosed: [],
    closed: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReferrals = async () => {
      try {
        const list = await getAllReferralsDB();

        setReferrals({
          pending: list.filter((r) => r.status === "pending"),
          accepted: list.filter((r) => r.status === "accepted"),
          diagnosed: list.filter((r) => r.status === "diagnosed"),
          closed: list.filter((r) => r.status === "closed"),
        });
      } catch (error) {
        console.error("Failed to load referrals", error);
      } finally {
        setLoading(false);
      }
    };

    loadReferrals();
  }, []);

  return (
    <DashboardLayout role="clinic">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Referral Status</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage all patient referrals
          </p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="diagnosed">Diagnosed</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>

          {(["pending", "accepted", "diagnosed", "closed"] as const).map(
            (status) => (
              <TabsContent key={status} value={status} className="mt-4">
                {loading ? (
                  <div className="text-muted-foreground">
                    Loading referrals…
                  </div>
                ) : referrals[status].length === 0 ? (
                  <div className="text-muted-foreground">
                    No {status} referrals
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {referrals[status].map((referral) => (
                      <ReferralCard
                        key={referral.id}
                        referral={referral}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
