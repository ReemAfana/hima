import { Link, useLocation } from "react-router-dom";
import { Bell, FileText } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bookingStatusLabels } from "@/lib/labels";
import { mockProperties } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { propertyLocation } from "@/lib/view-models";

const tenantRequests = [
  {
    id: "tenant-req-1",
    propertyId: 9001,
    status: "pending" as const,
    startDate: "2026-08-10",
    duration: "6 أشهر",
    hostMessage: "مرحباً مريم، وصلني طلب الحجز وسأراجعه قريباً. سأخبرك بالقبول أو الرفض بعد مراجعة التفاصيل.",
  },
  {
    id: "tenant-req-2",
    propertyId: 9003,
    status: "accepted" as const,
    startDate: "2026-08-01",
    duration: "سنة",
    hostMessage: "تم قبول طلبك مبدئياً وتم إنشاء العقد للمراجعة. يمكنك التواصل معي لتأكيد موعد التسليم.",
  },
  {
    id: "tenant-req-3",
    propertyId: 9004,
    status: "rejected" as const,
    startDate: "2026-09-01",
    duration: "3 أشهر",
    hostMessage: "نعتذر عن قبول الطلب حالياً لأن العقار يحتاج لبعض التجهيزات قبل السكن.",
  },
];

function propertyFor(id: number) {
  return mockProperties.find((property) => property.id === id);
}

export function TenantRequestsPage() {
  const base = useTenantBasePath();
  return (
    <PublicShell>
      <div className="page-container grid gap-6">
        <PageHeading title="طلباتي" subtitle="متابعة طلبات الحجز ورسائل المضيف." />
        <div className="grid gap-4">
          {tenantRequests.map((request) => {
            const property = propertyFor(request.propertyId);
            return (
              <Card key={request.id}>
                <CardContent className="grid gap-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-extrabold">{property?.title ?? "عقار"}</h2>
                      <p className="font-semibold text-muted-foreground">{property ? propertyLocation(property) : ""}</p>
                    </div>
                    <RequestBadge status={request.status} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <MiniInfo label="تاريخ البداية" value={request.startDate} />
                    <MiniInfo label="المدة" value={request.duration} />
                  </div>
                  <div className="rounded-lg bg-accent p-4 text-sm font-semibold leading-7 text-muted-foreground">
                    {request.hostMessage}
                  </div>
                  {request.status === "accepted" && <Button asChild className="w-fit"><Link to={`${base}/contracts`}>عرض العقد</Link></Button>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PublicShell>
  );
}

export function TenantContractsPage() {
  const accepted = tenantRequests.filter((request) => request.status === "accepted");
  return (
    <PublicShell>
      <div className="page-container grid gap-6">
        <PageHeading title="عقودي" subtitle="العقود المرتبطة بطلباتك المقبولة." />
        {accepted.map((request) => {
          const property = propertyFor(request.propertyId);
          return (
            <Card key={request.id}>
              <CardHeader><CardTitle>عقد إيجار سكني</CardTitle></CardHeader>
              <CardContent className="grid gap-4">
                <InfoGrid
                  items={[
                    ["العقار", property?.title ?? "عقار"],
                    ["الموقع", property ? propertyLocation(property) || "غير محدد" : "غير محدد"],
                    ["القيمة الشهرية", `${formatCurrency(property?.price ?? 0)} د.ل`],
                    ["تاريخ البداية", request.startDate],
                    ["المدة", request.duration],
                    ["الحالة", "جاهز للمراجعة"],
                  ]}
                />
                <div className="rounded-lg bg-accent p-4 font-semibold text-muted-foreground">
                  هذا عقد تجريبي للمعاينة. النسخة النهائية تظهر بعد اعتماد بيانات الطرفين.
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PublicShell>
  );
}

export function TenantNotificationsPage() {
  const base = useTenantBasePath();
  const notifications = [
    { id: "n1", title: "تم استلام طلبك", body: "تم إرسال طلبك إلى المضيف وهو بانتظار المراجعة.", to: `${base}/requests` },
    { id: "n2", title: "تم قبول طلب حجز", body: "وافق المضيف على طلبك وتم تجهيز العقد للمراجعة.", to: `${base}/contracts` },
    { id: "n3", title: "رسالة من المضيف", body: "أرسل المضيف رسالة جديدة ضمن تفاصيل طلب الحجز.", to: `${base}/requests` },
  ];

  return (
    <PublicShell>
      <div className="page-container grid gap-6">
        <PageHeading title="اشعاراتي" subtitle="تنبيهات الطلبات والعقود ورسائل المضيف." />
        <div className="grid gap-3">
          {notifications.map((notification) => (
            <Card key={notification.id}>
              <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bell className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-extrabold">{notification.title}</h2>
                    <p className="font-semibold text-muted-foreground">{notification.body}</p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline"><Link to={notification.to}>عرض</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}

function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="text-3xl font-black text-foreground">{title}</h1>
      <p className="font-bold text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function RequestBadge({ status }: { status: "pending" | "accepted" | "rejected" }) {
  const variant = status === "accepted" ? "success" : status === "rejected" ? "destructive" : "warning";
  return <Badge variant={variant}>{bookingStatusLabels[status]}</Badge>;
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-sm font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 font-extrabold">{value}</p>
    </div>
  );
}

function InfoGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => <MiniInfo key={label} label={label} value={value} />)}
    </div>
  );
}

function useTenantBasePath() {
  const location = useLocation();
  return location.pathname.startsWith("/tenant-preview") ? "/tenant-preview" : "/tenant";
}
