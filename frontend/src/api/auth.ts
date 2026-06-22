import { apiRequest } from "@/api/client";
import type { AuthResponse, CompleteProfilePayload, LoginPayload, RegisterPayload } from "@/types/api";

export const authApi = {
  login: (payload: LoginPayload) => apiRequest<AuthResponse>("/login", { method: "POST", body: payload, auth: false }),
  register: (payload: RegisterPayload) => apiRequest<{ message: string }>("/register", { method: "POST", body: payload, auth: false }),
  forgotPassword: (email: string) => apiRequest<{ message: string }>("/forgot-password", { method: "POST", body: { email }, auth: false }),
  resetPassword: (payload: { token: string; email: string; password: string; password_confirmation: string }) =>
    apiRequest<{ message: string }>("/reset-password", { method: "POST", body: payload, auth: false }),
  me: () => apiRequest<Omit<AuthResponse, "token">>("/me"),
  completeProfile: (payload: CompleteProfilePayload) => apiRequest<{ message: string }>("/profile/complete", { method: "POST", body: payload }),
  logout: () => apiRequest<{ message: string }>("/logout", { method: "POST" }),
};
