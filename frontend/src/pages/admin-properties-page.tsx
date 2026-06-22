import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, Check, ClipboardList, X } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/api/admin";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { badgeVariant, propertyTypeLabels, statusLabels } from "@/lib/labels";
import { formatCurrency } from "@/lib/utils";
import type { Property, PropertyStatus } from "@/types/api";

export function AdminPropertiesPage() {
  const queryClient = useQueryClient();
  const [rejecting, setRejecting] = useState<Property | null>(null);
  const [reason, setReason] = useState("");
  const properties = useQuery({ queryKey: ["admin", "properties"], queryFn: adminApi.properties });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
  const accept = useMutation({ mutationFn: adminApi.acceptProperty, onSuccess: () => { toast.success("تم قبول العقار"); invalidate(); } });
  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => adminApi.rejectProperty(id, reason),
    onSuccess: () => { toast.success("تم رفض العقار"); setRejecting(null); setReason(""); invalidate(); },
  });
  const archive = useMutation({ mutationFn: adminApi.archiveProperty, onSuccess: () => { toast.success("تمت أرشفة العقار"); invalidate(); } });

  return (
    <div className="page-container grid gap-5">
      <div>
        <h1 className="text-3xl font-black text-foreground">مراجعة العقارات</h1>
        <p className="font-bold text-muted-foreground">قبول أو رفض أو أرشفة العقارات المنشورة من المضيفين.</p>
      </div>
      <Tabs defaultValue="all">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="all">كل العقارات</TabsTrigger>
          <TabsTrigger value="pending">بانتظار المراجعة</TabsTrigger>
          <TabsTrigger value="accepted">مقبولة</TabsTrigger>
          <TabsTrigger value="rejected">مرفوضة</TabsTrigger>
        </TabsList>
        {(["all", "pending", "accepted", "rejected"] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <PropertyRows
              properties={(properties.data ?? []).filter((item) => tab === "all" || item.status === tab)}
              onAccept={(property) => accept.mutate(property.id)}
              onReject={setRejecting}
              onArchive={(property) => archive.mutate(property.id)}
            />
          </TabsContent>
        ))}
      </Tabs>
      <Dialog open={Boolean(rejecting)} onOpenChange={(open) => !open && setRejecting(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>رفض العقار</DialogTitle></DialogHeader>
          <Textarea placeholder="اكتب سبب الرفض..." value={reason} onChange={(event) => setReason(event.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejecting(null)}>إلغاء</Button>
            <Button variant="destructive" disabled={!reason.trim() || reject.isPending} onClick={() => rejecting && reject.mutate({ id: rejecting.id, reason })}>
              تأكيد الرفض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PropertyRows({
  properties,
  onAccept,
  onReject,
  onArchive,
}: {
  properties: Property[];
  onAccept: (property: Property) => void;
  onReject: (property: Property) => void;
  onArchive: (property: Property) => void;
}) {
  if (!properties.length) return <EmptyState icon={ClipboardList} title="لا توجد عقارات في هذا القسم" />;
  return (
    <div className="grid gap-3">
      {properties.map((property) => (
        <Card key={property.id}>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <div className="text-lg font-extrabold text-foreground">{property.title}</div>
              <div className="text-sm font-bold text-muted-foreground">
                {propertyTypeLabels[property.type]} - {formatCurrency(property.price)} د.ل
              </div>
              {property.rejection_reason && <div className="mt-1 text-sm font-bold text-destructive">{property.rejection_reason}</div>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {property.status && <Badge variant={badgeVariant(property.status)}>{statusLabels[property.status as PropertyStatus]}</Badge>}
              {property.status !== "accepted" && <Button size="sm" onClick={() => onAccept(property)}><Check className="h-4 w-4" />قبول</Button>}
              <Button size="sm" variant="outline" onClick={() => onReject(property)}><X className="h-4 w-4" />رفض</Button>
              <Button size="sm" variant="outline" onClick={() => onArchive(property)}><Archive className="h-4 w-4" />أرشفة</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
