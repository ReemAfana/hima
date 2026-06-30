import { Navigate, Outlet, useLocation } from "react-router-dom";
import { dashboardForRole, useAuthStore } from "@/stores/auth-store";
import type { Role } from "@/types/api";

export function GuestOnly() {
  const { token, role, isProfileComplete } = useAuthStore();
  if (token) {
    return <Navigate to={isProfileComplete ? dashboardForRole(role) : "/complete-profile"} replace />;
  }
  return <Outlet />;
}

export function ProtectedRoute({ roles, requireCompleteProfile = true }: { roles?: Role[]; requireCompleteProfile?: boolean }) {
  const location = useLocation();
  const { token, role, isProfileComplete, setRedirectAfterComplete } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (roles?.length && (!role || !roles.includes(role))) {
    return <Navigate to={dashboardForRole(role)} replace />;
  }

  if (requireCompleteProfile && !isProfileComplete) {
    setRedirectAfterComplete(location.pathname + location.search);
    return <Navigate to="/complete-profile" replace />;
  }

  return <Outlet />;
}
