import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "bg-primary/10 text-primary",
}: StatsCardProps) {
  return (
    <div className="glass-card p-6 rounded-xl border border-border/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mb-2">{value}</h3>
          {change && (
            <p
              className={cn(
                "text-sm font-medium",
                changeType === "positive" && "text-green-500",
                changeType === "negative" && "text-red-500",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", iconColor)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
