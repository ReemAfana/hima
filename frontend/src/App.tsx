import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import { GuestOnly, ProtectedRoute } from "@/components/guards";
import { AdminPropertiesPage } from "@/pages/admin-properties-page";
import { BecomeHostPage, CompleteProfilePage, ForgotPasswordPage, LoginPage, RegisterPage, ResetPasswordPage } from "@/pages/auth-pages";
import { BookingPage } from "@/pages/booking-page";
import { AdminDashboardPage, HostDashboardPage, TenantDashboardPage } from "@/pages/dashboard-pages";
import { HomePage } from "@/pages/home-page";
import { HostPreviewPage } from "@/pages/host-preview-page";
import { HostPropertiesPage } from "@/pages/host-properties-page";
import { MessagesPage } from "@/pages/messages-page";
import { PoliciesPage } from "@/pages/policies-page";
import { PropertyDetailsPage } from "@/pages/property-details-page";
import { PropertyFormPage } from "@/pages/property-form-page";
import { SearchPage } from "@/pages/search-page";
import { legacyPath } from "@/lib/utils";
import { dashboardForRole, useAuthStore } from "@/stores/auth-store";
import type { Role } from "@/types/api";

export const routes = [
  {
    element: <GuestOnly />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/become-host", element: <BecomeHostPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
    ],
  },
  {
    element: <ProtectedRoute requireCompleteProfile={false} />,
    children: [{ path: "/complete-profile", element: <CompleteProfilePage /> }],
  },
  { path: "/", element: <HomePage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/host-preview", element: <HostPreviewPage /> },
  { path: "/properties", element: <SearchPage /> },
  { path: "/properties/:id", element: <PropertyDetailsPage /> },
  { path: "/policies", element: <PoliciesPage /> },
  {
    element: <ProtectedRoute roles={["tenant"]} />,
    children: [{ path: "/properties/:id/book", element: <BookingPage /> }],
  },
  {
    element: <ProtectedRoute roles={["admin", "host", "tenant"]} />,
    children: [{ path: "/messages", element: <MessagesPage /> }],
  },
  {
    element: <ProtectedRoute roles={["admin", "host", "tenant"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard/admin", element: <RoleOutlet roles={["admin"]}><AdminDashboardPage /></RoleOutlet> },
          { path: "/dashboard/host", element: <RoleOutlet roles={["host"]}><HostDashboardPage /></RoleOutlet> },
          { path: "/dashboard/tenant", element: <RoleOutlet roles={["tenant"]}><TenantDashboardPage /></RoleOutlet> },
          { path: "/admin/properties", element: <RoleOutlet roles={["admin"]}><AdminPropertiesPage /></RoleOutlet> },
          { path: "/host/properties", element: <RoleOutlet roles={["host"]}><HostPropertiesPage /></RoleOutlet> },
          { path: "/host/properties/new", element: <RoleOutlet roles={["host"]}><PropertyFormPage /></RoleOutlet> },
          { path: "/host/properties/:id/edit", element: <RoleOutlet roles={["host"]}><PropertyFormPage /></RoleOutlet> },
        ],
      },
    ],
  },
  { path: "*", element: <LegacyRedirect /> },
];

function RoleOutlet({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const role = useAuthStore((state) => state.role);
  if (!role || !roles.includes(role)) return <Navigate to={dashboardForRole(role)} replace />;
  return children;
}

function LegacyRedirect() {
  const location = useLocation();
  const [search] = useSearchParams();
  const target = legacyPath(location.pathname);
  if (target) {
    if (location.pathname === "/property-details.html") {
      const id = search.get("id");
      return <Navigate to={id ? `/properties/${id}` : "/properties"} replace />;
    }
    if (location.pathname === "/booking-form.html") {
      const id = search.get("id");
      return <Navigate to={id ? `/properties/${id}/book` : "/properties"} replace />;
    }
    if (location.pathname === "/property-form.html") {
      const id = search.get("id");
      return <Navigate to={id ? `/host/properties/${id}/edit` : "/host/properties/new"} replace />;
    }
    return <Navigate to={target} replace />;
  }
  return <Navigate to="/" replace />;
}
