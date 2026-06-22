import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description?: string }) {
  return (
    <div className="rounded-lg border border-dashed bg-card p-8 text-center">
      <Icon className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />
      <div className="font-extrabold text-primary">{title}</div>
      {description && <p className="mt-1 text-sm font-semibold text-muted-foreground">{description}</p>}
    </div>
  );
}
