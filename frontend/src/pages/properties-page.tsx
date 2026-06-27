import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { propertiesApi } from "@/api/properties";
import { tenantApi } from "@/api/tenant";
import { AppNavbar } from "@/components/app-navbar";
import { EmptyState } from "@/components/empty-state";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCities, useGovernorates, useNeighborhoods } from "@/hooks/use-locations";
import { damageLabels, propertyTypeLabels } from "@/lib/labels";
import { useAuthStore } from "@/stores/auth-store";
import type { DamageStatus, PropertyFilters, PropertyType } from "@/types/api";

const any = "__any__";

export function PropertiesPage() {
  const queryClient = useQueryClient();
  const { token, role } = useAuthStore();
  const [draft, setDraft] = useState<PropertyFilters>({});
  const [filters, setFilters] = useState<PropertyFilters>({});
  const governorates = useGovernorates();
  const cities = useCities(draft.governorate_id);
  const neighborhoods = useNeighborhoods(draft.city_id);

  const properties = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => propertiesApi.list(filters),
  });

  const favorite = useMutation({
    mutationFn: async (propertyId: number) => tenantApi.addFavorite(propertyId),
    onSuccess: () => {
      toast.success("تمت إضافة العقار للمفضلة");
      queryClient.invalidateQueries({ queryKey: ["tenant", "favorites"] });
    },
    onError: () => toast.error("سجل الدخول كمستأجر لإضافة المفضلة"),
  });

  const count = properties.data?.length ?? 0;

  return (
    <div className="app-shell">
      <AppNavbar />
      <div className="page-container grid gap-5 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              تصفية العقارات
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field label="المحافظة">
              <Select value={draft.governorate_id ?? any} onValueChange={(value) => setDraft({ ...draft, governorate_id: value === any ? "" : value, city_id: "", neighborhood_id: "" })}>
                <SelectTrigger><SelectValue placeholder="كل المحافظات" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={any}>كل المحافظات</SelectItem>
                  {governorates.data?.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="المدينة">
              <Select value={draft.city_id ?? any} onValueChange={(value) => setDraft({ ...draft, city_id: value === any ? "" : value, neighborhood_id: "" })} disabled={!draft.governorate_id}>
                <SelectTrigger><SelectValue placeholder="كل المدن" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={any}>كل المدن</SelectItem>
                  {cities.data?.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="الحي">
              <Select value={draft.neighborhood_id ?? any} onValueChange={(value) => setDraft({ ...draft, neighborhood_id: value === any ? "" : value })} disabled={!draft.city_id}>
                <SelectTrigger><SelectValue placeholder="كل الأحياء" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={any}>كل الأحياء</SelectItem>
                  {neighborhoods.data?.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="نوع العقار">
              <Select value={draft.type ?? any} onValueChange={(value) => setDraft({ ...draft, type: value === any ? "" : value })}>
                <SelectTrigger><SelectValue placeholder="كل الأنواع" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={any}>كل الأنواع</SelectItem>
                  {(Object.keys(propertyTypeLabels) as PropertyType[]).map((key) => <SelectItem key={key} value={key}>{propertyTypeLabels[key]}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="السعر من">
                <Input type="number" value={draft.min_price ?? ""} onChange={(event) => setDraft({ ...draft, min_price: event.target.value })} />
              </Field>
              <Field label="السعر إلى">
                <Input type="number" value={draft.max_price ?? ""} onChange={(event) => setDraft({ ...draft, max_price: event.target.value })} />
              </Field>
            </div>
            <Field label="عدد الغرف">
              <Input type="number" value={draft.rooms ?? ""} onChange={(event) => setDraft({ ...draft, rooms: event.target.value })} />
            </Field>
            <Field label="حالة الضرر">
              <Select value={draft.damage_status ?? any} onValueChange={(value) => setDraft({ ...draft, damage_status: value === any ? "" : value })}>
                <SelectTrigger><SelectValue placeholder="كل الحالات" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={any}>كل الحالات</SelectItem>
                  {(Object.keys(damageLabels) as DamageStatus[]).map((key) => <SelectItem key={key} value={key}>{damageLabels[key]}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid gap-2 text-sm font-bold">
              {[
                ["has_water", "يتوفر ماء"],
                ["has_electricity", "تتوفر كهرباء"],
                ["is_ready", "جاهز للسكن"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={draft[key as keyof PropertyFilters] === "1"}
                    onChange={(event) => setDraft({ ...draft, [key]: event.target.checked ? "1" : "" })}
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => setFilters(draft)}>
                <Search className="h-4 w-4" />
                تطبيق
              </Button>
              <Button variant="outline" onClick={() => { setDraft({}); setFilters({}); }}>
                إعادة
              </Button>
            </div>
          </CardContent>
        </Card>
        <section className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-primary">العقارات المتاحة</h1>
              <p className="font-bold text-muted-foreground">عرض {count} عقار</p>
            </div>
          </div>
          {properties.isLoading ? (
            <PropertyGridSkeleton />
          ) : count === 0 ? (
            <EmptyState icon={Search} title="لا توجد عقارات مطابقة" description="جرّب تعديل الفلاتر أو إعادة التصفية." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {properties.data?.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onFavorite={token && role === "tenant" ? (item) => favorite.mutate(item.id) : undefined}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function PropertyGridSkeleton() {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-80 rounded-lg bg-muted animate-pulse" />)}</div>;
}
