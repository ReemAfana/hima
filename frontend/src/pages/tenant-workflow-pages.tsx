import { Link, useLocation, useParams } from "react-router-dom";
import { Bell, Download, X } from "lucide-react";
import { useState } from "react";
import { PublicShell } from "@/components/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { badgeVariant, bookingStatusLabels } from "@/lib/labels";
import { mockProperties } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { propertyLocation } from "@/lib/view-models";
import type { BookingStatus } from "@/types/api";

type TenantPreviewRequest = {
  id: string;
  propertyId: number;
  status: BookingStatus;
  startDate: string;
  duration: string;
  hostMessage: string;
};

const tenantRequestStatusKey = "hima-tenant-preview-request-status";

const tenantRequests: TenantPreviewRequest[] = [
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

function getTenantRequestStatuses() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(tenantRequestStatusKey) ?? "{}") as Record<string, BookingStatus>;
  } catch {
    return {};
  }
}

function setTenantRequestStatus(id: string, status: BookingStatus) {
  const statuses = getTenantRequestStatuses();
  statuses[id] = status;
  window.localStorage.setItem(tenantRequestStatusKey, JSON.stringify(statuses));
}

function getTenantRequests() {
  const statuses = getTenantRequestStatuses();
  return tenantRequests.map((request) => ({ ...request, status: statuses[request.id] ?? request.status }));
}

export function TenantRequestsPage() {
  const base = useTenantBasePath();
  const [requests, setRequests] = useState(getTenantRequests());

  function cancelRequest(id: string) {
    setTenantRequestStatus(id, "cancelled");
    setRequests(getTenantRequests());
  }

  return (
    <PublicShell>
      <div className="page-container grid gap-6">
        <PageHeading title="طلباتي" subtitle="متابعة طلبات الحجز ورسائل المضيف." />
        <div className="grid gap-4">
          {requests.map((request) => {
            const property = propertyFor(request.propertyId);
            return (
              <Card key={request.id}>
                <CardContent className="grid gap-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link className="text-xl font-extrabold text-primary hover:underline" to={`${base}/requests/${request.id}`}>
                        {property?.title ?? "عقار"}
                      </Link>
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
                  <div className="flex flex-wrap gap-2">
                    {request.status === "pending" && (
                      <Button size="sm" variant="destructive" onClick={() => cancelRequest(request.id)}>
                        <X className="h-4 w-4" />
                        إلغاء الطلب
                      </Button>
                    )}
                    {request.status === "accepted" && <Button asChild className="w-fit"><Link to={`${base}/contracts`}>عرض العقد</Link></Button>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PublicShell>
  );
}

export function TenantRequestDetailsPage() {
  const { id } = useParams();
  const base = useTenantBasePath();
  const [requests, setRequests] = useState(getTenantRequests());
  const request = requests.find((item) => item.id === id);
  const property = request ? propertyFor(request.propertyId) : undefined;

  function cancelRequest() {
    if (!request || request.status !== "pending") return;
    setTenantRequestStatus(request.id, "cancelled");
    setRequests(getTenantRequests());
  }

  if (!request) {
    return (
      <PublicShell>
        <div className="page-container grid gap-4">
          <PageHeading title="تفاصيل الطلب" subtitle="تعذر العثور على الطلب المحدد." />
          <Button asChild className="w-fit"><Link to={`${base}/requests`}>العودة إلى طلباتي</Link></Button>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div className="page-container grid gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageHeading title="تفاصيل الطلب" subtitle="عرض الطلب المحدد فقط ورسالة المضيف المرتبطة به." />
          <Button asChild variant="outline"><Link to={`${base}/requests`}>طلباتي</Link></Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>{property?.title ?? "عقار"}</CardTitle>
                <p className="mt-1 font-semibold text-muted-foreground">{property ? propertyLocation(property) : ""}</p>
              </div>
              <RequestBadge status={request.status} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <InfoGrid
              items={[
                ["رقم الطلب", request.id],
                ["تاريخ البداية", request.startDate],
                ["المدة", request.duration],
                ["الحالة", bookingStatusLabels[request.status]],
              ]}
            />
            <div className="rounded-lg bg-accent p-4 text-sm font-semibold leading-7 text-muted-foreground">
              <p className="mb-2 font-extrabold text-foreground">رسالة المضيف</p>
              {request.hostMessage}
            </div>
            <div className="flex flex-wrap gap-2">
              {request.status === "pending" && (
                <Button variant="destructive" onClick={cancelRequest}>
                  <X className="h-4 w-4" />
                  إلغاء الطلب
                </Button>
              )}
              {request.status === "accepted" && <Button asChild><Link to={`${base}/contracts`}>عرض العقد</Link></Button>}
              <Button asChild variant="outline"><Link to={`${base}/properties/${request.propertyId}`}>عرض العقار</Link></Button>
            </div>
            {request.status === "accepted" && (
              <p className="text-sm font-bold text-muted-foreground">لا يمكن إلغاء الطلب بعد قبول المضيف.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}

export function TenantContractsPage() {
  const accepted = getTenantRequests().filter((request) => request.status === "accepted");
  const base = useTenantBasePath();
  const issuedAt = "2026-06-23";
  return (
    <PublicShell>
      <div className="page-container grid gap-6 contract-print-area">
        <div className="contract-actions flex flex-wrap items-center justify-between gap-3">
          <PageHeading title="عقودي" subtitle="العقود المرتبطة بطلباتك المقبولة." />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => window.print()}><Download className="h-4 w-4" />تحميل PDF</Button>
            <Button asChild variant="outline"><Link to={`${base}/requests`}>طلباتي</Link></Button>
          </div>
        </div>
        {accepted.map((request) => {
          const property = propertyFor(request.propertyId);
          const hostName = property?.host ? `${property.host.first_name} ${property.host.last_name ?? ""}`.trim() : "مضيف حِمى";
          return (
            <article key={request.id} className="contract-document rounded-lg border bg-white p-8 text-black shadow-lg">
              <header className="border-b-2 border-black pb-5 text-center">
                <div className="text-sm font-bold">منصة حِمى لإدارة عقود السكن</div>
                <h2 className="mt-3 text-3xl font-black">عقد إيجار سكني</h2>
                <div className="mt-3 grid gap-2 text-sm font-bold sm:grid-cols-3">
                  <span>رقم العقد: HIMA-{request.id.toUpperCase()}</span>
                  <span>تاريخ الإصدار: {issuedAt}</span>
                  <span>الحالة: مقبول وجاهز للمراجعة</span>
                </div>
              </header>

              <section className="mt-6 leading-8">
                <p>
                  إنه في يوم {issuedAt}، تم تحرير هذا العقد بين الطرفين الموضحة بياناتهما أدناه، وذلك لتنظيم العلاقة الإيجارية الخاصة بالعقار المذكور في هذا العقد وفق البنود والشروط التالية.
                </p>
              </section>

              <FormalSection title="أولاً: بيانات الأطراف">
                <FormalTable
                  rows={[
                    ["الطرف الأول - المضيف", hostName],
                    ["الطرف الثاني - المستأجر", "مستأجر حِمى التجريبي"],
                    ["رقم هوية المستأجر", "404567890"],
                    ["هاتف المستأجر", "+970599777888"],
                  ]}
                />
              </FormalSection>

              <FormalSection title="ثانياً: بيانات العقار">
                <FormalTable
                  rows={[
                    ["اسم العقار", property?.title ?? "عقار"],
                    ["العنوان", property ? propertyLocation(property) || "غير محدد" : "غير محدد"],
                    ["نوع العقار", property?.type ?? "-"],
                    ["عدد الغرف", String(property?.rooms ?? "-")],
                    ["المساحة", property?.area_m2 ? `${property.area_m2} م²` : "-"],
                    ["حالة العقار", property?.damage_status ?? "-"],
                  ]}
                />
              </FormalSection>

              <FormalSection title="ثالثاً: مدة العقد والقيمة الإيجارية">
                <FormalTable
                  rows={[
                    ["تاريخ بداية العقد", request.startDate],
                    ["مدة الإيجار", request.duration],
                    ["القيمة الشهرية", `${formatCurrency(property?.price ?? 0)} د.ل`],
                    ["طريقة الدفع", "شهرياً، ما لم يتفق الطرفان كتابياً على غير ذلك"],
                  ]}
                />
              </FormalSection>

              <FormalSection title="رابعاً: الالتزامات والشروط">
                <ol className="grid list-decimal gap-2 pr-5 leading-8">
                  <li>يلتزم المضيف بتسليم العقار بالحالة الموضحة في بيانات وصور منصة حِمى عند بداية العقد.</li>
                  <li>يلتزم المستأجر باستخدام العقار لغرض السكن فقط، والمحافظة عليه وعدم إجراء تغييرات جوهرية دون موافقة كتابية من المضيف.</li>
                  <li>تتم معاينة حالة العقار وتوثيق أي ملاحظات أو أضرار قبل التسليم، ويعد هذا التوثيق مرجعاً عند انتهاء العقد.</li>
                  <li>يلتزم المستأجر بسداد القيمة الإيجارية في المواعيد المتفق عليها، ويتحمل أي رسوم خدمات يتفق عليها الطرفان كتابياً.</li>
                  <li>في حال وجود صيانة طارئة، يلتزم الطرف المتضرر بإبلاغ الطرف الآخر فوراً وتوثيق الحالة داخل المنصة أو عبر وسيلة التواصل المعتمدة.</li>
                  <li>لا يجوز إنهاء العقد قبل مدته إلا باتفاق الطرفين أو وفق سبب مشروع يتم توثيقه كتابياً.</li>
                </ol>
              </FormalSection>

              <footer className="mt-8 border-t pt-4 text-center text-xs font-semibold text-neutral-600">
                تم إنشاء هذا العقد تجريبياً عبر منصة حِمى. يعتمد العقد النهائي على تحقق بيانات الطرفين ومراجعة الشروط القانونية المعمول بها.
              </footer>
            </article>
          );
        })}
      </div>
    </PublicShell>
  );
}

export function TenantNotificationsPage() {
  const base = useTenantBasePath();
  const notifications = [
    { id: "n1", title: "تم استلام طلبك", body: "تم إرسال طلبك إلى المضيف وهو بانتظار المراجعة.", to: `${base}/requests/tenant-req-1` },
    { id: "n2", title: "تم قبول طلب حجز", body: "وافق المضيف على طلبك وتم تجهيز العقد للمراجعة.", to: `${base}/requests/tenant-req-2` },
    { id: "n3", title: "رسالة من المضيف", body: "أرسل المضيف رسالة جديدة ضمن تفاصيل طلب الحجز.", to: `${base}/requests/tenant-req-3` },
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

function RequestBadge({ status }: { status: BookingStatus }) {
  return <Badge variant={badgeVariant(status)}>{bookingStatusLabels[status]}</Badge>;
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

function FormalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 break-inside-avoid">
      <h3 className="mb-3 border-b border-neutral-300 pb-2 text-lg font-black">{title}</h3>
      <div>{children}</div>
    </section>
  );
}

function FormalTable({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="overflow-hidden border border-neutral-800">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[160px_1fr] border-b border-neutral-300 last:border-b-0">
          <div className="bg-neutral-100 p-3 font-extrabold">{label}</div>
          <div className="p-3 font-semibold">{value}</div>
        </div>
      ))}
    </div>
  );
}

function useTenantBasePath() {
  const location = useLocation();
  return location.pathname.startsWith("/tenant-preview") ? "/tenant-preview" : "/tenant";
}
