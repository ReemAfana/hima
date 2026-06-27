import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Building2, Home, Lock, Mail, User, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardForRole, useAuthStore } from "@/stores/auth-store";
import type { Role } from "@/types/api";

function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Home className="h-7 w-7" />
          </div>
          <div className="text-3xl font-black text-primary">حِمى</div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

function AuthNotice({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Building2;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-primary/15 bg-accent p-4">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <div className="font-extrabold text-primary">{title}</div>
          <div className="mt-1 text-sm font-semibold text-muted-foreground">{text}</div>
        </div>
      </div>
    </div>
  );
}

function IconInput({
  icon: Icon,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  icon: typeof Mail;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Icon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
      <Input className="pr-10" type={type} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} required />
    </div>
  );
}

export function LoginPage() {
  return <LoginSignupPage mode="tenant" />;
}

export function BecomeHostPage() {
  return <LoginSignupPage mode="host" />;
}

function LoginSignupPage({ mode }: { mode: Extract<Role, "tenant" | "host"> }) {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState({ first_name: "", email: "", password: "", password_confirmation: "" });
  const isHost = mode === "host";

  useEffect(() => {
    if (search.get("verified") === "success") toast.success("تم تفعيل حسابك! يمكنك الآن تسجيل الدخول");
    if (search.get("verified") === "already") toast.success("حسابك مفعّل مسبقاً");
    if (search.get("error") === "invalid_link") toast.error("رابط التفعيل غير صالح أو منتهي الصلاحية");
  }, [search]);

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data);
      navigate(data.is_profile_complete ? dashboardForRole(data.role) : "/complete-profile", { replace: true });
    },
    onError: () => toast.error("بيانات غير صحيحة أو الحساب غير مفعّل"),
  });

  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success("تم إنشاء الحساب. تحقق من بريدك الإلكتروني للتفعيل");
      setTimeout(() => navigate("/login"), 1200);
    },
    onError: () => toast.error("تعذر إنشاء الحساب. تأكد من البيانات المدخلة"),
  });

  return (
    <AuthCard title={isHost ? "مرحباً بالمضيفين" : "مرحباً بك في حِمى"}>
      <Tabs defaultValue="login">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
          <TabsTrigger value="signup">{isHost ? "كن مضيفاً" : "إنشاء حساب"}</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              login.mutate({ email, password });
            }}
          >
            <AuthNotice
              icon={isHost ? Building2 : UserCircle}
              title={isHost ? "دخول المضيف" : "دخول المستأجر"}
              text={isHost ? "سجّل الدخول لإدارة عقاراتك وطلبات الحجز." : "سجّل الدخول لحجز العقارات ومتابعة طلباتك."}
            />
            <IconInput icon={Mail} type="email" placeholder="البريد الإلكتروني" value={email} onChange={setEmail} />
            <IconInput icon={Lock} type="password" placeholder="كلمة المرور" value={password} onChange={setPassword} />
            <Button disabled={login.isPending}>{login.isPending ? "جار تسجيل الدخول..." : isHost ? "الدخول للوحة المضيف" : "تسجيل الدخول"}</Button>
            <Link className="text-center text-sm font-bold text-primary hover:underline" to="/forgot-password">
              نسيت كلمة المرور؟
            </Link>
          </form>
        </TabsContent>
        <TabsContent value="signup">
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              register.mutate({ ...signup, role: mode });
            }}
          >
            <AuthNotice
              icon={isHost ? Building2 : UserCircle}
              title={isHost ? "أضف عقارك على حِمى" : "أنشئ حساب مستأجر"}
              text={isHost ? "انضم للمضيفين وساعد العائلات في العثور على سكن واضح وآمن." : "أنشئ حساباً لتصفح العقارات وحفظ المفضلة وإرسال طلبات الحجز."}
            />
            <IconInput icon={User} placeholder="الاسم الأول" value={signup.first_name} onChange={(value) => setSignup({ ...signup, first_name: value })} />
            <IconInput icon={Mail} type="email" placeholder="البريد الإلكتروني" value={signup.email} onChange={(value) => setSignup({ ...signup, email: value })} />
            <IconInput icon={Lock} type="password" placeholder="كلمة المرور" value={signup.password} onChange={(value) => setSignup({ ...signup, password: value })} />
            <IconInput icon={Lock} type="password" placeholder="تأكيد كلمة المرور" value={signup.password_confirmation} onChange={(value) => setSignup({ ...signup, password_confirmation: value })} />
            {isHost && (
              <div className="rounded-lg bg-accent p-4 text-sm font-bold leading-7 text-muted-foreground">
                ✓ أضف عقارات غير محدودة<br />
                ✓ تابع طلبات الحجز<br />
                ✓ تواصل مع مستأجرين موثقين<br />
                ✓ اعرض حالة العقار بشفافية
              </div>
            )}
            <Button disabled={register.isPending}>{register.isPending ? "جار إنشاء الحساب..." : isHost ? "إنشاء حساب مضيف" : "إنشاء حساب مستأجر"}</Button>
            <p className="text-center text-sm font-semibold text-muted-foreground">بإنشاء الحساب أنت توافق على الشروط وسياسات الخصوصية.</p>
          </form>
        </TabsContent>
      </Tabs>
    </AuthCard>
  );
}

export function RegisterPage() {
  return <LoginSignupPage mode="tenant" />;
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => toast.success("تم إرسال رابط إعادة التعيين إلى بريدك"),
    onError: () => toast.error("تعذر إرسال الرابط"),
  });

  return (
    <AuthCard title="استعادة كلمة المرور">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate(email);
        }}
      >
        <Input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Button disabled={mutation.isPending}>إرسال رابط الاستعادة</Button>
        <Link className="text-center text-sm font-bold text-primary hover:underline" to="/login">
          العودة لتسجيل الدخول
        </Link>
      </form>
    </AuthCard>
  );
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const token = search.get("token") ?? "";
  const email = search.get("email") ?? "";

  const mutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success("تم تحديث كلمة المرور");
      navigate("/login");
    },
    onError: () => toast.error("تعذر تحديث كلمة المرور"),
  });

  useEffect(() => {
    if (!token || !email) navigate("/forgot-password", { replace: true });
  }, [email, navigate, token]);

  return (
    <AuthCard title="كلمة مرور جديدة">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate({ token, email, password, password_confirmation: passwordConfirmation });
        }}
      >
        <Input type="password" placeholder="كلمة المرور الجديدة" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
        <Input type="password" placeholder="تأكيد كلمة المرور" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} required minLength={8} />
        <Button disabled={mutation.isPending}>حفظ كلمة المرور</Button>
      </form>
    </AuthCard>
  );
}

export function CompleteProfilePage() {
  const navigate = useNavigate();
  const { redirectAfterComplete, role, setProfileComplete, setRedirectAfterComplete } = useAuthStore();
  const [form, setForm] = useState({ second_name: "", third_name: "", last_name: "", national_id: "", phone: "" });
  const mutation = useMutation({
    mutationFn: authApi.completeProfile,
    onSuccess: () => {
      setProfileComplete(true);
      toast.success("تم إكمال الملف الشخصي");
      const target = redirectAfterComplete || dashboardForRole(role);
      setRedirectAfterComplete(null);
      navigate(target, { replace: true });
    },
    onError: () => toast.error("تعذر حفظ بيانات الملف الشخصي"),
  });

  return (
    <AuthCard title="إكمال الملف الشخصي">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate(form);
        }}
      >
        <Label>بياناتك الأساسية</Label>
        <Input placeholder="اسم الأب" value={form.second_name} onChange={(event) => setForm({ ...form, second_name: event.target.value })} required />
        <Input placeholder="اسم الجد" value={form.third_name} onChange={(event) => setForm({ ...form, third_name: event.target.value })} required />
        <Input placeholder="اسم العائلة" value={form.last_name} onChange={(event) => setForm({ ...form, last_name: event.target.value })} required />
        <Input placeholder="رقم الهوية" value={form.national_id} onChange={(event) => setForm({ ...form, national_id: event.target.value })} required />
        <Input placeholder="رقم الهاتف" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
        <Button disabled={mutation.isPending}>حفظ البيانات</Button>
      </form>
    </AuthCard>
  );
}
