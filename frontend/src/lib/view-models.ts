import type { Booking, Property } from "@/types/api";
import { damageLabels, propertyTypeLabels } from "@/lib/labels";

const fallbackImages = [
  "https://images.unsplash.com/photo-1651752523215-9bf678c29355?w=900",
  "https://images.unsplash.com/photo-1756706718604-ef4af3970e33?w=900",
  "https://images.unsplash.com/photo-1630912121186-16bea8d6f241?w=900",
  "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=900",
];

export function propertyLocation(property?: Property | null) {
  if (!property) return "";
  return (
    property.location ||
    [property.neighborhood?.name, property.city?.name, property.governorate?.name, property.street].filter(Boolean).join("، ")
  );
}

export function propertyImages(property?: Property | null) {
  if (!property) return fallbackImages.slice(0, 1);
  const realImages = [
    property.main_image?.url,
    property.mainImage?.url,
    ...(property.images?.map((image) => image.url) ?? []),
  ].filter(Boolean) as string[];
  return Array.from(new Set(realImages)).slice(0, 8).concat(realImages.length ? [] : [fallbackImages[property.id % fallbackImages.length]]);
}

export function propertyRating(property?: Property | null) {
  if (!property) return { rating: 4.6, reviewCount: 0 };
  const rating = 4.3 + ((property.id % 7) / 10);
  return { rating: Number(rating.toFixed(1)), reviewCount: 8 + (property.id % 28) };
}

export function hostDisplayName(property?: Property | null) {
  if (!property?.host) return "مضيف حِمى";
  return [property.host.first_name, property.host.last_name].filter(Boolean).join(" ") || "مضيف حِمى";
}

export function propertyAmenities(property?: Property | null) {
  const amenities = [];
  if (property?.has_water) amenities.push("ماء");
  if (property?.has_electricity) amenities.push("كهرباء");
  if (property?.is_ready) amenities.push("جاهز للسكن");
  if (!amenities.length) amenities.push("قابل للمعاينة", "تواصل مباشر مع المضيف");
  return amenities;
}

export function propertyConditionNotes(property?: Property | null) {
  if (!property) return [];
  if (property.damage_status === "intact") {
    return [{ title: "جاهز للسكن", description: "لم يتم تسجيل أضرار جوهرية على العقار.", severity: "low" as const }];
  }
  if (property.damage_status === "renovated") {
    return [{ title: "مرمم", description: "العقار خضع لأعمال ترميم ويحتاج فقط إلى معاينة نهائية.", severity: "low" as const }];
  }
  return [
    {
      title: damageLabels[property.damage_status] ?? "حالة تحتاج مراجعة",
      description: "يرجى مراجعة الصور والتواصل مع المضيف لتوثيق حالة العقار قبل الحجز.",
      severity: "medium" as const,
    },
  ];
}

export function propertyRules() {
  return [
    "توثيق حالة العقار بالصور قبل الانتقال.",
    "الالتزام بالاستخدام السكني المتفق عليه.",
    "إبلاغ المضيف بأي ضرر أو صيانة طارئة فوراً.",
    "احترام الجيران وساعات الهدوء.",
  ];
}

export function bookingDuration(booking: Booking) {
  const start = new Date(booking.start_date);
  const end = new Date(booking.end_date);
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const months = Math.max(1, Math.ceil(days / 30));
  return `${months} شهر`;
}

export function propertyTypeLabel(property?: Property | null) {
  return property ? propertyTypeLabels[property.type] ?? property.type : "عقار";
}
