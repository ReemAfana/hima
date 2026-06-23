import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Calendar, DollarSign, Edit, Home, MessageCircle, Star, User } from "lucide-react";
import { propertiesApi } from "@/api/properties";
import { PublicShell } from "@/components/public-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { damageLabels } from "@/lib/labels";
import { getHostPreviewRequests, tenantWhatsappLink } from "@/lib/host-preview-data";
import { getMockProperty } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  hostDisplayName,
  propertyAmenities,
  propertyConditionNotes,
  propertyImages,
  propertyLocation,
  propertyRating,
  propertyRules,
  propertyTypeLabel,
} from "@/lib/view-models";
import { useAuthStore } from "@/stores/auth-store";

export function PropertyDetailsPage({ ownerMode = false, tenantPreview = false }: { ownerMode?: boolean; tenantPreview?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, role, isProfileComplete, setRedirectAfterComplete } = useAuthStore();
  const [imageIndex, setImageIndex] = useState(0);
  const property = useQuery({ queryKey: ["properties", id], queryFn: () => propertiesApi.show(id!), enabled: Boolean(id) && !ownerMode });
  const reviews = useQuery({ queryKey: ["properties", id, "reviews"], queryFn: () => propertiesApi.reviews(id!), enabled: Boolean(id) && !ownerMode });
  const whatsapp = useQuery({ queryKey: ["properties", id, "whatsapp"], queryFn: () => propertiesApi.whatsapp(id!), enabled: Boolean(id) && !ownerMode, retry: false });

  const propertyData = property.data ?? getMockProperty(id);

  if (property.isLoading && !propertyData) {
    return <PublicShell mode={ownerMode ? "host-preview" : tenantPreview ? "tenant-preview" : "public"}><div className="page-container"><div className="h-96 rounded-lg bg-muted animate-pulse" /></div></PublicShell>;
  }

  if (!propertyData) {
    return <PublicShell mode={ownerMode ? "host-preview" : tenantPreview ? "tenant-preview" : "public"}><div className="page-container">تعذر تحميل العقار</div></PublicShell>;
  }

  const images = propertyImages(propertyData);
  const rating = propertyRating(propertyData);
  const conditions = propertyConditionNotes(propertyData);

  function handleBookNow() {
    if (tenantPreview) {
      navigate(`/tenant-preview/properties/${id}/book`);
      return;
    }
    if (!token) {
      navigate("/login");
      return;
    }
    if (role !== "tenant") {
      navigate("/login");
      return;
    }
    if (!isProfileComplete) {
      setRedirectAfterComplete(`/properties/${id}/book`);
      navigate("/complete-profile");
      return;
    }
    navigate(`/properties/${id}/book`);
  }

  return (
    <PublicShell mode={ownerMode ? "host-preview" : tenantPreview ? "tenant-preview" : "public"}>
      <div className="page-container grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="grid gap-6">
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-accent">
              <img src={images[imageIndex] ?? images[0]} alt={propertyData.title} className="h-full w-full object-cover" />
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full bg-white transition-all ${index === imageIndex ? "w-7" : "w-2 opacity-60"}`}
                      aria-label={`صورة ${index + 1}`}
                      onClick={() => setImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <CardContent className="grid gap-5 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-foreground">{propertyData.title}</h1>
                  <p className="mt-2 font-bold text-muted-foreground">{propertyLocation(propertyData) || "الموقع غير محدد"}</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 font-extrabold text-primary">
                  <Star className="h-5 w-5 fill-primary" />
                  {rating.rating}
                  <span className="text-muted-foreground">({rating.reviewCount})</span>
                </div>
              </div>

              <div className="grid gap-4 border-y py-4 sm:grid-cols-2 lg:grid-cols-4">
                <Fact icon={Home} label="الغرف" value={`${propertyData.rooms ?? 0}`} />
                <Fact icon={DollarSign} label="السعر" value={`${formatCurrency(propertyData.price)} د.ل`} />
                <Fact icon={Calendar} label="أقل مدة" value="شهر واحد" />
                <Fact icon={DollarSign} label="الدفع" value="شهري" />
              </div>

              <div>
                <h2 className="section-title mb-2">الوصف</h2>
                <p className="leading-8 text-muted-foreground">
                  {propertyData.description || "عقار متاح عبر حِمى مع إمكانية التواصل مع المضيف لمراجعة التفاصيل وحالة السكن قبل إرسال طلب الحجز."}
                </p>
              </div>

              <div>
                <h2 className="section-title mb-3">المزايا</h2>
                <div className="flex flex-wrap gap-2">
                  {propertyAmenities(propertyData).map((amenity) => <Badge key={amenity} variant="success">{amenity}</Badge>)}
                  <Badge variant="secondary">{propertyTypeLabel(propertyData)}</Badge>
                  <Badge variant="secondary">{damageLabels[propertyData.damage_status]}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {conditions.length > 0 && (
            <Card className="border-r-4 border-r-yellow-500">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h2 className="section-title">ملاحظات حالة العقار</h2>
                </div>
                <div className="grid gap-3">
                  {conditions.map((condition) => (
                    <div key={condition.title} className="rounded-lg bg-yellow-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-extrabold text-foreground">{condition.title}</div>
                        <Badge variant={condition.severity === "medium" ? "warning" : "success"}>{condition.severity === "medium" ? "متوسط" : "منخفض"}</Badge>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-muted-foreground">
                        {ownerMode && condition.severity === "medium" ? "راجع الصور والتوثيق قبل الموافقة على أي طلب حجز." : condition.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h2 className="section-title mb-4">قواعد العقار</h2>
              <ul className="grid gap-2">
                {propertyRules().map((rule) => <li key={rule} className="flex gap-2 font-semibold text-muted-foreground"><span className="text-primary">•</span>{rule}</li>)}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="section-title mb-4">التقييمات ({reviews.data?.length ?? 0})</h2>
              {reviews.data?.length ? (
                <div className="grid gap-4">
                  {reviews.data.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-extrabold">{review.user?.first_name ?? "مستأجر"}</div>
                        <span className="flex items-center gap-1 font-bold text-primary"><Star className="h-4 w-4 fill-primary" />{review.rating ?? "-"}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment || "بدون تعليق"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-semibold text-muted-foreground">لا توجد تقييمات بعد.</p>
              )}
            </CardContent>
          </Card>
        </section>

        {ownerMode ? (
          <HostPropertyAside propertyId={propertyData.id} price={propertyData.price} />
        ) : (
          <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
            <Card>
              <CardContent className="grid gap-4 p-6 text-center">
                <div>
                  <p className="font-bold text-muted-foreground">السعر الشهري</p>
                  <p className="text-4xl font-black text-primary">{formatCurrency(propertyData.price)} د.ل</p>
                </div>
                <Button onClick={handleBookNow}>طلب الحجز الآن</Button>
                <p className="text-sm font-semibold text-muted-foreground">لن يتم تحصيل أي مبلغ الآن</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="grid gap-4 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-muted-foreground">المضيف</p>
                    <p className="font-extrabold">{hostDisplayName(propertyData)}</p>
                  </div>
                </div>
                <div className="grid gap-2 text-sm font-bold text-muted-foreground">
                  <div className="flex justify-between"><span>التقييم</span><span>{rating.rating}</span></div>
                  <div className="flex justify-between"><span>العقارات</span><span>{1 + (propertyData.id % 5)} عقارات</span></div>
                </div>
                {whatsapp.data?.whatsapp_link ? (
                  <Button asChild variant="outline">
                    <a href={whatsapp.data.whatsapp_link} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" />تواصل مع المضيف</a>
                  </Button>
                ) : (
                  <Button asChild variant="outline">
                    <a href={fallbackWhatsappLink(propertyData)} target="_blank" rel="noreferrer">
                      <MessageCircle className="h-4 w-4" />
                      تواصل واتساب
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </aside>
        )}
      </div>
    </PublicShell>
  );
}

function HostPropertyAside({ propertyId, price }: { propertyId: number; price: string | number }) {
  const request = getHostPreviewRequests().find((item) => item.propertyId === propertyId) ?? getHostPreviewRequests()[0];
  return (
    <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
      <Card>
        <CardContent className="grid gap-4 p-6">
          <div className="text-center">
            <p className="font-bold text-muted-foreground">السعر الشهري</p>
            <p className="text-4xl font-black text-primary">{formatCurrency(price)} د.ل</p>
          </div>
          <div className="grid gap-2 text-sm font-bold text-muted-foreground">
            <div className="flex justify-between"><span>الحالة</span><Badge variant="success">نشط</Badge></div>
            <div className="flex justify-between"><span>المشاهدات</span><span>{120 + propertyId % 100}</span></div>
            <div className="flex justify-between"><span>طلبات الحجز</span><span>{1 + propertyId % 4}</span></div>
          </div>
          <Button asChild>
            <Link to={`/host-preview/properties/${propertyId}/edit`}><Edit className="h-4 w-4" />تعديل العقار</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-4 p-6">
          <div>
            <p className="text-sm font-bold text-muted-foreground">آخر طلب حجز</p>
            <p className="font-extrabold">{request.tenantName}</p>
          </div>
          <div className="grid gap-2 text-sm font-bold text-muted-foreground">
            <div className="flex justify-between"><span>تاريخ البداية</span><span>{request.startDate}</span></div>
            <div className="flex justify-between"><span>المدة</span><span>{request.duration}</span></div>
          </div>
          <div className="rounded-lg bg-accent p-3 text-sm font-semibold text-muted-foreground">{request.message}</div>
          <Button asChild variant="outline">
            <a href={tenantWhatsappLink(request.tenantPhone, request.tenantName)} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              تواصل مع المستأجر
            </a>
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-primary" />
      <div>
        <div className="text-sm font-bold text-muted-foreground">{label}</div>
        <div className="font-extrabold">{value}</div>
      </div>
    </div>
  );
}

function fallbackWhatsappLink(property: { title: string; price?: string | number; location?: string | null; host?: { phone?: string | null } | null }) {
  const phone = property.host?.phone?.replace(/\D/g, "") || "970599000000";
  const message = [
    "مرحباً، وجدت عقارك على منصة حِمى وأرغب بالاستفسار عنه.",
    `العقار: ${property.title}`,
    property.location ? `الموقع: ${property.location}` : "",
    property.price ? `السعر: ${property.price} شهرياً` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
