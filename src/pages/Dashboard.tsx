import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Edit3, Save, Trophy, Flame, Target, Calendar, Award, TrendingUp, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AppUser, UserStreak } from "@/types/app";

type DashboardResponse = {
  profile: AppUser;
  streak: UserStreak | null;
  counts: {
    bookings: number;
    applications: number;
    completedChallenges: number;
  };
};

const Dashboard = () => {
  const { user, loading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const data = await api<DashboardResponse>("/dashboard", { auth: true });
        setProfile(data.profile);
        setFullName(data.profile.fullName || "");
        setPhone(data.profile.phone || "");
        setStreak(data.streak);
        setBookingsCount(data.counts.bookings);
        setApplicationsCount(data.counts.applications);
        setCompletedChallenges(data.counts.completedChallenges);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load dashboard");
      } finally {
        setDataLoading(false);
      }
    };

    void fetchData();
  }, [user]);

  const handleSave = async () => {
    try {
      const data = await api<{ profile: AppUser }>("/dashboard/profile", {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ fullName, phone }),
      });
      setProfile(data.profile);
      setEditing(false);
      toast.success("Profile updated!");
      await refreshUser();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    }
  };

  if (loading || !user) return null;

  const profileHandle = user.email || user.phone || "Secure member";
  const avatarSeed = fullName || user.email || user.phone || "U";

  const stats = [
    { icon: Flame, label: "Current Streak", value: streak?.currentStreak || 0, color: "text-orange-400" },
    { icon: Trophy, label: "Total Points", value: streak?.totalPoints || 0, color: "text-yellow-400" },
    { icon: Target, label: "Challenges Done", value: completedChallenges, color: "text-primary" },
    { icon: Calendar, label: "Bookings", value: bookingsCount, color: "text-secondary" },
    { icon: Award, label: "Applications", value: applicationsCount, color: "text-accent" },
    { icon: TrendingUp, label: "Longest Streak", value: streak?.longestStreak || 0, color: "text-green-400" },
  ];

  return (
    <PageLayout>
      {dataLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="flex items-center gap-3 rounded-full border border-border/60 bg-card/70 px-5 py-3 text-sm text-muted-foreground shadow-lg backdrop-blur-xl">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Loading your secure dashboard...
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[28px] border border-border/60 bg-card/75 p-6 md:p-8 shadow-[0_14px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                  <ShieldCheck size={14} /> Cookie-secure account
                </div>
                <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">My Dashboard</h1>
                <p className="mt-2 text-sm text-muted-foreground">Track your profile, streaks, bookings, and opportunity momentum in one place.</p>
              </div>
              <button onClick={() => (editing ? handleSave() : setEditing(true))} className="flex items-center gap-2 self-start rounded-full bg-primary/15 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/25">
                {editing ? <><Save size={16} /> Save</> : <><Edit3 size={16} /> Edit</>}
              </button>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-primary to-secondary text-3xl font-bold text-primary-foreground shadow-[0_12px_35px_hsl(var(--primary)/0.28)]">
                {avatarSeed[0].toUpperCase()}
              </div>
              <div className="flex-1 space-y-3 w-full">
                {editing ? (
                  <>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="w-full rounded-2xl border border-border bg-muted/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary" />
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full rounded-2xl border border-border bg-muted/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary" />
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-foreground">{profile?.fullName || "Set your name"}</h2>
                    <p className="text-sm text-muted-foreground">{profileHandle}</p>
                    {profile?.phone && profile?.email ? <p className="text-sm text-muted-foreground">{profile.phone}</p> : null}
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-border/60 bg-card/75 p-5 text-center shadow-[0_10px_35px_rgba(0,0,0,0.15)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-primary/30">
                <s.icon className={`mx-auto mb-2 ${s.color}`} size={28} />
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-[28px] border border-border/60 bg-card/75 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { label: "Today's Challenges", href: "/challenges", color: "from-primary/20 to-secondary/20" },
                  { label: "Browse Opportunities", href: "/gigs", color: "from-secondary/20 to-accent/20" },
                  { label: "Find a Mentor", href: "/mentors", color: "from-accent/20 to-primary/20" },
                ].map((a) => (
                  <button key={a.label} onClick={() => navigate(a.href)} className={`w-full rounded-2xl border border-border/50 bg-gradient-to-r ${a.color} px-4 py-3 text-left text-sm font-medium text-foreground transition hover:border-primary/50 hover:opacity-90`}>
                    {a.label} →
                  </button>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-[28px] border border-border/60 bg-card/75 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-foreground mb-4">Your Journey</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Profile Completion</span>
                  <span className="text-primary font-medium">{fullName && phone ? "100%" : fullName || phone ? "60%" : "30%"}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full transition-all" style={{ width: fullName && phone ? "100%" : fullName || phone ? "60%" : "30%" }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {fullName && phone ? "Great! Your profile is complete." : "Complete your profile to unlock all features."}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Dashboard;
