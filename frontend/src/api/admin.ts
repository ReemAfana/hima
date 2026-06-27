import { apiRequest } from "@/api/client";
import type { Booking, Property } from "@/types/api";

export const adminApi = {
  properties: () => apiRequest<Property[]>("/admin/properties"),
  bookings: () => apiRequest<Booking[]>("/admin/bookings"),
  acceptProperty: (id: string | number) => apiRequest<{ message: string }>(`/admin/properties/${id}/accept`, { method: "PATCH" }),
  rejectProperty: (id: string | number, reason: string) =>
    apiRequest<{ message: string }>(`/admin/properties/${id}/reject`, { method: "PATCH", body: { rejection_reason: reason, reason } }),
  archiveProperty: (id: string | number) => apiRequest<{ message: string }>(`/admin/properties/${id}`, { method: "DELETE" }),
};
