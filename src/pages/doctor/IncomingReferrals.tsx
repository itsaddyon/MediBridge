import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ReferralCard } from "@/components/ReferralCard";
import { Input } from "@/components/ui/input";
import type { ReferralStatus } from "@/types";
import { readHospitals, updateHospital } from "@/lib/bedStore";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

import {
  getAllReferralsDB,
  updateReferralStatusDB,
  Referral,
} from "@/lib/referralService";

/*
  IMPORTANT:
  - Same variable name: referrals
  - Same filters UI
  - Only added: bed decrement on ACCEPT
*/

export default function IncomingReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    getAllReferralsDB().then(setReferrals);
  }, []);

  const filteredReferrals = referrals.filter((ref) => {
    const matchesSearch = ref.patientName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || ref.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ✅ UPDATED FUNCTION
  const handleStatusUpdate = async (
  id: string,
  status: Referral["status"],
  hospitalName: string
) => {

    await updateReferralStatusDB(id, status);
    

    // 🔽 AUTO-DECREMENT BED ON ACCEPT
    if (status === "accepted") {
      const hospitals = readHospitals();
      const hospital = hospitals.find((h) => h.name === hospitalName);

      if (hospital && hospital.availableBeds > 0) {
        updateHospital(hospital.id, {
          availableBeds: hospital.availableBeds - 1,
        });
      }
    }

    setReferrals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Incoming Referrals
          </h1>
          <p className="text-muted-foreground mt-2">
            Review and manage patient referrals from clinics
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v)}
          >
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
        </div>

        {/* Referral Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReferrals.map((referral) => (
            <div key={referral.id} className="relative">
              <ReferralCard referral={referral} />

              {/* Doctor Actions */}
              {referral.status === "pending" && (
                <button
                  className="absolute bottom-4 right-4 text-sm text-blue-600"
                  onClick={() =>
                    handleStatusUpdate(
                      referral.id,
                      "accepted",
                      referral.hospital
                    )
                  }
                >
                  Accept
                </button>
              )}

              {referral.status === "accepted" && (
                <button
                  className="absolute bottom-4 right-4 text-sm text-green-600"
                  onClick={() =>
                    handleStatusUpdate(
                      referral.id,
                      "diagnosed",
                      referral.hospital
                    )
                  }
                >
                  Mark Diagnosed
                </button>
              )}

              {referral.status === "diagnosed" && (
                <button
                  className="absolute bottom-4 right-4 text-sm text-gray-600"
                  onClick={() =>
                    handleStatusUpdate(
                      referral.id,
                      "closed",
                      referral.hospital
                    )
                  }
                >
                  Close Case
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
