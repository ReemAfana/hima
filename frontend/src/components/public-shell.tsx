import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Building2, ClipboardList, FileSignature, FileText, Home, LogOut, Menu, MessageSquare, Search, User, UserPlus, X } from "lucide-react";
import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { roleLabels } from "@/lib/labels";
import { fullName } from "@/lib/utils";

type ShellMode = "public" | "host-preview" | "tenant-preview";

export function PublicShell({ children, mode = "public" }: { children: React.ReactNode; mode?: ShellMode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const inferredMode = location.pathname.startsWith("/tenant-preview") ? "tenant-preview" : location.pathname.startsWith("/host-preview") ? "host-preview" : mode;
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader onOpenMenu={() => setOpen(true)} />
      <SideMenu open={open} onClose={() => setOpen(false)} mode={inferredMode} />
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

function SideMenu({ open, onClose, mode }: { open: boolean; onClose: () => void; mode: ShellMode }) {
  const navigate = useNavigate();
  const { token, role, user, clearAuth } = useAuthStore();
  const isHostPreview = mode === "host-preview";
  const isTenantPreview = mode === "tenant-preview";

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

  function previewLogout() {
    clearAuth();
    onClose();
    navigate("/");
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

        {(token || isHostPreview || isTenantPreview) && (
          <div className="mb-5 rounded-lg bg-white/10 p-4">
            <div className="font-extrabold">{isHostPreview ? "مضيف حِمى التجريبي" : isTenantPreview ? "مستأجر حِمى التجريبي" : fullName(user)}</div>
            <div className="text-sm font-bold text-green-100">{isHostPreview ? roleLabels.host : isTenantPreview ? roleLabels.tenant : role ? roleLabels[role] : ""}</div>
          </div>
        )}

        <nav className="grid gap-2">
          {isHostPreview && (
            <>
              <MenuItem icon={Building2} label="لوحة المضيف" onClick={() => go("/host-preview")} />
              <MenuItem icon={Home} label="عقاراتي" onClick={() => go("/host-preview")} />
              <MenuItem icon={ClipboardList} label="طلباتي" onClick={() => go("/host-preview/requests")} />
              <MenuItem icon={Bell} label="الإشعارات" onClick={() => go("/host-preview/notifications")} />
              <MenuItem icon={FileSignature} label="عقودي" onClick={() => go("/host-preview/contracts")} />
            </>
          )}
          {isTenantPreview && (
            <>
              <MenuItem icon={User} label="لوحة المستأجر" onClick={() => go("/tenant-preview")} />
              <MenuItem icon={ClipboardList} label="طلباتي" onClick={() => go("/tenant-preview/requests")} />
              <MenuItem icon={FileSignature} label="عقودي" onClick={() => go("/tenant-preview/contracts")} />
              <MenuItem icon={Bell} label="اشعاراتي" onClick={() => go("/tenant-preview/notifications")} />
            </>
          )}
          {!token && !isHostPreview && !isTenantPreview && (
            <>
              <MenuItem icon={User} label="تسجيل الدخول / إنشاء حساب" onClick={() => go("/login")} />
              <MenuItem icon={UserPlus} label="كن مضيفاً" onClick={() => go("/become-host")} />
              <MenuItem icon={User} label="معاينة وضع المستأجر" onClick={() => go("/tenant-preview")} />
              <MenuItem icon={Building2} label="معاينة وضع المضيف" onClick={() => go("/host-preview")} />
            </>
          )}
          {!isHostPreview && !isTenantPreview && token && role === "host" && <MenuItem icon={Building2} label="لوحة المضيف" onClick={() => go("/dashboard/host")} />}
          {!isHostPreview && !isTenantPreview && token && role === "admin" && <MenuItem icon={Building2} label="لوحة المشرف" onClick={() => go("/dashboard/admin")} />}
          {!isHostPreview && !isTenantPreview && token && role === "tenant" && (
            <>
              <MenuItem icon={User} label="لوحة المستأجر" onClick={() => go("/dashboard/tenant")} />
              <MenuItem icon={ClipboardList} label="طلباتي" onClick={() => go("/tenant/requests")} />
              <MenuItem icon={FileSignature} label="عقودي" onClick={() => go("/tenant/contracts")} />
              <MenuItem icon={Bell} label="اشعاراتي" onClick={() => go("/tenant/notifications")} />
            </>
          )}
          <div className="my-3 border-t border-white/20" />
          <MenuItem icon={Home} label="الرئيسية" onClick={() => go(isTenantPreview ? "/tenant-preview" : "/")} />
          {!isHostPreview && <MenuItem icon={Search} label="أحدث العقارات والبحث" onClick={() => go("/search")} />}
          {!isHostPreview && !isTenantPreview && token && <MenuItem icon={MessageSquare} label="الرسائل" onClick={() => go("/messages")} />}
          <MenuItem icon={FileText} label="السياسات والإرشادات" onClick={() => go("/policies")} />
          {isHostPreview && <MenuItem icon={LogOut} label="تسجيل الخروج" onClick={previewLogout} />}
          {isTenantPreview && <MenuItem icon={LogOut} label="تسجيل الخروج" onClick={previewLogout} />}
          {!isHostPreview && token && <MenuItem icon={LogOut} label="تسجيل الخروج" onClick={logout} />}
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
