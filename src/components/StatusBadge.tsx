import { cn } from "@/lib/utils";

type Status = "pending" | "accepted" | "diagnosed" | "closed";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "status-warning",
  },
  accepted: {
    label: "Accepted",
    className: "status-info",
  },
  diagnosed: {
    label: "Diagnosed",
    className: "status-success",
  },
  closed: {
    label: "Closed",
    className: "status-success",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn("status-indicator", config.className, className)}>
      {config.label}
    </span>
  );
}
