import { useState } from "react";
import { Send, User } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const conversations = [
  { id: "1", name: "أحمد حسن", lastMessage: "نعم، الشقة ما زالت متاحة", time: "10:30", unread: 2 },
  { id: "2", name: "سارة محمد", lastMessage: "شكراً لاهتمامك", time: "أمس", unread: 0 },
  { id: "3", name: "خالد عمر", lastMessage: "هل يمكن ترتيب موعد للمعاينة؟", time: "14 ديسمبر", unread: 1 },
];

const messages = {
  "1": [
    { id: "1", sender: "other", text: "مرحباً! رأيت استفسارك عن الشقة في الرمال.", time: "10:15" },
    { id: "2", sender: "user", text: "نعم، أنا مهتم جداً. هل ما زالت متاحة؟", time: "10:20" },
    { id: "3", sender: "other", text: "نعم، الشقة ما زالت متاحة.", time: "10:30" },
    { id: "4", sender: "other", text: "هل ترغب في ترتيب موعد للمعاينة؟", time: "10:30" },
  ],
  "2": [
    { id: "1", sender: "user", text: "مرحباً، أنا مهتم بالمنزل المكون من غرفتين.", time: "09:00" },
    { id: "2", sender: "other", text: "شكراً لاهتمامك.", time: "09:15" },
  ],
  "3": [{ id: "1", sender: "other", text: "هل يمكن ترتيب موعد للمعاينة؟", time: "14:00" }],
} as const;

export function MessagesPage() {
  const [selected, setSelected] = useState<keyof typeof messages>("1");
  const [text, setText] = useState("");

  function send() {
    if (text.trim()) setText("");
  }

  return (
    <PublicShell>
      <div className="page-container h-[calc(100vh-4rem)]">
        <div className="grid h-full gap-4 md:grid-cols-[330px_1fr]">
          <Card className="overflow-hidden">
            <div className="h-full overflow-y-auto p-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`mb-2 flex w-full items-start gap-3 rounded-lg p-4 text-right transition-colors ${
                    selected === conversation.id ? "border border-primary bg-accent" : "hover:bg-secondary"
                  }`}
                  onClick={() => setSelected(conversation.id as keyof typeof messages)}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mb-1 flex items-center justify-between gap-2">
                      <span className="truncate font-extrabold">{conversation.name}</span>
                      <span className="text-xs font-bold text-muted-foreground">{conversation.time}</span>
                    </span>
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-muted-foreground">{conversation.lastMessage}</span>
                      {conversation.unread > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">{conversation.unread}</span>}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="flex min-h-0 flex-col overflow-hidden">
            <div className="border-b p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-extrabold">{conversations.find((item) => item.id === selected)?.name}</div>
                  <div className="text-sm font-bold text-muted-foreground">نشط الآن</div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid gap-4">
                {messages[selected].map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[75%] rounded-lg px-4 py-2 ${message.sender === "user" ? "bg-primary text-white" : "bg-secondary text-foreground"}`}>
                      <p className="font-semibold">{message.text}</p>
                      <p className={`mt-1 text-xs ${message.sender === "user" ? "text-white/75" : "text-muted-foreground"}`}>{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input placeholder="اكتب رسالتك..." value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} />
                <Button size="icon" onClick={send}><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PublicShell>
  );
}
