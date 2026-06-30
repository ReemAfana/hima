import { AlertTriangle, DollarSign, FileText, Shield, Users } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const policies = [
  {
    icon: Shield,
    title: "دقة المعلومات",
    description: "على المضيفين تقديم معلومات صحيحة عن العقارات، بما في ذلك الحالة الحالية والمرافق وأي أضرار ظاهرة. إخفاء حالة العقار قد يؤدي لإزالة الإعلان.",
  },
  {
    icon: AlertTriangle,
    title: "مسؤولية الأضرار",
    description: "المستأجر مسؤول عن الأضرار الجديدة خلال فترة السكن، بينما يجب توثيق الأضرار السابقة بالصور قبل الانتقال.",
  },
  {
    icon: DollarSign,
    title: "مبلغ التأمين",
    description: "يمكن للمضيف طلب تأمين يعادل شهراً واحداً. يعاد التأمين بعد الخروج مع خصم أي أضرار موثقة فقط.",
  },
  {
    icon: FileText,
    title: "سياسة الإلغاء",
    description: "تختلف شروط الإلغاء حسب الاتفاق بين الطرفين، وينبغي توضيحها قبل اعتماد الحجز وإنشاء العقد.",
  },
  {
    icon: Users,
    title: "الاستخدام العادل",
    description: "تستخدم العقارات للأغراض السكنية القانونية فقط، ولا يسمح بالتأجير من الباطن دون موافقة المضيف.",
  },
];

export function PoliciesPage() {
  return (
    <PublicShell>
      <div className="page-container max-w-4xl">
        <Card className="mb-6">
          <CardContent className="p-6">
            <h1 className="mb-4 text-3xl font-black text-primary">سياسات وإرشادات حِمى</h1>
            <p className="leading-8 text-muted-foreground">
              حِمى ملتزمة ببناء سوق إيجار آمن وشفاف وموثوق. هذه الإرشادات تساعد المضيفين والمستأجرين على توثيق الحالة، الاتفاق بوضوح، وحل النزاعات بشكل عادل.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-5">
          {policies.map((policy) => (
            <Card key={policy.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
                    <policy.icon className="h-6 w-6" />
                  </span>
                  {policy.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-8 text-muted-foreground">{policy.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 border-r-4 border-r-primary">
          <CardHeader><CardTitle>شروط إضافية</CardTitle></CardHeader>
          <CardContent className="grid gap-5 text-muted-foreground">
            <PolicyList title="الدفع" items={["دفع أول شهر ومبلغ التأمين قبل الانتقال عند الاتفاق.", "الالتزام بموعد الدفع الشهري.", "توثيق أي رسوم تأخير في العقد."]} />
            <PolicyList title="الصيانة" items={["المضيف مسؤول عن الإصلاحات الجوهرية.", "المستأجر مسؤول عن الاستخدام اليومي والمحافظة على العقار.", "الأعطال الطارئة يجب الإبلاغ عنها فوراً."]} />
            <PolicyList title="حل النزاعات" items={["يفضل حل الخلافات بالتواصل المباشر أولاً.", "الصور والمستندات مطلوبة لدعم أي مطالبة.", "يمكن طلب مساعدة الدعم عند تعذر الوصول لاتفاق."]} />
          </CardContent>
        </Card>

        <Card className="mt-6 bg-accent">
          <CardContent className="p-6 text-center">
            <h2 className="mb-2 text-xl font-black text-primary">لديك سؤال عن السياسات؟</h2>
            <p className="mb-4 font-semibold text-muted-foreground">فريق الدعم يساعدك في توضيح أي بند أو إجراء.</p>
            <Button>تواصل مع الدعم</Button>
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}

function PolicyList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-2 font-extrabold text-foreground">{title}</h3>
      <ul className="grid gap-2">
        {items.map((item) => <li key={item} className="flex gap-2"><span className="text-primary">•</span>{item}</li>)}
      </ul>
    </div>
  );
}
