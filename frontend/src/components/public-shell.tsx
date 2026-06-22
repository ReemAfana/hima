import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, FileText, Home, LogOut, Menu, MessageSquare, Search, User, UserPlus, X } from "lucide-react";
import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { roleLabels } from "@/lib/labels";
import { fullName } from "@/lib/utils";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader onOpenMenu={() => setOpen(true)} />
      <SideMenu open={open} onClose={() => setOpen(false)} />
      <main className="pt-16">{children}</main>
    </div>
  );
}

function PublicHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b bg-primary text-primary-foreground shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-2xl font-black">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
            <Home className="h-5 w-5" />
          </span>
          حِمى
        </Link>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/15" onClick={onOpenMenu} aria-label="فتح القائمة">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}

function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { token, role, user, clearAuth } = useAuthStore();

  async function logout() {
    try {
      if (token) await authApi.logout();
    } catch {
      // Keep local logout reliable.
    } finally {
      clearAuth();
      onClose();
      navigate("/");
    }
  }

  function go(path: string) {
    onClose();
    navigate(path);
  }

  return (
    <>
      {open && <button className="fixed inset-0 z-50 bg-black/45" aria-label="إغلاق القائمة" onClick={onClose} />}
      <aside
        className={`fixed bottom-0 right-0 top-0 z-50 w-80 max-w-[88vw] bg-primary p-6 text-primary-foreground shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-black">
            <Building2 className="h-8 w-8" />
            حِمى
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/15" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {token && (
          <div className="mb-5 rounded-lg bg-white/10 p-4">
            <div className="font-extrabold">{fullName(user)}</div>
            <div className="text-sm font-bold text-green-100">{role ? roleLabels[role] : ""}</div>
          </div>
        )}

        <nav className="grid gap-2">
          {!token && (
            <>
              <MenuItem icon={User} label="تسجيل الدخول / إنشاء حساب" onClick={() => go("/login")} />
              <MenuItem icon={UserPlus} label="كن مضيفاً" onClick={() => go("/become-host")} />
            </>
          )}
          {token && role === "host" && <MenuItem icon={Building2} label="لوحة المضيف" onClick={() => go("/dashboard/host")} />}
          {token && role === "admin" && <MenuItem icon={Building2} label="لوحة المشرف" onClick={() => go("/dashboard/admin")} />}
          {token && role === "tenant" && <MenuItem icon={User} label="لوحة المستأجر" onClick={() => go("/dashboard/tenant")} />}
          <div className="my-3 border-t border-white/20" />
          <MenuItem icon={Home} label="الرئيسية" onClick={() => go("/")} />
          <MenuItem icon={Search} label="أحدث العقارات والبحث" onClick={() => go("/search")} />
          {token && <MenuItem icon={MessageSquare} label="الرسائل" onClick={() => go("/messages")} />}
          <MenuItem icon={FileText} label="السياسات والإرشادات" onClick={() => go("/policies")} />
          {token && <MenuItem icon={LogOut} label="تسجيل الخروج" onClick={logout} />}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-lg bg-white/10 p-4">
          <div className="text-sm font-extrabold">تحتاج مساعدة؟</div>
          <div className="text-sm text-green-100">فريق الدعم جاهز لمساعدتك.</div>
        </div>
      </aside>
    </>
  );
}

function MenuItem({ icon: Icon, label, onClick }: { icon: typeof Home; label: string; onClick: () => void }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-right font-bold text-white transition-colors hover:bg-white/15" onClick={onClick}>
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}
