import { apiRequest } from "@/api/client";
import type { LocationEntity } from "@/types/api";

export const locationsApi = {
  governorates: () => apiRequest<LocationEntity[]>("/governorates", { auth: false }),
  cities: (governorateId: string | number) => apiRequest<LocationEntity[]>(`/governorates/${governorateId}/cities`, { auth: false }),
  neighborhoods: (cityId: string | number) => apiRequest<LocationEntity[]>(`/cities/${cityId}/neighborhoods`, { auth: false }),
};
