import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { User, Building2, Calendar, FileText } from "lucide-react";

interface ReferralCardProps {
  id: string;
  patientName: string;
  fromClinic: string;
  toHospital: string;
  status: "pending" | "accepted" | "diagnosed" | "closed";
  date: string;
  reason: string;
  onClick?: () => void;
}

export function ReferralCard({
  patientName,
  fromClinic,
  toHospital,
  status,
  date,
  reason,
  onClick,
}: ReferralCardProps) {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer border-border"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{patientName}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                <span>{date}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">From:</span>
          <span className="font-medium text-foreground">{fromClinic}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">To:</span>
          <span className="font-medium text-foreground">{toHospital}</span>
        </div>
        <div className="flex items-start gap-2 text-sm mt-3 pt-3 border-t">
          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <span className="text-muted-foreground">Reason:</span>
            <p className="text-foreground mt-1">{reason}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
