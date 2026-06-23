import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Building2, DollarSign, Home as HomeIcon, MapPin, Search, Star, User } from "lucide-react";
import { propertiesApi } from "@/api/properties";
import { PublicShell } from "@/components/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockProperties } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { hostDisplayName, propertyImages, propertyLocation, propertyRating, propertyTypeLabel } from "@/lib/view-models";

export function HomePage({ tenantPreview = false }: { tenantPreview?: boolean }) {
  const navigate = useNavigate();
  const properties = useQuery({ queryKey: ["properties", "home"], queryFn: () => propertiesApi.list({}) });
  const sourceProperties = properties.data?.length ? properties.data : mockProperties;
  const rows = [...sourceProperties].sort((a, b) => propertyRating(b).rating - propertyRating(a).rating);

  return (
    <PublicShell mode={tenantPreview ? "tenant-preview" : "public"}>
      <section className="bg-gradient-to-br from-primary via-[#2f8f46] to-[#9db98f] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-8 max-w-2xl">
            <button className="relative block w-full" onClick={() => navigate("/search")}>
              <Input readOnly placeholder="ابحث عن عقار في غزة..." className="h-13 cursor-pointer rounded-full border-0 bg-white/95 px-12 shadow-lg" />
              <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
            </button>
          </div>
          <div className="mb-6 text-white">
            <h1 className="text-3xl font-black">العقارات المتاحة</h1>
            <p className="mt-1 font-bold text-white/80">تصفح العقارات مرتبة حسب التقييم والجاهزية</p>
          </div>
          {!tenantPreview && (
            <div className="mb-6 flex flex-wrap gap-3">
              <Button asChild className="bg-white text-primary hover:bg-white/90">
                <Link to="/tenant-preview"><User className="h-4 w-4" />معاينة وضع المستأجر</Link>
              </Button>
              <Button asChild variant="outline" className="border-white bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link to="/host-preview"><Building2 className="h-4 w-4" />معاينة وضع المضيف</Link>
              </Button>
            </div>
          )}
          {properties.isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-80 rounded-lg bg-white/25 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rows.map((property) => {
                const rating = propertyRating(property);
                const image = propertyImages(property)[0];
                const detailHref = tenantPreview ? `/tenant-preview/properties/${property.id}` : `/properties/${property.id}`;
                return (
                  <Card key={property.id} className="overflow-hidden border-0 bg-white/95 shadow-hima transition-shadow hover:shadow-hima-hover">
                    <Link to={detailHref} className="block">
                      <div className="relative aspect-video overflow-hidden bg-accent">
                        <img src={image} alt={property.title} className="h-full w-full object-cover transition-transform hover:scale-105" />
                        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-sm font-extrabold text-foreground">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          {rating.rating}
                        </div>
                      </div>
                    </Link>
                    <CardContent className="grid gap-3 p-4">
                      <div>
                        <Link to={detailHref} className="line-clamp-1 text-lg font-extrabold text-foreground hover:text-primary">
                          {property.title}
                        </Link>
                        <div className="mt-2 flex items-center gap-2 text-sm font-bold text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="line-clamp-1">{propertyLocation(property) || "الموقع غير محدد"}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm font-bold text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <HomeIcon className="h-4 w-4 text-primary" />
                          {property.rooms ?? 0} غرف
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-primary" />
                          {formatCurrency(property.price)} د.ل / شهر
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3">
                        <div className="text-sm">
                          <div className="font-bold text-muted-foreground">المضيف: {hostDisplayName(property)}</div>
                          <div className="font-semibold text-muted-foreground">{rating.reviewCount} تقييم - {propertyTypeLabel(property)}</div>
                        </div>
                        <Button asChild size="sm">
                          <Link to={detailHref}>عرض التفاصيل</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
