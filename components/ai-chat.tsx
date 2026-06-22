"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Sparkles, Minimize2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING = `Сәлем! 👋 Мен Qadam AI кеңесшісіңіз.

**Qadam** — сіздің жеке қаржылық серіктесіңіз. Мен сізге:
• 💰 **Мақсат қою** — үй, көлік, бизнес жоспарлау
• 📈 **Инвестиция** — қайда салу, қалай бастау
• 🐷 **Жинақ** — ақша үнемдеу стратегиялары
• 📚 **Қаржылық білім** — мақалалар мен кеңестер

Қандай сұрақ бар? Сізге көмектесуге дайынмын! 😊`;

export function AIChat({ isFirstVisit }: { isFirstVisit?: boolean }) {
  const [open, setOpen] = useState(isFirstVisit ?? false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.slice(-10),
          userId: user?.id,
        }),
      });
      const data = await res.json() as { reply?: string; error?: string };
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply! }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Кешіріңіз, қате орын алды. Қайталап көріңіз." }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-4 lg:bottom-8 lg:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-primary-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-4 lg:bottom-8 lg:right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] flex flex-col rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-primary-600 text-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Qadam AI</p>
                <p className="text-xs text-white/70">Қаржы кеңесшісі</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-primary-600 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary-600 text-white rounded-br-sm"
                      : "bg-[var(--secondary)] text-[var(--foreground)] rounded-bl-sm"
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-primary-600 flex items-center justify-center shrink-0 mr-2">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-[var(--secondary)] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[var(--border)] shrink-0 flex gap-2">
            <input
              className="flex-1 px-3 py-2 rounded-xl bg-[var(--secondary)] border border-[var(--input)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] placeholder:text-[var(--muted-foreground)]"
              placeholder="Хабарлама жазыңыз..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            />
            <Button size="icon" onClick={sendMessage} disabled={loading || !input.trim()}
              className="shrink-0 bg-primary-600 hover:bg-primary-700 text-white rounded-xl">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
