import { useQuery } from "@tanstack/react-query";
import { locationsApi } from "@/api/locations";

export function useGovernorates() {
  return useQuery({
    queryKey: ["locations", "governorates"],
    queryFn: locationsApi.governorates,
  });
}

export function useCities(governorateId?: string) {
  return useQuery({
    queryKey: ["locations", "cities", governorateId],
    queryFn: () => locationsApi.cities(governorateId!),
    enabled: Boolean(governorateId),
  });
}

export function useNeighborhoods(cityId?: string) {
  return useQuery({
    queryKey: ["locations", "neighborhoods", cityId],
    queryFn: () => locationsApi.neighborhoods(cityId!),
    enabled: Boolean(cityId),
  });
}
