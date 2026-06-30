import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value?: number | string | null) {
  const number = Number(value ?? 0);
  return new Intl.NumberFormat("ar", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(number) ? number : 0);
}

export function fullName(user?: { first_name?: string | null; last_name?: string | null } | null) {
  return [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "مستخدم";
}

export function legacyPath(path: string) {
  const map: Record<string, string> = {
    "/login.html": "/login",
    "/register.html": "/register",
    "/forgot-password.html": "/forgot-password",
    "/reset-password.html": "/reset-password",
    "/complete-profile.html": "/complete-profile",
    "/properties.html": "/properties",
    "/property-details.html": "/properties",
    "/booking-form.html": "/properties",
    "/dashboard-admin.html": "/dashboard/admin",
    "/dashboard-host.html": "/dashboard/host",
    "/dashboard-tenant.html": "/dashboard/tenant",
    "/my-properties.html": "/host/properties",
    "/property-form.html": "/host/properties/new",
    "/admin-properties.html": "/admin/properties",
  };
  return map[path] ?? null;
}
