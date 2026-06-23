import { Link, useNavigate, useParams } from "react-router-dom";
import { Bell, Check, Download, FileSignature, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { PublicShell } from "@/components/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bookingStatusLabels } from "@/lib/labels";
import {
  getContracts,
  getHostPreviewNotifications,
  getHostPreviewProperty,
  getHostPreviewRequest,
  getHostPreviewRequests,
  getSentHostMessage,
  setRequestStatus,
  tenantWhatsappLink,
  type HostPreviewRequest,
} from "@/lib/host-preview-data";
import { formatCurrency } from "@/lib/utils";
import { propertyLocation } from "@/lib/view-models";

export function HostPreviewRequestsPage() {
  const [requests, setRequests] = useState(getHostPreviewRequests());

  function reject(id: string) {
    setRequestStatus(id, "rejected");
    setRequests(getHostPreviewRequests());
  }

  return (
    <PublicShell mode="host-preview">
      <div className="page-container grid gap-6">
        <PageHeading title="طلباتي" subtitle="كل طلبات الحجز الواردة على عقاراتك التجريبية." />
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العقار</TableHead>
                  <TableHead>المستأجر</TableHead>
                  <TableHead>المدة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => {
                  const property = getHostPreviewProperty(request.propertyId);
                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        <Link className="font-extrabold text-primary hover:underline" to={`/host-preview/requests/${request.id}`}>
                          {property?.title ?? "عقار"}
                        </Link>
                      </TableCell>
                      <TableCell>{request.tenantName}</TableCell>
                      <TableCell>{request.duration}</TableCell>
                      <TableCell><RequestBadge status={request.status} /></TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button asChild size="sm" variant="outline"><Link to={`/host-preview/requests/${request.id}`}>عرض الطلب</Link></Button>
                          {request.status === "pending" && <Button size="sm" variant="outline" onClick={() => reject(request.id)}><X className="h-4 w-4" />رفض</Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}

export function HostPreviewRequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(() => getHostPreviewRequest(id));
  const property = request ? getHostPreviewProperty(request.propertyId) : null;

  function accept() {
    if (!request) return;
    setRequestStatus(request.id, "accepted");
    setRequest(getHostPreviewRequest(request.id));
    navigate(`/host-preview/contracts/${request.id}`);
  }

  function reject() {
    if (!request) return;
    setRequestStatus(request.id, "rejected");
    setRequest(getHostPreviewRequest(request.id));
  }

  if (!request || !property) {
    return <PublicShell mode="host-preview"><div className="page-container">تعذر تحميل الطلب</div></PublicShell>;
  }

  return (
    <PublicShell mode="host-preview">
      <div className="page-container grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-6">
          <PageHeading title="تفاصيل الطلب" subtitle="راجع بيانات المستأجر والعقار قبل القبول أو الرفض." />
          <Card>
            <CardHeader><CardTitle>{property.title}</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              <InfoGrid
                items={[
                  ["الموقع", propertyLocation(property) || "غير محدد"],
                  ["السعر الشهري", `${formatCurrency(property.price)} د.ل`],
                  ["تاريخ البداية", request.startDate],
                  ["تاريخ النهاية", request.endDate],
                  ["المدة", request.duration],
                  ["الحالة", bookingStatusLabels[request.status]],
                ]}
              />
              <div className="rounded-lg bg-accent p-4 font-semibold text-muted-foreground">{request.message}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>بيانات المستأجر</CardTitle></CardHeader>
            <CardContent>
              <InfoGrid
                items={[
                  ["الاسم", request.tenantName],
                  ["رقم الهوية", request.tenantNationalId],
                  ["رقم الهاتف", `+${request.tenantPhone}`],
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>الرسالة المرسلة للمستأجر</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-lg bg-accent p-4 text-sm font-semibold leading-7 text-muted-foreground">
                {getSentHostMessage(request)}
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
          <Card>
            <CardContent className="grid gap-3 p-6">
              <RequestBadge status={request.status} />
              {request.status === "pending" && <Button onClick={accept}><Check className="h-4 w-4" />قبول وإنشاء عقد</Button>}
              {request.status === "pending" && <Button variant="outline" onClick={reject}><X className="h-4 w-4" />رفض الطلب</Button>}
              {request.status === "accepted" && <Button asChild><Link to={`/host-preview/contracts/${request.id}`}><FileSignature className="h-4 w-4" />عرض العقد</Link></Button>}
              <Button asChild variant="outline">
                <a href={tenantWhatsappLink(request.tenantPhone, request.tenantName)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  تواصل مع المستأجر
                </a>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </PublicShell>
  );
}

export function HostPreviewNotificationsPage() {
  const notifications = getHostPreviewNotifications();
  return (
    <PublicShell mode="host-preview">
      <div className="page-container grid gap-6">
        <PageHeading title="الإشعارات" subtitle="تنبيهات قبول العقارات وطلبات الحجز الجديدة." />
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
                    <p className="mt-1 text-xs font-bold text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline"><Link to={notification.to}>عرض التفاصيل</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}

export function HostPreviewContractsPage() {
  const contracts = getContracts();
  return (
    <PublicShell mode="host-preview">
      <div className="page-container grid gap-6">
        <PageHeading title="عقودي" subtitle="العقود الناتجة عن الطلبات المقبولة." />
        <div className="grid gap-4">
          {contracts.map((contract) => {
            const property = getHostPreviewProperty(contract.propertyId);
            return (
              <Card key={contract.id}>
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold">{property?.title ?? "عقار"}</h2>
                    <p className="font-semibold text-muted-foreground">بين المضيف ومقدم الطلب: {contract.tenantName}</p>
                    <p className="text-sm font-bold text-muted-foreground">{contract.startDate} إلى {contract.endDate}</p>
                  </div>
                  <Button asChild><Link to={`/host-preview/contracts/${contract.id}`}>عرض تفاصيل العقد</Link></Button>
                </CardContent>
              </Card>
            );
          })}
          {!contracts.length && (
            <Card>
              <CardContent className="grid gap-3 p-8 text-center">
                <FileSignature className="mx-auto h-10 w-10 text-primary/50" />
                <p className="font-extrabold">لا توجد عقود بعد</p>
                <Button asChild variant="outline"><Link to="/host-preview/requests">اذهب إلى طلباتي لقبول طلب</Link></Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PublicShell>
  );
}

export function HostPreviewContractDetailsPage() {
  const { id } = useParams();
  const request = getHostPreviewRequest(id);
  const property = request ? getHostPreviewProperty(request.propertyId) : null;
  const hostName = property?.host ? `${property.host.first_name} ${property.host.last_name ?? ""}`.trim() : "مضيف حِمى";
  const contractNumber = request ? `HIMA-${request.id.toUpperCase()}` : "";
  const issuedAt = "2026-06-23";

  if (!request || !property || request.status !== "accepted") {
    return (
      <PublicShell mode="host-preview">
        <div className="page-container grid gap-4">
          <PageHeading title="العقد غير جاهز" subtitle="يظهر العقد بعد قبول طلب الحجز." />
          <Button asChild className="w-fit"><Link to="/host-preview/requests">العودة إلى الطلبات</Link></Button>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell mode="host-preview">
      <div className="page-container max-w-5xl contract-print-area">
        <div className="contract-actions mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-foreground">معاينة عقد PDF</h1>
            <p className="font-semibold text-muted-foreground">اضغط تحميل PDF ثم اختر Save as PDF من نافذة الطباعة.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => window.print()}><Download className="h-4 w-4" />تحميل PDF</Button>
            <Button asChild variant="outline"><Link to="/host-preview/contracts">كل العقود</Link></Button>
          </div>
        </div>

        <article className="contract-document rounded-lg border bg-white p-8 text-black shadow-lg">
          <header className="border-b-2 border-black pb-5 text-center">
            <div className="text-sm font-bold">منصة حِمى لإدارة عقود السكن</div>
            <h2 className="mt-3 text-3xl font-black">عقد إيجار سكني</h2>
            <div className="mt-3 grid gap-2 text-sm font-bold sm:grid-cols-3">
              <span>رقم العقد: {contractNumber}</span>
              <span>تاريخ الإصدار: {issuedAt}</span>
              <span>الحالة: مقبول وجاهز للتوقيع</span>
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
                ["الطرف الثاني - المستأجر", request.tenantName],
                ["رقم هوية المستأجر", request.tenantNationalId],
                ["هاتف المستأجر", `+${request.tenantPhone}`],
              ]}
            />
          </FormalSection>

          <FormalSection title="ثانياً: بيانات العقار">
            <FormalTable
              rows={[
                ["اسم العقار", property.title],
                ["العنوان", propertyLocation(property) || "غير محدد"],
                ["نوع العقار", property.type],
                ["عدد الغرف", String(property.rooms ?? "-")],
                ["المساحة", property.area_m2 ? `${property.area_m2} م²` : "-"],
                ["حالة العقار", property.damage_status],
              ]}
            />
          </FormalSection>

          <FormalSection title="ثالثاً: مدة العقد والقيمة الإيجارية">
            <FormalTable
              rows={[
                ["تاريخ بداية العقد", request.startDate],
                ["تاريخ نهاية العقد", request.endDate],
                ["مدة الإيجار", request.duration],
                ["القيمة الشهرية", `${formatCurrency(property.price)} د.ل`],
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

        <div className="contract-actions mt-4 flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href={tenantWhatsappLink(request.tenantPhone, request.tenantName)} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              تواصل مع المستأجر
            </a>
          </Button>
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

function RequestBadge({ status }: { status: HostPreviewRequest["status"] }) {
  const variant = status === "accepted" ? "success" : status === "rejected" ? "destructive" : "warning";
  return <Badge variant={variant}>{bookingStatusLabels[status]}</Badge>;
}

function InfoGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-lg border bg-card p-4">
          <p className="text-sm font-bold text-muted-foreground">{label}</p>
          <p className="mt-1 font-extrabold">{value}</p>
        </div>
      ))}
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
