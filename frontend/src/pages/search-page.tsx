import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { propertiesApi } from "@/api/properties";
import { PublicShell } from "@/components/public-shell";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCities, useGovernorates, useNeighborhoods } from "@/hooks/use-locations";
import { damageLabels, propertyTypeLabels } from "@/lib/labels";
import { filterMockProperties } from "@/lib/mock-data";
import type { DamageStatus, PropertyFilters, PropertyType } from "@/types/api";

const any = "__any__";

export function SearchPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<PropertyFilters>({});
  const [filters, setFilters] = useState<PropertyFilters>({});
  const governorates = useGovernorates();
  const cities = useCities(draft.governorate_id);
  const neighborhoods = useNeighborhoods(draft.city_id);
  const properties = useQuery({ queryKey: ["properties", "search", filters], queryFn: () => propertiesApi.list(filters) });
  const rows = properties.data?.length ? properties.data : filterMockProperties(filters);

  return (
    <PublicShell>
      <div className="page-container max-w-5xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                البحث وتصفية العقارات
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-2">
              <Label>بحث</Label>
              <div className="relative">
                <Input placeholder="ابحث بالعنوان أو الموقع..." className="pr-10" disabled />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FilterSelect label="المحافظة" value={draft.governorate_id} placeholder="اختر المحافظة" onChange={(value) => setDraft({ ...draft, governorate_id: value, city_id: "", neighborhood_id: "" })}>
                {governorates.data?.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}
              </FilterSelect>
              <FilterSelect label="المدينة" value={draft.city_id} placeholder="اختر المدينة" disabled={!draft.governorate_id} onChange={(value) => setDraft({ ...draft, city_id: value, neighborhood_id: "" })}>
                {cities.data?.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}
              </FilterSelect>
              <FilterSelect label="الحي" value={draft.neighborhood_id} placeholder="اختر الحي" disabled={!draft.city_id} onChange={(value) => setDraft({ ...draft, neighborhood_id: value })}>
                {neighborhoods.data?.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}
              </FilterSelect>
              <FilterSelect label="نوع العقار" value={draft.type} placeholder="اختر النوع" onChange={(value) => setDraft({ ...draft, type: value })}>
                {(Object.keys(propertyTypeLabels) as PropertyType[]).map((key) => <SelectItem key={key} value={key}>{propertyTypeLabels[key]}</SelectItem>)}
              </FilterSelect>
              <div className="grid gap-2">
                <Label>السعر من</Label>
                <Input type="number" value={draft.min_price ?? ""} onChange={(event) => setDraft({ ...draft, min_price: event.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>السعر إلى</Label>
                <Input type="number" value={draft.max_price ?? ""} onChange={(event) => setDraft({ ...draft, max_price: event.target.value })} />
              </div>
              <FilterSelect label="عدد الغرف" value={draft.rooms} placeholder="اختر عدد الغرف" onChange={(value) => setDraft({ ...draft, rooms: value })}>
                {["1", "2", "3", "4", "5"].map((room) => <SelectItem key={room} value={room}>{room === "5" ? "5+ غرف" : `${room} غرف`}</SelectItem>)}
              </FilterSelect>
              <FilterSelect label="حالة العقار" value={draft.damage_status} placeholder="اختر الحالة" onChange={(value) => setDraft({ ...draft, damage_status: value })}>
                {(Object.keys(damageLabels) as DamageStatus[]).map((key) => <SelectItem key={key} value={key}>{damageLabels[key]}</SelectItem>)}
              </FilterSelect>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["has_water", "يتوفر ماء"],
                ["has_electricity", "تتوفر كهرباء"],
                ["is_ready", "جاهز للسكن"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 rounded-md border p-3 font-bold">
                  <input type="checkbox" checked={draft[key as keyof PropertyFilters] === "1"} onChange={(event) => setDraft({ ...draft, [key]: event.target.checked ? "1" : "" })} />
                  {label}
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setDraft({}); setFilters({}); }}>إعادة التصفية</Button>
              <Button className="flex-1" onClick={() => setFilters(draft)}>تطبيق الفلاتر</Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title">نتائج البحث</h2>
            <span className="font-bold text-muted-foreground">{rows.length} عقار</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((property) => (
              <Link key={property.id} to={`/properties/${property.id}`} className="block">
                <PropertyCard property={property} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PublicShell>
  );
}

function FilterSelect({
  label,
  value,
  placeholder,
  disabled,
  children,
  onChange,
}: {
  label: string;
  value?: string;
  placeholder: string;
  disabled?: boolean;
  children: React.ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select value={value || any} disabled={disabled} onValueChange={(next) => onChange(next === any ? "" : next)}>
        <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          <SelectItem value={any}>الكل</SelectItem>
          {children}
        </SelectContent>
      </Select>
    </div>
  );
}
