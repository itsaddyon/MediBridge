import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { User, Building2, Calendar, FileText } from "lucide-react";

interface ReferralCardProps {
  referral: {
    id: string;
    patientName: string;
    hospital: string;
    department: string;
    urgency: string;
    symptoms: string;
    diagnosis?: string;
    tests?: string;
    medications?: string;
    status: "pending" | "accepted" | "diagnosed" | "closed";
    createdAt?: any;
  };
}

export function ReferralCard({ referral }: ReferralCardProps) {
  const date = referral.createdAt?.toDate?.()?.toLocaleDateString() || "Unknown";
  const reason = referral.symptoms || "No symptoms specified";

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer border-border"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{referral.patientName}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                <span>{date}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={referral.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Hospital:</span>
          <span className="font-medium text-foreground">{referral.hospital}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Department:</span>
          <span className="font-medium text-foreground">{referral.department}</span>
        </div>
        <div className="flex items-start gap-2 text-sm mt-3 pt-3 border-t">
          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <span className="text-muted-foreground">Symptoms:</span>
            <p className="text-foreground mt-1">{reason}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
