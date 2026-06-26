import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Building2, FileText, Heart, Home, LayoutDashboard, LogOut, Plus, ShieldCheck, UserRound } from "lucide-react";
import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { roleLabels } from "@/lib/labels";
import { cn, fullName } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const navByRole = {
  admin: [
    { to: "/dashboard/admin", label: "لوحة التحكم", icon: LayoutDashboard },
    { to: "/admin/properties", label: "مراجعة العقارات", icon: ShieldCheck },
  ],
  host: [
    { to: "/dashboard/host", label: "لوحة التحكم", icon: LayoutDashboard },
    { to: "/host/properties", label: "عقاراتي", icon: Building2 },
    { to: "/host/properties/new", label: "إضافة عقار", icon: Plus },
  ],
  tenant: [
    { to: "/dashboard/tenant", label: "لوحة التحكم", icon: LayoutDashboard },
    { to: "/properties", label: "استكشف العقارات", icon: Home },
    { to: "/dashboard/tenant", label: "حجوزاتي", icon: FileText },
    { to: "/properties", label: "المفضلة", icon: Heart },
  ],
};

export function DashboardLayout() {
  const navigate = useNavigate();
  const { role, user, token, clearAuth } = useAuthStore();
  const navItems = role ? navByRole[role] : [];

  async function handleLogout() {
    try {
      if (token) await authApi.logout();
    } catch {
      // Keep client logout reliable even if API logout fails.
    } finally {
      clearAuth();
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="bg-primary p-4 text-primary-foreground lg:min-h-screen">
        <div className="flex items-center gap-3 border-b border-white/10 pb-5 text-2xl font-black">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-primary">
            <Home className="h-5 w-5" />
          </span>
          <div>
            حِمى
            <div className="text-xs font-bold text-green-100">منصة إدارة السكن</div>
          </div>
        </div>
        <div className="my-5 rounded-lg bg-white/10 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <div className="font-extrabold">{fullName(user)}</div>
              <div className="text-xs font-bold text-green-100">{role ? roleLabels[role] : ""}</div>
            </div>
          </div>
        </div>
        <nav className="grid gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to + item.label}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold text-green-100 transition-colors hover:bg-white/10 hover:text-white",
                  isActive && "bg-white text-primary hover:bg-white hover:text-primary",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Button variant="ghost" className="mt-5 w-full justify-start text-green-100 hover:bg-white/10 hover:text-white" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
