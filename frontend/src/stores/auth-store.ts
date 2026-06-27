import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse, Role, User } from "@/types/api";

interface AuthState {
  token: string | null;
  role: Role | null;
  user: User | null;
  isProfileComplete: boolean;
  redirectAfterComplete: string | null;
  setAuth: (data: AuthResponse) => void;
  setProfileComplete: (complete: boolean) => void;
  setRedirectAfterComplete: (url: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      user: null,
      isProfileComplete: false,
      redirectAfterComplete: null,
      setAuth: (data) =>
        set({
          token: data.token,
          role: data.role,
          user: data.user,
          isProfileComplete: data.is_profile_complete,
        }),
      setProfileComplete: (complete) => set({ isProfileComplete: complete }),
      setRedirectAfterComplete: (url) => set({ redirectAfterComplete: url }),
      clearAuth: () =>
        set({
          token: null,
          role: null,
          user: null,
          isProfileComplete: false,
          redirectAfterComplete: null,
        }),
    }),
    {
      name: "hima-auth",
    },
  ),
);

export function dashboardForRole(role: Role | null) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "host") return "/dashboard/host";
  if (role === "tenant") return "/dashboard/tenant";
  return "/login";
}
