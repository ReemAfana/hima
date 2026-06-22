import { apiRequest, toQuery } from "@/api/client";
import type { Property, PropertyFilters, Review } from "@/types/api";

export const propertiesApi = {
  list: (filters: PropertyFilters = {}) => apiRequest<Property[]>(`/properties${toQuery(filters)}`, { auth: false }),
  show: (id: string | number) => apiRequest<Property>(`/properties/${id}`, { auth: false }),
  reviews: (id: string | number) => apiRequest<Review[]>(`/properties/${id}/reviews`, { auth: false }),
  whatsapp: (id: string | number) => apiRequest<{ whatsapp_link: string; host: string; phone: string }>(`/properties/${id}/whatsapp`, { auth: false }),
};
