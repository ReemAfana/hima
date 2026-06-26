import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, Eye, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { hostApi } from "@/api/host";
import { EmptyState } from "@/components/empty-state";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function HostPropertiesPage() {
  const queryClient = useQueryClient();
  const properties = useQuery({ queryKey: ["host", "properties"], queryFn: hostApi.properties });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["host", "properties"] });
  const toggle = useMutation({ mutationFn: hostApi.toggleAvailability, onSuccess: () => { toast.success("تم تحديث الإتاحة"); invalidate(); } });
  const archive = useMutation({ mutationFn: hostApi.archiveProperty, onSuccess: () => { toast.success("تمت أرشفة العقار"); invalidate(); } });

  return (
    <div className="page-container grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-foreground">عقاراتي</h1>
          <p className="font-bold text-muted-foreground">إدارة عقاراتك وحالة توفرها.</p>
        </div>
        <Button asChild><Link to="/host/properties/new"><Plus className="h-4 w-4" />إضافة عقار</Link></Button>
      </div>
      <Tabs defaultValue="all">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="pending">بانتظار الموافقة</TabsTrigger>
          <TabsTrigger value="accepted">مقبولة</TabsTrigger>
          <TabsTrigger value="rejected">مرفوضة</TabsTrigger>
        </TabsList>
        {(["all", "pending", "accepted", "rejected"] as const).map((tab) => {
          const rows = (properties.data ?? []).filter((item) => tab === "all" || item.status === tab);
          return (
            <TabsContent key={tab} value={tab}>
              {rows.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {rows.map((property) => (
                    <div key={property.id} className="grid gap-2">
                      <PropertyCard property={property} showStatus />
                      <div className="flex flex-wrap gap-2 rounded-lg border bg-card p-2">
                        <Button asChild size="sm" variant="outline"><Link to={`/properties/${property.id}`}><Eye className="h-4 w-4" />عرض</Link></Button>
                        <Button asChild size="sm" variant="outline"><Link to={`/host/properties/${property.id}/edit`}>تعديل</Link></Button>
                        <Button size="sm" variant="outline" disabled={property.status !== "accepted" || property.availability === "booked"} onClick={() => toggle.mutate(property.id)}>
                          <RefreshCw className="h-4 w-4" />تغيير الإتاحة
                        </Button>
                        <Button size="sm" variant="outline" disabled={property.availability === "booked"} onClick={() => archive.mutate(property.id)}>
                          <Archive className="h-4 w-4" />أرشفة
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <EmptyState icon={Plus} title="لا توجد عقارات هنا" />}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
