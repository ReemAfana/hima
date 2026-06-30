import { Link } from "react-router-dom";
import { Bell, Building2, CalendarDays, Check, ClipboardList, FileSignature, Home, Mail, Phone, Plus, ShieldCheck, User } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getContracts, getHostPreviewNotifications, getHostPreviewRequests } from "@/lib/host-preview-data";
import { mockProperties } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { propertyLocation } from "@/lib/view-models";

export function HostPreviewDashboardPage() {
  const requests = getHostPreviewRequests();
  const pendingRequests = requests.filter((request) => request.status === "pending").length;

  return (
    <PublicShell mode="host-preview">
      <ProfileDashboard
        title="لوحة المضيف"
        subtitle="البيانات الشخصية وحالة حساب المضيف التجريبي."
        name="مضيف حِمى التجريبي"
        role="صاحب عقار"
        email="host.preview@hima.local"
        phone="+970599000000"
        nationalId="400123456"
        city="غزة"
        verification="تم التحقق من الهوية"
        stats={[
          ["عقاراتي", String(mockProperties.length)],
          ["طلبات بانتظار الرد", String(pendingRequests)],
          ["عقودي", String(getContracts().length)],
          ["الإشعارات", String(getHostPreviewNotifications().length)],
        ]}
        actions={[
          { label: "عقاراتي", to: "/host-preview", icon: Home },
          { label: "طلبات الحجز", to: "/host-preview/requests", icon: ClipboardList },
          { label: "عقودي", to: "/host-preview/contracts", icon: FileSignature },
          { label: "إضافة عقار", to: "/host-preview/properties/new", icon: Plus },
        ]}
        mode="host"
      />
    </PublicShell>
  );
}

export function TenantPreviewDashboardPage() {
  return (
    <PublicShell mode="tenant-preview">
      <ProfileDashboard
        title="لوحة المستأجر"
        subtitle="البيانات الشخصية وحالة حساب المستأجر التجريبي."
        name="مستأجر حِمى التجريبي"
        role="مستأجر"
        email="tenant.preview@hima.local"
        phone="+970599777888"
        nationalId="404567890"
        city="غزة"
        verification="تم التحقق من الهوية"
        stats={[
          ["طلباتي", "3"],
          ["طلبات مقبولة", "1"],
          ["عقودي", "1"],
          ["اشعاراتي", "3"],
        ]}
        actions={[
          { label: "تصفح العقارات", to: "/tenant-preview", icon: Home },
          { label: "طلباتي", to: "/tenant-preview/requests", icon: ClipboardList },
          { label: "عقودي", to: "/tenant-preview/contracts", icon: FileSignature },
          { label: "اشعاراتي", to: "/tenant-preview/notifications", icon: Bell },
        ]}
        mode="tenant"
      />
    </PublicShell>
  );
}

export function AdminPreviewDashboardPage() {
  const pendingProperties = mockProperties.slice(0, 3);
  const bookingRequests = getHostPreviewRequests();

  return (
    <PublicShell>
      <div className="page-container grid gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground">لوحة المشرف</h1>
          <p className="font-bold text-muted-foreground">معاينة لإدارة المنصة ومراجعة العقارات وطلبات الحجز.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <AdminStat label="إجمالي العقارات" value={String(mockProperties.length)} icon={Building2} />
          <AdminStat label="بانتظار المراجعة" value={String(pendingProperties.length)} icon={ClipboardList} />
          <AdminStat label="طلبات الحجز" value={String(bookingRequests.length)} icon={CalendarDays} />
          <AdminStat label="عقود نشطة" value={String(getContracts().length)} icon={FileSignature} />
          <AdminStat label="إشعارات جديدة" value={String(getHostPreviewNotifications().length)} icon={Bell} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>عقارات بانتظار المراجعة</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {pendingProperties.map((property) => (
                <div key={property.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-extrabold">{property.title}</h2>
                    <p className="text-sm font-bold text-muted-foreground">{propertyLocation(property) || "الموقع غير محدد"}</p>
                    <p className="mt-1 text-sm font-bold text-muted-foreground">{formatCurrency(property.price)} د.ل</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm"><Check className="h-4 w-4" />قبول</Button>
                    <Button size="sm" variant="outline">مراجعة</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>آخر طلبات الحجز</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {bookingRequests.slice(0, 5).map((request) => {
                const property = mockProperties.find((item) => item.id === request.propertyId);
                return (
                  <div key={request.id} className="rounded-lg border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h2 className="font-extrabold">{property?.title ?? "عقار"}</h2>
                        <p className="text-sm font-bold text-muted-foreground">المستأجر: {request.tenantName}</p>
                      </div>
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-primary">{request.status}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-muted-foreground">{request.startDate} - {request.duration}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicShell>
  );
}

type DashboardAction = {
  label: string;
  to: string;
  icon: typeof Home;
};

function ProfileDashboard({
  title,
  subtitle,
  name,
  role,
  email,
  phone,
  nationalId,
  city,
  verification,
  stats,
  actions,
  mode,
}: {
  title: string;
  subtitle: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  nationalId: string;
  city: string;
  verification: string;
  stats: Array<[string, string]>;
  actions: DashboardAction[];
  mode: "host" | "tenant";
}) {
  const Icon = mode === "host" ? Building2 : User;

  return (
    <div className="page-container grid gap-6">
      <div>
        <h1 className="text-3xl font-black text-foreground">{title}</h1>
        <p className="font-bold text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>البيانات الشخصية</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="h-10 w-10" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-black">{name}</h2>
                  <Badge variant="success">{verification}</Badge>
                </div>
                <p className="mt-1 font-extrabold text-primary">{role}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <InfoItem icon={Mail} label="البريد الإلكتروني" value={email} />
              <InfoItem icon={Phone} label="رقم الهاتف" value={phone} />
              <InfoItem icon={ShieldCheck} label="رقم الهوية" value={nationalId} />
              <InfoItem icon={Home} label="المدينة" value={city} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ملخص الحساب</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-lg border bg-accent p-4">
                <p className="text-sm font-bold text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-black">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إجراءات الحساب</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map(({ label, to, icon: ActionIcon }) => (
            <Button key={to} asChild variant="outline" className="justify-start">
              <Link to={to}>
                <ActionIcon className="h-4 w-4" />
                {label}
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-bold text-muted-foreground">{label}</p>
        <p className="font-extrabold">{value}</p>
      </div>
    </div>
  );
}

function AdminStat({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-muted-foreground">{label}</p>
          <p className="text-2xl font-black">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
