import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: LucideIcon }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-3xl font-black text-primary">{value}</div>
          <div className="text-sm font-bold text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
