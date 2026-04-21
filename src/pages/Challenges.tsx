import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Flame, Trophy, Target, CheckCircle, Zap } from "lucide-react";
import { toast } from "sonner";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Challenge, UserStreak } from "@/types/app";

const Challenges = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const challengesData = await api<{ challenges: Challenge[] }>("/challenges/today");
        setChallenges(challengesData.challenges);

        if (user) {
          const statusData = await api<{ completedChallengeIds: string[]; streak: UserStreak | null }>("/challenges/me/status", { auth: true });
          setCompleted(new Set(statusData.completedChallengeIds));
          setStreak(statusData.streak);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load challenges");
      } finally {
        setLoading(false);
      }
    };

    void fetchPage();
  }, [user]);

  const completeChallenge = async (challenge: Challenge) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const challengeId = challenge._id || challenge.id;
    if (!challengeId || completed.has(challengeId)) return;

    try {
      const data = await api<{ streak: UserStreak }>(`/challenges/${challengeId}/complete`, {
        method: "POST",
        auth: true,
      });
      const next = new Set(completed);
      next.add(challengeId);
      setCompleted(next);
      setStreak(data.streak);
      toast.success(`+${challenge.points} points! 🎉`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not complete challenge");
    }
  };

  const categoryColors: Record<string, string> = {
    coding: "from-primary to-blue-500",
    learning: "from-secondary to-purple-500",
    networking: "from-accent to-pink-500",
    communication: "from-yellow-500 to-orange-500",
    general: "from-green-500 to-teal-500",
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">Daily Challenges</h1>
          <p className="text-muted-foreground">Complete challenges, build streaks, earn points!</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4 mb-10">
          <div className="glass rounded-xl p-5 text-center border border-border/50">
            <Flame className="mx-auto mb-2 text-orange-400" size={32} />
            <p className="text-2xl font-bold text-foreground">{streak?.currentStreak || 0}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="glass rounded-xl p-5 text-center border border-border/50">
            <Trophy className="mx-auto mb-2 text-yellow-400" size={32} />
            <p className="text-2xl font-bold text-foreground">{streak?.totalPoints || 0}</p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </div>
          <div className="glass rounded-xl p-5 text-center border border-border/50">
            <Target className="mx-auto mb-2 text-primary" size={32} />
            <p className="text-2xl font-bold text-foreground">{completed.size}/{challenges.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </motion.div>

        <div className="space-y-4">
          {challenges.map((c, i) => {
            const key = c._id || c.id || `${c.title}-${i}`;
            const done = completed.has(key);
            return (
              <motion.div key={key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={`glass rounded-2xl p-5 border transition-all ${done ? "border-green-500/50 bg-green-500/5" : "border-border/50 hover:border-primary/50"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[c.category] || categoryColors.general} flex items-center justify-center`}>
                      {done ? <CheckCircle className="text-white" size={24} /> : <Zap className="text-white" size={24} />}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${done ? "text-green-400 line-through" : "text-foreground"}`}>{c.title}</h3>
                      <p className="text-sm text-muted-foreground">{c.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">+{c.points}pts</span>
                    {!done && (
                      <button onClick={() => completeChallenge(c)} className="px-4 py-2 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition">
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {challenges.length === 0 && !loading && (
            <div className="text-center py-16 text-muted-foreground">
              <Target size={48} className="mx-auto mb-4 opacity-50" />
              <p>No challenges for today yet. Seed the backend once and refresh.</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Challenges;
