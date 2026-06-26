import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Building2, CalendarDays, Check, ClipboardList, DollarSign, Eye, FileText, Heart, MessageSquare, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/api/admin";
import { hostApi } from "@/api/host";
import { sharedApi } from "@/api/shared";
import { tenantApi } from "@/api/tenant";
import { EmptyState } from "@/components/empty-state";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bookingStatusLabels, statusLabels } from "@/lib/labels";
import { fullName, formatCurrency } from "@/lib/utils";
import { bookingDuration, propertyImages, propertyLocation } from "@/lib/view-models";
import { useAuthStore } from "@/stores/auth-store";
import type { Booking, Property } from "@/types/api";

export function TenantDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const bookings = useQuery({ queryKey: ["tenant", "bookings"], queryFn: tenantApi.bookings });
  const contracts = useQuery({ queryKey: ["contracts"], queryFn: sharedApi.contracts });
  const favorites = useQuery({ queryKey: ["tenant", "favorites"], queryFn: tenantApi.favorites });
  const unread = useQuery({ queryKey: ["notifications", "unread"], queryFn: sharedApi.unreadCount });

  return (
    <DashboardPage title={`أهلاً، ${fullName(user)}`} subtitle="تابع حجوزاتك والعقارات التي تهمك.">
      <div className="dashboard-grid">
        <StatCard label="حجوزاتي" value={bookings.data?.length ?? 0} icon={CalendarDays} />
        <StatCard label="العقود" value={contracts.data?.length ?? 0} icon={FileText} />
        <StatCard label="المفضلة" value={favorites.data?.length ?? 0} icon={Heart} />
        <StatCard label="إشعارات جديدة" value={unread.data?.count ?? unread.data?.unread_count ?? 0} icon={Bell} />
      </div>
      <Card>
        <CardHeader><CardTitle>آخر الحجوزات</CardTitle></CardHeader>
        <CardContent>
          <BookingsTable bookings={bookings.data?.slice(0, 6) ?? []} />
        </CardContent>
      </Card>
      <div className="flex">
        <Button asChild><Link to="/properties">استكشف العقارات</Link></Button>
      </div>
    </DashboardPage>
  );
}

export function HostDashboardPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const properties = useQuery({ queryKey: ["host", "properties"], queryFn: hostApi.properties });
  const bookings = useQuery({ queryKey: ["host", "bookings"], queryFn: hostApi.bookings });
  const contracts = useQuery({ queryKey: ["contracts"], queryFn: sharedApi.contracts });
  const unread = useQuery({ queryKey: ["notifications", "unread"], queryFn: sharedApi.unreadCount });
  const accept = useMutation({
    mutationFn: hostApi.acceptBooking,
    onSuccess: () => { toast.success("تم قبول الحجز"); queryClient.invalidateQueries({ queryKey: ["host", "bookings"] }); },
  });
  const reject = useMutation({
    mutationFn: hostApi.rejectBooking,
    onSuccess: () => { toast.success("تم رفض الحجز"); queryClient.invalidateQueries({ queryKey: ["host", "bookings"] }); },
  });

  const pendingProperties = properties.data?.filter((item) => item.status === "pending").length ?? 0;
  const pendingBookings = bookings.data?.filter((item) => item.status === "pending") ?? [];

  return (
    <DashboardPage title={`أهلاً، ${fullName(user)}`} subtitle="إدارة العقارات وطلبات الحجز.">
      <div className="dashboard-grid">
        <StatCard label="عقاراتي" value={properties.data?.length ?? 0} icon={Building2} />
        <StatCard label="بانتظار الموافقة" value={pendingProperties} icon={ClipboardList} />
        <StatCard label="طلبات حجز جديدة" value={pendingBookings.length} icon={CalendarDays} />
        <StatCard label="عقود نشطة" value={contracts.data?.length ?? 0} icon={FileText} />
        <StatCard label="إشعارات جديدة" value={unread.data?.count ?? unread.data?.unread_count ?? 0} icon={Bell} />
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>إدارة الإعلانات</CardTitle>
            <Button asChild><Link to="/host/properties/new"><Plus className="h-4 w-4" />إضافة عقار</Link></Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="properties">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="properties">عقاراتي</TabsTrigger>
              <TabsTrigger value="requests">
                طلبات الحجز
                {pendingBookings.length > 0 && <Badge className="mr-2 bg-primary">{pendingBookings.length}</Badge>}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="properties" className="grid gap-4">
              {properties.data?.length ? properties.data.map((property) => (
                <Card key={property.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row">
                      <img src={propertyImages(property)[0]} alt={property.title} className="h-32 w-full rounded-lg object-cover md:w-36" />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-extrabold">{property.title}</h3>
                            <p className="font-semibold text-muted-foreground">{propertyLocation(property) || "الموقع غير محدد"}</p>
                          </div>
                          <Badge variant={property.status === "accepted" ? "success" : property.status === "rejected" ? "destructive" : "warning"}>
                            {property.status ? statusLabels[property.status] : "بانتظار"}
                          </Badge>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <MiniMetric label="السعر" value={`${formatCurrency(property.price)} د.ل`} icon={DollarSign} />
                          <MiniMetric label="المشاهدات" value={String(80 + property.id * 7)} icon={Eye} />
                          <MiniMetric label="الحجوزات" value={String(bookings.data?.filter((booking) => booking.property_id === property.id).length ?? 0)} icon={CalendarDays} />
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button asChild size="sm" variant="outline"><Link to={`/host/properties/${property.id}/edit`}>تعديل</Link></Button>
                          <Button asChild size="sm" variant="outline"><Link to={`/properties/${property.id}`}>عرض</Link></Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : <EmptyState icon={Building2} title="لا توجد عقارات بعد" />}
            </TabsContent>
            <TabsContent value="requests" className="grid gap-4">
              {bookings.data?.length ? bookings.data.map((booking) => (
                <Card key={booking.id} className="border">
                  <CardContent className="grid gap-3 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold">{booking.property?.title ?? `طلب #${booking.id}`}</h3>
                        <p className="font-semibold text-muted-foreground">طلب من: {booking.tenant?.first_name ?? "مستأجر"}</p>
                      </div>
                      <Badge variant={booking.status === "pending" ? "warning" : booking.status === "accepted" ? "success" : "destructive"}>
                        {bookingStatusLabels[booking.status] ?? booking.status}
                      </Badge>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <MiniText label="تاريخ البداية" value={booking.start_date} />
                      <MiniText label="المدة" value={bookingDuration(booking)} />
                    </div>
                    <div className="rounded-lg bg-accent p-3 text-sm font-semibold text-muted-foreground">
                      المستأجر مهتم بالعقار ويرغب في مناقشة التفاصيل وشروط السكن.
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {booking.status === "pending" && <Button size="sm" onClick={() => accept.mutate(booking.id)}><Check className="h-4 w-4" />قبول</Button>}
                      {booking.status === "pending" && <Button size="sm" variant="outline" onClick={() => reject.mutate(booking.id)}><X className="h-4 w-4" />رفض</Button>}
                      <Button asChild size="sm" variant="outline"><Link to="/messages"><MessageSquare className="h-4 w-4" />رسالة</Link></Button>
                    </div>
                  </CardContent>
                </Card>
              )) : <EmptyState icon={CalendarDays} title="لا توجد طلبات حجز" />}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardPage>
  );
}

export function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const properties = useQuery({ queryKey: ["admin", "properties"], queryFn: adminApi.properties });
  const bookings = useQuery({ queryKey: ["admin", "bookings"], queryFn: adminApi.bookings });
  const contracts = useQuery({ queryKey: ["contracts"], queryFn: sharedApi.contracts });
  const unread = useQuery({ queryKey: ["notifications", "unread"], queryFn: sharedApi.unreadCount });
  const accept = useMutation({
    mutationFn: adminApi.acceptProperty,
    onSuccess: () => { toast.success("تم قبول العقار"); queryClient.invalidateQueries({ queryKey: ["admin", "properties"] }); },
  });
  const pending = properties.data?.filter((item) => item.status === "pending") ?? [];

  return (
    <DashboardPage title={`مرحباً ${fullName(user)}`} subtitle="إشراف كامل على المنصة.">
      <div className="dashboard-grid">
        <StatCard label="إجمالي العقارات" value={properties.data?.length ?? 0} icon={Building2} />
        <StatCard label="بانتظار المراجعة" value={pending.length} icon={ClipboardList} />
        <StatCard label="إجمالي الحجوزات" value={bookings.data?.length ?? 0} icon={CalendarDays} />
        <StatCard label="عقود نشطة" value={contracts.data?.length ?? 0} icon={FileText} />
        <StatCard label="إشعارات جديدة" value={unread.data?.count ?? unread.data?.unread_count ?? 0} icon={Bell} />
      </div>
      <Card>
        <CardHeader><CardTitle>عقارات بانتظار المراجعة</CardTitle></CardHeader>
        <CardContent>
          {pending.length ? (
            <div className="grid gap-3">
              {pending.slice(0, 5).map((property) => (
                <AdminPropertyRow key={property.id} property={property} onAccept={() => accept.mutate(property.id)} />
              ))}
            </div>
          ) : <EmptyState icon={ClipboardList} title="لا توجد عقارات بانتظار المراجعة" />}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>آخر الحجوزات</CardTitle></CardHeader>
        <CardContent><BookingsTable bookings={bookings.data?.slice(0, 6) ?? []} /></CardContent>
      </Card>
      <Button asChild variant="outline" className="w-fit"><Link to="/admin/properties">عرض كل العقارات</Link></Button>
    </DashboardPage>
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

function DashboardPage({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="page-container grid gap-5">
      <div>
        <h1 className="text-3xl font-black text-foreground">{title}</h1>
        <p className="mt-1 font-bold text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function BookingsTable({ bookings }: { bookings: Booking[] }) {
  if (!bookings.length) return <EmptyState icon={CalendarDays} title="لا توجد حجوزات" />;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>العقار</TableHead>
          <TableHead>المدة</TableHead>
          <TableHead>السعر</TableHead>
          <TableHead>الحالة</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell className="font-extrabold">{booking.property?.title ?? `حجز #${booking.id}`}</TableCell>
            <TableCell>{booking.start_date} - {booking.end_date}</TableCell>
            <TableCell>{formatCurrency(booking.price)} د.ل</TableCell>
            <TableCell><Badge variant="secondary">{bookingStatusLabels[booking.status] ?? booking.status}</Badge></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AdminPropertyRow({ property, onAccept }: { property: Property; onAccept: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
      <div>
        <div className="font-extrabold">{property.title}</div>
        <div className="text-sm font-bold text-muted-foreground">{formatCurrency(property.price)} د.ل</div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="warning">{property.status ? statusLabels[property.status] : "بانتظار"}</Badge>
        <Button size="sm" onClick={onAccept}><Check className="h-4 w-4" />قبول</Button>
        <Button asChild size="sm" variant="outline"><Link to="/admin/properties">مراجعة</Link></Button>
      </div>
    </div>
  );
}
