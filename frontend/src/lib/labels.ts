import type { Availability, BookingStatus, DamageStatus, PropertyStatus, PropertyType, Role } from "@/types/api";

export const roleLabels: Record<Role, string> = {
  admin: "مشرف",
  host: "صاحب عقار",
  tenant: "مستأجر",
};

export const propertyTypeLabels: Record<PropertyType, string> = {
  apartment: "شقة",
  villa: "فيلا",
  land: "أرض",
  chalet: "شاليه",
  commercial: "تجاري",
  parking: "موقف",
};

export const damageLabels: Record<DamageStatus, string> = {
  intact: "سليم",
  partial: "متضرر جزئياً",
  renovated: "مرمم",
};

export const statusLabels: Record<PropertyStatus, string> = {
  pending: "بانتظار المراجعة",
  accepted: "مقبول",
  rejected: "مرفوض",
  archived: "مؤرشف",
};

export const availabilityLabels: Record<Availability, string> = {
  available: "متاح",
  not_available: "غير متاح",
  booked: "محجوز",
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: "بانتظار الرد",
  accepted: "مقبول",
  rejected: "مرفوض",
  cancelled: "ملغي",
  completed: "مكتمل",
};

export function badgeVariant(status?: string) {
  if (status === "accepted" || status === "available" || status === "active") return "success" as const;
  if (status === "pending" || status === "not_available") return "warning" as const;
  if (status === "rejected" || status === "cancelled" || status === "booked") return "destructive" as const;
  return "secondary" as const;
}
