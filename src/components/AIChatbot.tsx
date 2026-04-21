import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, BrainCircuit, LifeBuoy, UserRound, Database } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { api } from "@/lib/api";

type Msg = { role: "user" | "assistant"; content: string };

type ChatResponse = {
  reply: string;
  provider?: string;
  matchedKnowledge?: Array<{ id: string; title: string; category: string }>;
};

const starterPrompts = [
  { icon: BrainCircuit, label: "Simple Q&A", prompt: "What can I do on Best Version?" },
  { icon: LifeBuoy, label: "Website support", prompt: "How do login, signup, and OTP work here?" },
  { icon: UserRound, label: "Personal help", prompt: "I am confused where to start. Suggest my first path." },
  { icon: Database, label: "Admin knowledge", prompt: "What can the admin panel track?" },
];

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hey! 👋 I can help with simple Q&A, website support, personal guidance, and admin knowledge. Ask me anything about Best Version.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [providerLabel, setProviderLabel] = useState("Knowledge mode");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = useCallback(
    async (preset?: string) => {
      const text = (preset ?? input).trim();
      if (!text || isLoading) return;

      if (!preset) setInput("");
      const userMsg: Msg = { role: "user", content: text };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setIsLoading(true);

      try {
        const data = await api<ChatResponse>("/chat", {
          method: "POST",
          body: JSON.stringify({ messages: nextMessages }),
        });

        const matched = data.matchedKnowledge?.length
          ? `\n\n**Using:** ${data.matchedKnowledge.map((item) => `${item.title} (${item.category})`).join(", ")}`
          : "";

        setProviderLabel(data.provider === "gemini" ? "Gemini + knowledge" : "Knowledge mode");
        setMessages((prev) => [...prev, { role: "assistant", content: `${data.reply}${matched}` }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ I could not reach the backend chat service. Please check if the backend server is running.",
          },
        ]);
      }

      setIsLoading(false);
    },
    [input, isLoading, messages]
  );

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 glow-sm"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[560px] max-h-[calc(100vh-8rem)] w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl"
          >
            <div className="border-b border-border/50 bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
                  <Sparkles size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-sm font-semibold text-foreground">Best Version AI</h3>
                  <p className="text-xs text-muted-foreground">{providerLabel}</p>
                </div>
                <button onClick={() => setOpen(false)} className="text-muted-foreground transition-colors hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {starterPrompts.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => void sendMessage(item.prompt)}
                      disabled={isLoading}
                      className="rounded-2xl border border-border/60 bg-background/50 px-3 py-2 text-left transition hover:border-primary/40 hover:bg-background disabled:opacity-60"
                    >
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon size={15} />
                      </div>
                      <div className="text-xs font-semibold text-foreground">{item.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-background/50 p-4">
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-secondary/20" : "bg-primary/20"}`}>
                    {m.role === "user" ? <User size={14} className="text-secondary" /> : <Bot size={14} className="text-primary" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "rounded-tr-md bg-primary text-primary-foreground" : "rounded-tl-md bg-muted/60 text-foreground"}`}>
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:mb-1 [&_p:last-child]:mb-0 [&_ul]:my-1 [&_li]:my-0">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20">
                    <Bot size={14} className="text-primary" />
                  </div>
                  <div className="rounded-2xl rounded-tl-md bg-muted/60 px-4 py-3">
                    <Loader2 size={16} className="animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border/50 bg-card p-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void sendMessage()}
                  placeholder="Ask about login, support, careers, or admin..."
                  className="flex-1 rounded-xl border border-border/50 bg-muted/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <button
                  onClick={() => void sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
