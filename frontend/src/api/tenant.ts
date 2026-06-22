import { apiRequest } from "@/api/client";
import type { Booking, BookingPayload, Property } from "@/types/api";

export const tenantApi = {
  bookings: () => apiRequest<Booking[]>("/tenant/bookings"),
  createBooking: (payload: BookingPayload) => apiRequest<{ message: string; booking: Booking }>("/tenant/bookings", { method: "POST", body: payload }),
  favorites: () => apiRequest<Property[]>("/tenant/favorites"),
  addFavorite: (property_id: number) => apiRequest<{ message: string }>("/tenant/favorites", { method: "POST", body: { property_id } }),
  removeFavorite: (propertyId: number) => apiRequest<{ message: string }>(`/tenant/favorites/${propertyId}`, { method: "DELETE" }),
};
