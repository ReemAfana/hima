import { Link, useNavigate } from "react-router-dom";
import { Home, LogOut } from "lucide-react";
import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { roleLabels } from "@/lib/labels";
import { fullName } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

export function AppNavbar() {
  const navigate = useNavigate();
  const { user, role, token, clearAuth } = useAuthStore();

  async function handleLogout() {
    try {
      if (token) await authApi.logout();
    } catch {
      // Logout should still clear local session if the server is unreachable.
    } finally {
      clearAuth();
      navigate("/login", { replace: true });
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-card shadow-sm">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/properties" className="flex items-center gap-3 text-2xl font-black text-primary">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Home className="h-5 w-5" />
          </span>
          حِمى
        </Link>
        <div className="flex items-center gap-3">
          {role && (
            <span className="hidden text-sm font-bold text-muted-foreground sm:block">
              {fullName(user)} - {roleLabels[role]}
            </span>
          )}
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </header>
  );
}
