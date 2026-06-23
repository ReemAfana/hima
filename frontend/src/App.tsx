import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import { GuestOnly, ProtectedRoute } from "@/components/guards";
import { AdminPropertiesPage } from "@/pages/admin-properties-page";
import { BecomeHostPage, CompleteProfilePage, ForgotPasswordPage, LoginPage, RegisterPage, ResetPasswordPage } from "@/pages/auth-pages";
import { BookingPage } from "@/pages/booking-page";
import { AdminDashboardPage, HostDashboardPage, TenantDashboardPage } from "@/pages/dashboard-pages";
import { HomePage } from "@/pages/home-page";
import { HostPreviewPage } from "@/pages/host-preview-page";
import {
  HostPreviewContractDetailsPage,
  HostPreviewContractsPage,
  HostPreviewNotificationsPage,
  HostPreviewRequestDetailsPage,
  HostPreviewRequestsPage,
} from "@/pages/host-preview-workflow-pages";
import { HostPropertiesPage } from "@/pages/host-properties-page";
import { MessagesPage } from "@/pages/messages-page";
import { PoliciesPage } from "@/pages/policies-page";
import { PropertyDetailsPage } from "@/pages/property-details-page";
import { PropertyFormPage } from "@/pages/property-form-page";
import { SearchPage } from "@/pages/search-page";
import { TenantContractsPage, TenantNotificationsPage, TenantRequestsPage } from "@/pages/tenant-workflow-pages";
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
  { path: "/tenant-preview", element: <HomePage tenantPreview /> },
  { path: "/tenant-preview/properties/:id", element: <PropertyDetailsPage tenantPreview /> },
  { path: "/tenant-preview/properties/:id/book", element: <BookingPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/host-preview", element: <HostPreviewPage /> },
  { path: "/host-preview/properties/new", element: <PropertyFormPage previewMode /> },
  { path: "/host-preview/properties/:id", element: <PropertyDetailsPage ownerMode /> },
  { path: "/host-preview/properties/:id/edit", element: <PropertyFormPage previewMode /> },
  { path: "/host-preview/requests", element: <HostPreviewRequestsPage /> },
  { path: "/host-preview/requests/:id", element: <HostPreviewRequestDetailsPage /> },
  { path: "/host-preview/notifications", element: <HostPreviewNotificationsPage /> },
  { path: "/host-preview/contracts", element: <HostPreviewContractsPage /> },
  { path: "/host-preview/contracts/:id", element: <HostPreviewContractDetailsPage /> },
  { path: "/properties", element: <SearchPage /> },
  { path: "/properties/:id", element: <PropertyDetailsPage /> },
  { path: "/policies", element: <PoliciesPage /> },
  { path: "/tenant-preview/requests", element: <TenantRequestsPage /> },
  { path: "/tenant-preview/contracts", element: <TenantContractsPage /> },
  { path: "/tenant-preview/notifications", element: <TenantNotificationsPage /> },
  {
    element: <ProtectedRoute roles={["tenant"]} />,
    children: [
      { path: "/properties/:id/book", element: <BookingPage /> },
      { path: "/tenant/requests", element: <TenantRequestsPage /> },
      { path: "/tenant/contracts", element: <TenantContractsPage /> },
      { path: "/tenant/notifications", element: <TenantNotificationsPage /> },
    ],
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
