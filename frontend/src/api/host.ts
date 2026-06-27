import { apiRequest } from "@/api/client";
import type { Booking, Property, PropertyFormPayload } from "@/types/api";

export const hostApi = {
  properties: () => apiRequest<Property[]>("/host/properties"),
  property: (id: string | number) => apiRequest<Property>(`/host/properties/${id}`),
  createProperty: (payload: PropertyFormPayload) => apiRequest<{ message: string; property: Property }>("/host/properties", { method: "POST", body: payload }),
  updateProperty: (id: string | number, payload: PropertyFormPayload) =>
    apiRequest<{ message: string; property: Property }>(`/host/properties/${id}`, { method: "PUT", body: payload }),
  archiveProperty: (id: string | number) => apiRequest<{ message: string }>(`/host/properties/${id}`, { method: "DELETE" }),
  toggleAvailability: (id: string | number) => apiRequest<{ message: string; availability: string }>(`/host/properties/${id}/availability`, { method: "PATCH" }),
  uploadImages: (propertyId: string | number, files: File[]) => {
    const data = new FormData();
    files.forEach((file) => data.append("images[]", file));
    return apiRequest(`/host/properties/${propertyId}/images`, { method: "POST", body: data });
  },
  bookings: () => apiRequest<Booking[]>("/host/bookings"),
  acceptBooking: (id: string | number) => apiRequest<{ message: string }>(`/host/bookings/${id}/accept`, { method: "PATCH" }),
  rejectBooking: (id: string | number) => apiRequest<{ message: string }>(`/host/bookings/${id}/reject`, { method: "PATCH" }),
};
