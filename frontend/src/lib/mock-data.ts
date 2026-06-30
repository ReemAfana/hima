import type { Property, PropertyFilters } from "@/types/api";

export const mockProperties: Property[] = [
  {
    id: 9001,
    title: "شقة عائلية حديثة في الرمال",
    location: "الرمال، مدينة غزة",
    type: "apartment",
    price: 350,
    rooms: 3,
    area_m2: 125,
    damage_status: "partial",
    has_water: true,
    has_electricity: true,
    is_ready: true,
    availability: "available",
    status: "accepted",
    description:
      "شقة واسعة مناسبة لعائلة، قريبة من الخدمات والأسواق. يوجد تلف بسيط في بعض النوافذ وتم توثيقه للمراجعة قبل السكن.",
    host: { id: 101, first_name: "أحمد", last_name: "حسن", email: "ahmed@example.com", phone: "+970599000001" },
    images: [{ id: 1, url: "https://images.unsplash.com/photo-1651752523215-9bf678c29355?w=900" }],
  },
  {
    id: 9002,
    title: "منزل مريح من غرفتين في تل الهوى",
    location: "تل الهوى، مدينة غزة",
    type: "villa",
    price: 280,
    rooms: 2,
    area_m2: 95,
    damage_status: "renovated",
    has_water: true,
    has_electricity: true,
    is_ready: true,
    availability: "available",
    status: "accepted",
    description: "منزل مريح تم ترميمه مؤخراً، مناسب للإقامة المؤقتة أو الطويلة، مع مساحة جيدة وتهوية ممتازة.",
    host: { id: 102, first_name: "سارة", last_name: "محمد", email: "sara@example.com", phone: "+970599000002" },
    images: [{ id: 2, url: "https://images.unsplash.com/photo-1756706718604-ef4af3970e33?w=900" }],
  },
  {
    id: 9003,
    title: "بيت واسع قرب الخدمات في خان يونس",
    location: "مخيم خان يونس، خان يونس",
    type: "villa",
    price: 420,
    rooms: 4,
    area_m2: 170,
    damage_status: "intact",
    has_water: true,
    has_electricity: true,
    is_ready: true,
    availability: "available",
    status: "accepted",
    description: "بيت عائلي واسع بحالة جيدة، قريب من المواصلات والخدمات الأساسية، مناسب للعائلات الكبيرة.",
    host: { id: 103, first_name: "خالد", last_name: "عمر", email: "khaled@example.com", phone: "+970599000003" },
    images: [{ id: 3, url: "https://images.unsplash.com/photo-1630912121186-16bea8d6f241?w=900" }],
  },
  {
    id: 9004,
    title: "استوديو اقتصادي في النصر",
    location: "النصر، مدينة غزة",
    type: "apartment",
    price: 200,
    rooms: 1,
    area_m2: 48,
    damage_status: "partial",
    has_water: true,
    has_electricity: false,
    is_ready: false,
    availability: "available",
    status: "accepted",
    description: "استوديو اقتصادي يحتاج لبعض التجهيزات البسيطة، مناسب لشخص واحد أو إقامة قصيرة.",
    host: { id: 104, first_name: "فاطمة", last_name: "علي", email: "fatima@example.com", phone: "+970599000004" },
    images: [{ id: 4, url: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=900" }],
  },
];

export function getMockProperty(id?: string | number) {
  return mockProperties.find((property) => String(property.id) === String(id));
}

export function filterMockProperties(filters: PropertyFilters = {}) {
  return mockProperties.filter((property) => {
    if (filters.type && property.type !== filters.type) return false;
    if (filters.min_price && Number(property.price) < Number(filters.min_price)) return false;
    if (filters.max_price && Number(property.price) > Number(filters.max_price)) return false;
    if (filters.rooms && Number(property.rooms) !== Number(filters.rooms)) return false;
    if (filters.damage_status && property.damage_status !== filters.damage_status) return false;
    if (filters.has_water === "1" && !property.has_water) return false;
    if (filters.has_electricity === "1" && !property.has_electricity) return false;
    if (filters.is_ready === "1" && !property.is_ready) return false;
    return true;
  });
}
