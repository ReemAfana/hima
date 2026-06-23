import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertTriangle, Calendar, CalendarCheck, FileText } from "lucide-react";
import { toast } from "sonner";
import { propertiesApi } from "@/api/properties";
import { tenantApi } from "@/api/tenant";
import { PublicShell } from "@/components/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getMockProperty } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const durationOptions = [
  { value: "1", label: "شهر واحد" },
  { value: "3", label: "3 أشهر" },
  { value: "6", label: "6 أشهر" },
  { value: "12", label: "سنة كاملة" },
];

export function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    startDate: "",
    duration: "",
    message: "",
    agreeToTerms: false,
    agreeToDamage: false,
    agreeToDeposit: false,
  });
  const property = useQuery({ queryKey: ["properties", id], queryFn: () => propertiesApi.show(id!), enabled: Boolean(id) });
  const propertyData = property.data ?? getMockProperty(id);
  const months = Number(form.duration || 0);
  const monthlyPrice = Number(propertyData?.price ?? 0);
  const rentTotal = months * monthlyPrice;
  const grandTotal = rentTotal + monthlyPrice;
  const endDate = useMemo(() => {
    if (!form.startDate || !months) return "";
    const date = new Date(form.startDate);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().slice(0, 10);
  }, [form.startDate, months]);

  const createBooking = useMutation({
    mutationFn: tenantApi.createBooking,
    onSuccess: () => {
      toast.success("تم إرسال طلب الحجز بنجاح. سيقوم المضيف بمراجعته.");
      navigate("/dashboard/tenant");
    },
    onError: () => toast.error("تعذر إرسال طلب الحجز"),
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!id || !endDate) return;
    if (!form.agreeToTerms || !form.agreeToDamage || !form.agreeToDeposit) {
      toast.error("يجب الموافقة على جميع الشروط قبل إرسال الطلب");
      return;
    }
    if (window.location.pathname.startsWith("/tenant-preview")) {
      navigate("/tenant-preview/requests");
      return;
    }
    createBooking.mutate({ property_id: Number(id), start_date: form.startDate, end_date: endDate });
  }

  return (
    <PublicShell>
      <div className="page-container grid max-w-5xl gap-6 lg:grid-cols-[1fr_340px]">
        <section>
          <form onSubmit={submit} className="grid gap-6">
            <Card>
              <CardHeader><CardTitle>تفاصيل طلب الحجز</CardTitle></CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label className="text-muted-foreground">العقار</Label>
                  <p className="mt-1 font-extrabold text-foreground">{propertyData?.title ?? "..."}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>تاريخ البداية</Label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                      <Input className="pr-10" type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} required />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>مدة الإيجار</Label>
                    <Select value={form.duration} onValueChange={(duration) => setForm({ ...form, duration })}>
                      <SelectTrigger><SelectValue placeholder="اختر المدة" /></SelectTrigger>
                      <SelectContent>{durationOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>رسالة للمضيف (اختياري)</Label>
                  <Textarea
                    placeholder="عرّف بنفسك واشرح سبب اهتمامك بالعقار..."
                    value={form.message}
                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  الشروط والأحكام
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Agreement
                  checked={form.agreeToTerms}
                  onChange={(value) => setForm({ ...form, agreeToTerms: value })}
                  title="أوافق على سياسة الإلغاء"
                  text="يمكن تعديل أو إلغاء الطلب قبل موافقة المضيف. بعد إنشاء العقد تطبق شروط العقد المتفق عليها."
                />
                <Agreement
                  checked={form.agreeToDamage}
                  onChange={(value) => setForm({ ...form, agreeToDamage: value })}
                  title="أقبل مسؤولية الأضرار الجديدة"
                  text="أفهم أن الأضرار التي تحدث أثناء فترة السكن يجب توثيقها ومعالجتها وفق الاتفاق."
                />
                <Agreement
                  checked={form.agreeToDeposit}
                  onChange={(value) => setForm({ ...form, agreeToDeposit: value })}
                  title="أوافق على شروط مبلغ التأمين"
                  text="قد يطلب المضيف مبلغ تأمين يعادل شهراً واحداً ويعاد بعد الخروج بعد خصم أي مستحقات موثقة."
                />
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>إلغاء</Button>
              <Button className="flex-1" disabled={createBooking.isPending || !months}>
                <CalendarCheck className="h-4 w-4" />
                إرسال طلب الحجز
              </Button>
            </div>
          </form>
        </section>

        <aside className="h-fit lg:sticky lg:top-24">
          <Card>
            <CardHeader><CardTitle>ملخص الحجز</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              <Summary label="العقار" value={propertyData?.title ?? "-"} />
              <div className="border-t pt-4">
                <Summary label="الإيجار الشهري" value={`${formatCurrency(monthlyPrice)} د.ل`} />
                <Summary label="المدة" value={months ? durationOptions.find((option) => option.value === form.duration)?.label ?? "-" : "-"} />
                <Summary label="تاريخ النهاية" value={endDate || "-"} />
                <Summary label="مبلغ التأمين" value={`${formatCurrency(monthlyPrice)} د.ل`} />
              </div>
              <div className="border-t pt-4">
                <Summary label="الإجمالي التقريبي" value={`${formatCurrency(grandTotal)} د.ل`} strong />
                <p className="mt-2 text-sm font-semibold text-muted-foreground">يشمل الإيجار للمدة المختارة + مبلغ تأمين شهر واحد.</p>
              </div>
              <div className="rounded-lg bg-accent p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm font-semibold text-muted-foreground">سيتم إرسال الطلب إلى المضيف للموافقة. ستصلك إشعارات عند الرد.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </PublicShell>
  );
}

function Agreement({ checked, onChange, title, text }: { checked: boolean; onChange: (checked: boolean) => void; title: string; text: string }) {
  return (
    <label className="flex items-start gap-3 rounded-lg border p-4">
      <input className="mt-1" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>
        <span className="block font-extrabold text-foreground">{title}</span>
        <span className="mt-1 block text-sm font-semibold text-muted-foreground">{text}</span>
      </span>
    </label>
  );
}

function Summary({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="mb-2 flex items-start justify-between gap-4">
      <span className="font-bold text-muted-foreground">{label}</span>
      <span className={strong ? "text-xl font-black text-primary" : "font-extrabold text-foreground"}>{value}</span>
    </div>
  );
}
