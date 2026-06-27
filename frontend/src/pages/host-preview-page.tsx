import { Link, useNavigate } from "react-router-dom";
import { Bell, Calendar, Check, DollarSign, Eye, Home, MessageSquare, Plus, X } from "lucide-react";
import { useState } from "react";
import { PublicShell } from "@/components/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bookingStatusLabels } from "@/lib/labels";
import { getHostPreviewProperty, getHostPreviewRequests, setRequestStatus, tenantWhatsappLink } from "@/lib/host-preview-data";
import { formatCurrency } from "@/lib/utils";
import { mockProperties } from "@/lib/mock-data";
import { propertyImages, propertyLocation } from "@/lib/view-models";

export function HostPreviewPage() {
  const navigate = useNavigate();
  const [bookingRequests, setBookingRequests] = useState(getHostPreviewRequests());
  const totalEarnings = mockProperties.slice(0, 3).reduce((sum, property) => sum + Number(property.price), 0);
  const pendingRequests = bookingRequests.filter((request) => request.status === "pending");

  function acceptRequest(id: string) {
    setRequestStatus(id, "accepted");
    setBookingRequests(getHostPreviewRequests());
    navigate(`/host-preview/contracts/${id}`);
  }

  function rejectRequest(id: string) {
    setRequestStatus(id, "rejected");
    setBookingRequests(getHostPreviewRequests());
  }

  return (
    <PublicShell mode="host-preview">
      <div className="page-container grid gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-foreground">معاينة لوحة المضيف</h1>
            <p className="font-bold text-muted-foreground">عرض تجريبي بدون تسجيل دخول، باستخدام بيانات وهمية.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/become-host">الدخول كمضيف حقيقي</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PreviewStat label="إجمالي العقارات" value={mockProperties.length} icon={Home} />
          <PreviewStat label="حجوزات نشطة" value={3} icon={Calendar} />
          <PreviewStat label="إجمالي الدخل" value={`${formatCurrency(totalEarnings)} د.ل`} icon={DollarSign} />
          <PreviewStat label="طلبات بانتظار الرد" value={pendingRequests.length} icon={Bell} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>إدارة الإعلانات</CardTitle>
              <Button asChild>
                <Link to="/host-preview/properties/new">
                  <Plus className="h-4 w-4" />
                  إضافة عقار
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="properties">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="properties">عقاراتي</TabsTrigger>
                <TabsTrigger value="requests">
                  طلبات الحجز
                  <Badge className="mr-2 bg-primary">{pendingRequests.length}</Badge>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="properties" className="grid gap-4">
                {mockProperties.slice(0, 3).map((property) => (
                  <Card key={property.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 md:flex-row">
                        <img src={propertyImages(property)[0]} alt={property.title} className="h-32 w-full rounded-lg object-cover md:w-36" />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-extrabold">{property.title}</h3>
                              <p className="font-semibold text-muted-foreground">{propertyLocation(property)}</p>
                            </div>
                            <Badge variant="success">نشط</Badge>
                          </div>
                          <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <MiniMetric label="السعر" value={`${formatCurrency(property.price)} د.ل`} icon={DollarSign} />
                            <MiniMetric label="المشاهدات" value={String(120 + property.id % 100)} icon={Eye} />
                            <MiniMetric label="الحجوزات" value={String(1 + property.id % 4)} icon={Calendar} />
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button asChild size="sm" variant="outline"><Link to={`/host-preview/properties/${property.id}/edit`}>تعديل</Link></Button>
                            <Button asChild size="sm" variant="outline"><Link to={`/host-preview/properties/${property.id}`}>عرض</Link></Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="requests" className="grid gap-4">
                {bookingRequests.map((request) => {
                  const property = getHostPreviewProperty(request.propertyId);
                  return (
                    <Card key={request.id} className="border">
                      <CardContent className="grid gap-3 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <Link className="font-extrabold text-primary hover:underline" to={`/host-preview/requests/${request.id}`}>
                              {property?.title ?? "عقار"}
                            </Link>
                            <p className="font-semibold text-muted-foreground">طلب من: {request.tenantName}</p>
                          </div>
                          <Badge variant={request.status === "accepted" ? "success" : request.status === "rejected" ? "destructive" : "warning"}>
                            {bookingStatusLabels[request.status]}
                          </Badge>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <MiniText label="تاريخ البداية" value={request.startDate} />
                          <MiniText label="المدة" value={request.duration} />
                        </div>
                        <div className="rounded-lg bg-accent p-3 text-sm font-semibold text-muted-foreground">{request.message}</div>
                        <div className="flex flex-wrap gap-2">
                          {request.status === "pending" && <Button size="sm" onClick={() => acceptRequest(request.id)}><Check className="h-4 w-4" />قبول</Button>}
                          {request.status === "pending" && <Button size="sm" variant="outline" onClick={() => rejectRequest(request.id)}><X className="h-4 w-4" />رفض</Button>}
                          {request.status === "accepted" && <Button asChild size="sm"><Link to={`/host-preview/contracts/${request.id}`}>عرض العقد</Link></Button>}
                          {request.status === "accepted" ? (
                            <Button asChild size="sm" variant="outline">
                              <a href={tenantWhatsappLink(request.tenantPhone, request.tenantName)} target="_blank" rel="noreferrer">
                                <MessageSquare className="h-4 w-4" />
                                تواصل واتساب
                              </a>
                            </Button>
                          ) : (
                            <Button asChild size="sm" variant="outline"><Link to={`/host-preview/requests/${request.id}`}><MessageSquare className="h-4 w-4" />ارسل رسالة</Link></Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}

function PreviewStat({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Home }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="font-bold text-muted-foreground">{label}</p>
          <p className="text-3xl font-black text-primary">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-primary/35" />
      </CardContent>
    </Card>
  );
}

function MiniMetric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof DollarSign }) {
  return (
    <div>
      <p className="text-sm font-bold text-muted-foreground">{label}</p>
      <p className="flex items-center gap-1 font-extrabold text-foreground"><Icon className="h-4 w-4" />{value}</p>
    </div>
  );
}

function MiniText({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold text-muted-foreground">{label}</p>
      <p className="font-extrabold text-foreground">{value}</p>
    </div>
  );
}
