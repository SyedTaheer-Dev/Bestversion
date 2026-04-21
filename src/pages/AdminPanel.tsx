import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BadgeCheck,
  BrainCircuit,
  Loader2,
  Mail,
  Pencil,
  Plus,
  Shield,
  Smartphone,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";
import PageLayout from "@/components/PageLayout";
import { AdminAuthEvent, AdminKnowledgeEntry, AdminRecentUser, AdminSummary } from "@/types/app";

const statCards = [
  { key: "totalUsers", label: "Total users", icon: Users },
  { key: "recentSignups", label: "Signups (7d)", icon: UserPlus },
  { key: "recentLogins", label: "Logins (24h)", icon: Activity },
  { key: "adminUsers", label: "Admin accounts", icon: Shield },
  { key: "emailUsers", label: "Email users", icon: Mail },
  { key: "phoneUsers", label: "Phone users", icon: Smartphone },
  { key: "knowledgeEntries", label: "Knowledge entries", icon: BrainCircuit },
] as const;

type AdminOverviewResponse = {
  summary: AdminSummary;
  recentUsers: AdminRecentUser[];
  recentEvents: AdminAuthEvent[];
  knowledgeBase: AdminKnowledgeEntry[];
};

type KnowledgeFormState = {
  id?: string;
  title: string;
  category: AdminKnowledgeEntry["category"];
  keywords: string;
  content: string;
  priority: number;
  isPublished: boolean;
};

const blankForm: KnowledgeFormState = {
  title: "",
  category: "support",
  keywords: "",
  content: "",
  priority: 50,
  isPublished: true,
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
};

const toFormState = (entry: AdminKnowledgeEntry): KnowledgeFormState => ({
  id: entry.id,
  title: entry.title,
  category: entry.category,
  keywords: entry.keywords.join(", "),
  content: entry.content,
  priority: entry.priority,
  isPublished: entry.isPublished,
});

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingKnowledge, setSavingKnowledge] = useState(false);
  const [data, setData] = useState<AdminOverviewResponse | null>(null);
  const [form, setForm] = useState<KnowledgeFormState>(blankForm);

  const load = async () => {
    try {
      setError(null);
      const response = await api<AdminOverviewResponse>("/admin/overview", { auth: true });
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admin panel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const knowledgeEntries = useMemo(() => data?.knowledgeBase || [], [data]);

  const handleKnowledgeSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError("Knowledge title and content are required.");
      return;
    }

    setSavingKnowledge(true);
    setError(null);

    try {
      const payload = {
        title: form.title,
        category: form.category,
        keywords: form.keywords,
        content: form.content,
        priority: form.priority,
        isPublished: form.isPublished,
      };

      if (form.id) {
        await api(`/admin/knowledge-base/${form.id}`, {
          method: "PUT",
          auth: true,
          body: JSON.stringify(payload),
        });
      } else {
        await api("/admin/knowledge-base", {
          method: "POST",
          auth: true,
          body: JSON.stringify(payload),
        });
      }

      setForm(blankForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save knowledge entry");
    } finally {
      setSavingKnowledge(false);
    }
  };

  const handleDeleteKnowledge = async (id: string) => {
    const ok = window.confirm("Delete this knowledge entry?");
    if (!ok) return;

    setSavingKnowledge(true);
    setError(null);

    try {
      await api(`/admin/knowledge-base/${id}`, {
        method: "DELETE",
        auth: true,
      });
      if (form.id === id) setForm(blankForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete knowledge entry");
    } finally {
      setSavingKnowledge(false);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[30px] border border-border/60 bg-card/75 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.18)] backdrop-blur-2xl md:p-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <Shield size={14} /> Admin panel
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold gradient-text md:text-4xl">Users, auth activity, and bot knowledge</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Track who signed up, who logged in, which auth method they used, and manage the chatbot knowledge base that powers website answers.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 rounded-full border border-border/60 bg-card/70 px-5 py-3 text-sm text-muted-foreground shadow-lg backdrop-blur-xl">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Loading admin overview...
            </div>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">{error}</div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-7">
              {statCards.map((card, index) => {
                const Icon = card.icon;
                const value = data.summary[card.key];
                return (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl border border-border/60 bg-card/75 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{value}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{card.label}</div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-[28px] border border-border/60 bg-card/75 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">Recent users</h2>
                    <p className="text-sm text-muted-foreground">Latest accounts with their most recent auth method.</p>
                  </div>
                  <div className="rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                    {data.recentUsers.length} records
                  </div>
                </div>
                <div className="space-y-3">
                  {data.recentUsers.map((user) => (
                    <div key={user.id} className="grid gap-2 rounded-2xl border border-border/50 bg-background/40 p-4 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center">
                      <div>
                        <div className="font-semibold text-foreground">{user.fullName || "Best Version Member"}</div>
                        <div className="text-xs text-muted-foreground">{user.email || user.phone || "No identifier"}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Providers</div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {user.authProviders.map((provider) => (
                            <span key={provider} className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] text-primary">
                              {provider}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Last login</div>
                        <div className="mt-1 text-sm text-foreground">{formatDate(user.lastLoginAt)}</div>
                        <div className="text-xs text-muted-foreground">via {user.lastAuthMethod || "—"}</div>
                      </div>
                      <div className="rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-foreground">
                        {user.role}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-border/60 bg-card/75 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">Recent auth events</h2>
                    <p className="text-sm text-muted-foreground">Live log of signups, logins, and logout activity.</p>
                  </div>
                  <BadgeCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-3">
                  {data.recentEvents.map((event) => (
                    <div key={event.id} className="rounded-2xl border border-border/50 bg-background/40 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-foreground">{event.fullName || event.user?.fullName || "Best Version Member"}</div>
                          <div className="text-xs text-muted-foreground">{event.email || event.phone || event.user?.email || event.user?.phone || "No identifier"}</div>
                        </div>
                        <div className="flex gap-2">
                          <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] uppercase text-primary">{event.eventType}</span>
                          <span className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] uppercase text-foreground">{event.method}</span>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                        <div><span className="text-foreground">Time:</span> {formatDate(event.createdAt)}</div>
                        <div><span className="text-foreground">IP:</span> {event.ipAddress || "—"}</div>
                        <div className="truncate"><span className="text-foreground">Agent:</span> {event.userAgent || "—"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[28px] border border-border/60 bg-card/75 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">Knowledge base editor</h2>
                    <p className="text-sm text-muted-foreground">Add answers the chatbot should use for support, personal guidance, and admin questions.</p>
                  </div>
                  <BrainCircuit className="h-5 w-5 text-primary" />
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted-foreground">Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full rounded-2xl border border-border/60 bg-background/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50"
                      placeholder="Ex: How phone OTP login works"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr_0.5fr]">
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted-foreground">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as KnowledgeFormState["category"] }))}
                        className="w-full rounded-2xl border border-border/60 bg-background/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50"
                      >
                        {(["general", "support", "personal", "admin", "platform"] as const).map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted-foreground">Keywords</label>
                      <input
                        value={form.keywords}
                        onChange={(e) => setForm((prev) => ({ ...prev, keywords: e.target.value }))}
                        className="w-full rounded-2xl border border-border/60 bg-background/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50"
                        placeholder="login, otp, dashboard"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted-foreground">Priority</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={form.priority}
                        onChange={(e) => setForm((prev) => ({ ...prev, priority: Number(e.target.value || 50) }))}
                        className="w-full rounded-2xl border border-border/60 bg-background/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted-foreground">Answer content</label>
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                      className="min-h-[180px] w-full rounded-3xl border border-border/60 bg-background/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50"
                      placeholder="Write the answer the chatbot should use."
                    />
                  </div>

                  <label className="inline-flex items-center gap-3 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                      className="h-4 w-4 rounded border-border/60 bg-background"
                    />
                    Published for chatbot answers
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => void handleKnowledgeSave()}
                      disabled={savingKnowledge}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_hsl(var(--primary)/0.28)] disabled:opacity-60"
                    >
                      {savingKnowledge ? <Loader2 className="h-4 w-4 animate-spin" /> : form.id ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {form.id ? "Update entry" : "Add entry"}
                    </button>
                    <button
                      onClick={() => setForm(blankForm)}
                      className="rounded-full border border-border/60 px-5 py-2.5 text-sm font-medium text-foreground"
                    >
                      Clear form
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-border/60 bg-card/75 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">Published knowledge entries</h2>
                    <p className="text-sm text-muted-foreground">These entries shape the answers the site assistant gives to users.</p>
                  </div>
                  <div className="rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                    {knowledgeEntries.length} entries
                  </div>
                </div>
                <div className="space-y-3 max-h-[740px] overflow-y-auto pr-1">
                  {knowledgeEntries.map((entry) => (
                    <div key={entry.id} className="rounded-2xl border border-border/50 bg-background/40 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-foreground">{entry.title}</div>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] uppercase text-primary">{entry.category}</span>
                            <span className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] uppercase text-foreground">Priority {entry.priority}</span>
                            <span className={`rounded-full border px-2.5 py-1 text-[11px] uppercase ${entry.isPublished ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-border/60 text-muted-foreground"}`}>
                              {entry.isPublished ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setForm(toFormState(entry))}
                            className="rounded-full border border-border/60 px-3 py-1.5 text-xs text-foreground"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => void handleDeleteKnowledge(entry.id)}
                            className="rounded-full border border-destructive/30 px-3 py-1.5 text-xs text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 text-sm leading-6 text-muted-foreground">{entry.content}</div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        Keywords: {entry.keywords.join(", ") || "—"}
                      </div>
                      <div className="mt-2 text-[11px] text-muted-foreground">Updated: {formatDate(entry.updatedAt)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </PageLayout>
  );
};

export default AdminPanel;
