import { Link } from "react-router-dom";
import { Bell, Calendar, DollarSign, Eye, Home, MessageSquare, Plus } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { mockProperties } from "@/lib/mock-data";
import { propertyImages, propertyLocation } from "@/lib/view-models";

const bookingRequests = [
  {
    id: "demo-1",
    propertyTitle: "شقة عائلية حديثة في الرمال",
    tenantName: "سارة محمد",
    startDate: "2026-07-01",
    duration: "6 أشهر",
    message: "أنا مهتمة باستئجار الشقة لعائلة من 4 أفراد، هل يمكننا مناقشة الشروط؟",
  },
  {
    id: "demo-2",
    propertyTitle: "منزل مريح من غرفتين في تل الهوى",
    tenantName: "خالد عمر",
    startDate: "2026-07-15",
    duration: "3 أشهر",
    message: "أبحث عن سكن مؤقت وقريب من الخدمات. هل العقار متاح للمعاينة؟",
  },
];

export function HostPreviewPage() {
  const totalEarnings = mockProperties.slice(0, 3).reduce((sum, property) => sum + Number(property.price), 0);

  return (
    <PublicShell>
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
          <PreviewStat label="طلبات بانتظار الرد" value={bookingRequests.length} icon={Bell} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>إدارة الإعلانات</CardTitle>
              <Button disabled>
                <Plus className="h-4 w-4" />
                إضافة عقار
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="properties">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="properties">عقاراتي</TabsTrigger>
                <TabsTrigger value="requests">
                  طلبات الحجز
                  <Badge className="mr-2 bg-primary">{bookingRequests.length}</Badge>
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
                            <Button size="sm" variant="outline" disabled>تعديل</Button>
                            <Button asChild size="sm" variant="outline"><Link to={`/properties/${property.id}`}>عرض</Link></Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="requests" className="grid gap-4">
                {bookingRequests.map((request) => (
                  <Card key={request.id} className="border">
                    <CardContent className="grid gap-3 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-extrabold">{request.propertyTitle}</h3>
                          <p className="font-semibold text-muted-foreground">طلب من: {request.tenantName}</p>
                        </div>
                        <Badge variant="warning">بانتظار الرد</Badge>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <MiniText label="تاريخ البداية" value={request.startDate} />
                        <MiniText label="المدة" value={request.duration} />
                      </div>
                      <div className="rounded-lg bg-accent p-3 text-sm font-semibold text-muted-foreground">{request.message}</div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" disabled>قبول</Button>
                        <Button size="sm" variant="outline" disabled>رفض</Button>
                        <Button asChild size="sm" variant="outline"><Link to="/messages"><MessageSquare className="h-4 w-4" />رسالة</Link></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
