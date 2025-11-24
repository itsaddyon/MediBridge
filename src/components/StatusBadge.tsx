import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "pending" | "accepted" | "diagnosed" | "closed";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    variant: "warning" as const,
  },
  accepted: {
    label: "Accepted",
    variant: "default" as const,
  },
  diagnosed: {
    label: "Diagnosed",
    variant: "secondary" as const,
  },
  closed: {
    label: "Closed",
    variant: "success" as const,
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config.variant}
      className={cn("font-medium", className)}
    >
      {config.label}
    </Badge>
  );
}
