import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Save } from "lucide-react";
import { toast } from "sonner";
import { hostApi } from "@/api/host";
import { PublicShell } from "@/components/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCities, useGovernorates, useNeighborhoods } from "@/hooks/use-locations";
import { damageLabels, propertyTypeLabels } from "@/lib/labels";
import { getMockProperty } from "@/lib/mock-data";
import type { DamageStatus, PropertyFormPayload, PropertyType } from "@/types/api";

const noValue = "__none__";
const initialForm: PropertyFormPayload = {
  title: "",
  description: "",
  type: "apartment",
  governorate_id: "",
  city_id: "",
  neighborhood_id: "",
  street: "",
  price: "",
  area_m2: "",
  rooms: "",
  damage_status: "intact",
  has_water: false,
  has_electricity: false,
  is_ready: false,
};

export function PropertyFormPage({ previewMode = false }: { previewMode?: boolean }) {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<PropertyFormPayload>(initialForm);
  const [uiOnly, setUiOnly] = useState({ minimumStay: "", paymentMethod: "monthly", rules: "" });
  const [files, setFiles] = useState<File[]>([]);
  const governorates = useGovernorates();
  const cities = useCities(form.governorate_id);
  const neighborhoods = useNeighborhoods(form.city_id);
  const property = useQuery({ queryKey: ["host", "properties", id], queryFn: () => hostApi.property(id!), enabled: isEdit && !previewMode });

  useEffect(() => {
    const propertyData = previewMode && isEdit ? getMockProperty(id) : property.data;
    if (propertyData) {
      // Hydrate the edit form once the existing property arrives from the API.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        title: propertyData.title ?? "",
        description: propertyData.description ?? "",
        type: propertyData.type,
        governorate_id: String(propertyData.governorate_id ?? ""),
        city_id: String(propertyData.city_id ?? ""),
        neighborhood_id: String(propertyData.neighborhood_id ?? ""),
        street: propertyData.street ?? "",
        price: String(propertyData.price ?? ""),
        area_m2: String(propertyData.area_m2 ?? ""),
        rooms: String(propertyData.rooms ?? ""),
        damage_status: propertyData.damage_status,
        has_water: Boolean(propertyData.has_water),
        has_electricity: Boolean(propertyData.has_electricity),
        is_ready: Boolean(propertyData.is_ready),
      });
    }
  }, [id, isEdit, previewMode, property.data]);

  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);

  const save = useMutation({
    mutationFn: async () => {
      if (previewMode) return { property: { id: 0 } };
      const result = isEdit ? await hostApi.updateProperty(id!, form) : await hostApi.createProperty(form);
      if (files.length) await hostApi.uploadImages(result.property.id, files);
      return result;
    },
    onSuccess: () => {
      toast.success(previewMode ? "هذه معاينة فقط. في الحساب الحقيقي سيتم إرسال العقار للمراجعة" : isEdit ? "تم تحديث العقار" : "تم إرسال العقار للمراجعة");
      queryClient.invalidateQueries({ queryKey: ["host", "properties"] });
      navigate(previewMode ? "/host-preview" : "/host/properties");
    },
    onError: () => toast.error("تعذر حفظ العقار. تحقق من البيانات المدخلة"),
  });

  const content = (
    <div className="page-container max-w-5xl">
      <Card>
        <CardHeader><CardTitle>{previewMode && isEdit ? "معاينة تعديل العقار" : previewMode ? "معاينة إضافة عقار" : isEdit ? "تعديل العقار" : "إضافة عقار جديد"}</CardTitle></CardHeader>
        <CardContent>
          <form
            className="grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              save.mutate();
            }}
          >
            <Section title="المعلومات الأساسية">
              <div className="form-grid">
                <Field label="عنوان العقار"><Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></Field>
                <Field label="نوع العقار">
                  <Select value={form.type} onValueChange={(value: PropertyType) => setForm({ ...form, type: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{(Object.keys(propertyTypeLabels) as PropertyType[]).map((key) => <SelectItem key={key} value={key}>{propertyTypeLabels[key]}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="السعر الشهري"><Input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /></Field>
                <Field label="المساحة"><Input type="number" value={form.area_m2} onChange={(event) => setForm({ ...form, area_m2: event.target.value })} /></Field>
                <Field label="عدد الغرف"><Input type="number" value={form.rooms} onChange={(event) => setForm({ ...form, rooms: event.target.value })} /></Field>
                <Field label="أقل مدة">
                  <Select value={uiOnly.minimumStay || noValue} onValueChange={(value) => setUiOnly({ ...uiOnly, minimumStay: value === noValue ? "" : value })}>
                    <SelectTrigger><SelectValue placeholder="اختر المدة" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 month">شهر واحد</SelectItem>
                      <SelectItem value="3 months">3 أشهر</SelectItem>
                      <SelectItem value="6 months">6 أشهر</SelectItem>
                      <SelectItem value="1 year">سنة</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="طريقة الدفع">
                  <Select value={uiOnly.paymentMethod} onValueChange={(value) => setUiOnly({ ...uiOnly, paymentMethod: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">شهري</SelectItem>
                      <SelectItem value="advance">مقدم</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="المحافظة">
                  <Select value={form.governorate_id || noValue} onValueChange={(value) => setForm({ ...form, governorate_id: value === noValue ? "" : value, city_id: "", neighborhood_id: "" })}>
                    <SelectTrigger><SelectValue placeholder="اختر المحافظة" /></SelectTrigger>
                    <SelectContent>{governorates.data?.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="المدينة">
                  <Select value={form.city_id || noValue} onValueChange={(value) => setForm({ ...form, city_id: value === noValue ? "" : value, neighborhood_id: "" })} disabled={!form.governorate_id}>
                    <SelectTrigger><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                    <SelectContent>{cities.data?.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="الحي">
                  <Select value={form.neighborhood_id || noValue} onValueChange={(value) => setForm({ ...form, neighborhood_id: value === noValue ? "" : value })} disabled={!form.city_id}>
                    <SelectTrigger><SelectValue placeholder="اختر الحي" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={noValue}>بدون حي</SelectItem>
                      {neighborhoods.data?.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="الشارع"><Input value={form.street} onChange={(event) => setForm({ ...form, street: event.target.value })} /></Field>
              </div>
              <Field label="الوصف"><Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field>
            </Section>
            <Section title="حالة العقار">
              <Field label="حالة الضرر">
                <Select value={form.damage_status} onValueChange={(value: DamageStatus) => setForm({ ...form, damage_status: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{(Object.keys(damageLabels) as DamageStatus[]).map((key) => <SelectItem key={key} value={key}>{damageLabels[key]}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <div className="grid gap-3 sm:grid-cols-3">
                <CheckField label="يتوفر ماء" checked={form.has_water} onChange={(value) => setForm({ ...form, has_water: value })} />
                <CheckField label="تتوفر كهرباء" checked={form.has_electricity} onChange={(value) => setForm({ ...form, has_electricity: value })} />
                <CheckField label="جاهز للسكن" checked={form.is_ready} onChange={(value) => setForm({ ...form, is_ready: value })} />
              </div>
            </Section>
            <Section title="الصور">
              <Label>صور العقار</Label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-secondary/50 p-8 text-center font-bold text-muted-foreground">
                <ImagePlus className="mb-2 h-8 w-8 text-primary" />
                اختر صوراً للعقار
                <Input className="hidden" type="file" multiple accept="image/*" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
              </label>
              {previews.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {previews.map((preview) => <img key={preview.url} src={preview.url} alt={preview.file.name} className="h-32 w-full rounded-md object-cover" />)}
                </div>
              )}
            </Section>
            <Section title="القواعد والسياسات">
              <Field label="قواعد العقار">
                <Textarea
                  placeholder="مثال: ممنوع التدخين، يسمح بالحيوانات الأليفة بتأمين، ساعات الهدوء بعد 10 مساءً..."
                  value={uiOnly.rules}
                  onChange={(event) => setUiOnly({ ...uiOnly, rules: event.target.value })}
                />
              </Field>
              <p className="text-sm font-semibold text-muted-foreground">هذه الحقول للعرض وتجهيز الواجهة فقط في هذه المرحلة، ولا ترسل إلى Laravel حالياً.</p>
            </Section>
            <div className="flex gap-2">
              <Button disabled={save.isPending}><Save className="h-4 w-4" />{previewMode ? "تجربة الإرسال" : isEdit ? "حفظ التعديلات" : "إرسال للمراجعة"}</Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>إلغاء</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  if (previewMode) {
    return <PublicShell mode="host-preview">{content}</PublicShell>;
  }

  return content;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-2"><Label>{label}</Label>{children}</div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 rounded-lg border bg-card p-5">
      <h2 className="section-title">{title}</h2>
      {children}
    </div>
  );
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-md border bg-card p-3 font-bold">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}
