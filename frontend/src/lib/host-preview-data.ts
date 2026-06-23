import { mockProperties } from "@/lib/mock-data";
import type { BookingStatus } from "@/types/api";

export type HostPreviewRequest = {
  id: string;
  propertyId: number;
  tenantName: string;
  tenantPhone: string;
  tenantNationalId: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: BookingStatus;
  message: string;
};

export type HostPreviewNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  to: string;
};

const requestStatusKey = "hima-host-preview-request-status";

export const hostPreviewRequests: HostPreviewRequest[] = [
  {
    id: "req-9001-1",
    propertyId: 9001,
    tenantName: "سارة محمد",
    tenantPhone: "970599111222",
    tenantNationalId: "401234567",
    startDate: "2026-07-01",
    endDate: "2027-01-01",
    duration: "6 أشهر",
    status: "pending",
    message: "أنا مهتمة باستئجار الشقة لعائلة من 4 أفراد، هل يمكننا مناقشة الشروط؟",
  },
  {
    id: "req-9002-1",
    propertyId: 9002,
    tenantName: "خالد عمر",
    tenantPhone: "970599333444",
    tenantNationalId: "402345678",
    startDate: "2026-07-15",
    endDate: "2026-10-15",
    duration: "3 أشهر",
    status: "pending",
    message: "أبحث عن سكن مؤقت وقريب من الخدمات. هل العقار متاح للمعاينة؟",
  },
  {
    id: "req-9003-1",
    propertyId: 9003,
    tenantName: "ليان أحمد",
    tenantPhone: "970599555666",
    tenantNationalId: "403456789",
    startDate: "2026-08-01",
    endDate: "2027-08-01",
    duration: "سنة",
    status: "accepted",
    message: "نحتاج بيتاً واسعاً لمدة سنة ونرغب بتثبيت التفاصيل في عقد واضح.",
  },
  {
    id: "req-9001-2",
    propertyId: 9001,
    tenantName: "مريم علي",
    tenantPhone: "970599777888",
    tenantNationalId: "404567890",
    startDate: "2026-08-10",
    endDate: "2027-02-10",
    duration: "6 أشهر",
    status: "pending",
    message: "أرغب بمعاينة الشقة هذا الأسبوع قبل تأكيد الحجز، وهل يمكن تمديد المدة لاحقاً؟",
  },
  {
    id: "req-9004-1",
    propertyId: 9004,
    tenantName: "أحمد سامي",
    tenantPhone: "970599999000",
    tenantNationalId: "405678901",
    startDate: "2026-09-01",
    endDate: "2026-12-01",
    duration: "3 أشهر",
    status: "pending",
    message: "أبحث عن استوديو اقتصادي لفترة مؤقتة، وأريد معرفة التفاصيل قبل القرار النهائي.",
  },
];

export function getRequestStatuses() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(requestStatusKey) ?? "{}") as Record<string, BookingStatus>;
  } catch {
    return {};
  }
}

export function setRequestStatus(id: string, status: BookingStatus) {
  const statuses = getRequestStatuses();
  statuses[id] = status;
  window.localStorage.setItem(requestStatusKey, JSON.stringify(statuses));
}

export function getHostPreviewRequests() {
  const statuses = getRequestStatuses();
  return hostPreviewRequests.map((request) => ({ ...request, status: statuses[request.id] ?? request.status }));
}

export function getHostPreviewRequest(id?: string) {
  return getHostPreviewRequests().find((request) => request.id === id);
}

export function getHostPreviewProperty(propertyId: number) {
  return mockProperties.find((property) => property.id === propertyId);
}

export function getContracts() {
  return getHostPreviewRequests().filter((request) => request.status === "accepted");
}

export function getSentHostMessage(request: HostPreviewRequest) {
  if (request.status === "accepted") {
    return `مرحباً ${request.tenantName}، تم قبول طلبك مبدئياً وتم إنشاء العقد للمراجعة. يمكنك التواصل معي لتأكيد موعد التسليم.`;
  }
  if (request.status === "rejected") {
    return `مرحباً ${request.tenantName}، نعتذر عن قبول الطلب حالياً. شكراً لاهتمامك بالعقار.`;
  }
  return `مرحباً ${request.tenantName}، وصلني طلب الحجز وسأراجعه قريباً. سأخبرك بالقبول أو الرفض بعد مراجعة التفاصيل.`;
}

export function getHostPreviewNotifications(): HostPreviewNotification[] {
  const requests = hostPreviewRequests;
  const newOrderNotifications = requests
    .filter((request) => request.status === "pending")
    .map((request) => {
      const property = getHostPreviewProperty(request.propertyId);
      return {
        id: `new-${request.id}`,
        title: "طلب حجز جديد",
        body: `${request.tenantName} أرسل طلباً على ${property?.title ?? "أحد عقاراتك"}.`,
        time: request.startDate,
        to: `/host-preview/requests/${request.id}`,
      };
    });

  return [
    {
      id: "admin-accepted-9001",
      title: "تم قبول عقارك من المشرف",
      body: "تم قبول شقة عائلية حديثة في الرمال وأصبحت ظاهرة للمستأجرين.",
      time: "2026-06-23",
      to: "/host-preview/properties/9001",
    },
    {
      id: "admin-accepted-9002",
      title: "تم قبول عقارك من المشرف",
      body: "تم قبول منزل مريح من غرفتين في تل الهوى وأصبح جاهزاً لاستقبال الطلبات.",
      time: "2026-06-22",
      to: "/host-preview/properties/9002",
    },
    ...newOrderNotifications,
  ];
}

export function tenantWhatsappLink(phone: string, tenantName: string) {
  const message = `مرحباً ${tenantName}، أتواصل معك بخصوص طلب الحجز على منصة حِمى.`;
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
