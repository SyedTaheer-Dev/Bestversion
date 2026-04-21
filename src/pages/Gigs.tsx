import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Briefcase, Send, X } from "lucide-react";
import { toast } from "sonner";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Application, Gig } from "@/types/app";

const Gigs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [myApps, setMyApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPage = async () => {
    try {
      const gigsData = await api<{ gigs: Gig[] }>("/gigs");
      setGigs(gigsData.gigs);
      if (user) {
        const appsData = await api<{ applications: Application[] }>("/gigs/applications/me", { auth: true });
        setMyApps(appsData.applications);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load gigs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPage();
  }, [user]);

  const filtered = filter === "all" ? gigs : gigs.filter((g) => g.type === filter);

  const handleApply = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!selectedGig) return;

    try {
      await api("/gigs/applications", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ gigId: selectedGig._id || selectedGig.id, coverLetter }),
      });
      toast.success("Application submitted!");
      setSelectedGig(null);
      setCoverLetter("");
      const data = await api<{ applications: Application[] }>("/gigs/applications/me", { auth: true });
      setMyApps(data.applications);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Application failed");
    }
  };

  return (
    <PageLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">Opportunities Board</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">Find gigs, internships, and freelance work tailored for young talent.</p>
      </motion.div>

      <div className="flex justify-center gap-3 mb-8">
        {["all", "gig", "internship"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full text-sm font-medium transition ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {f === "all" ? "All" : f === "gig" ? "Gigs" : "Internships"}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {filtered.map((g, i) => (
          <motion.div key={g._id || g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground text-lg">{g.title}</h3>
                <p className="text-sm text-primary">{g.company}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${g.type === "internship" ? "bg-secondary/20 text-secondary" : "bg-accent/20 text-accent"}`}>
                {g.type}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{g.description}</p>
            <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
              {g.location && <span className="flex items-center gap-1"><MapPin size={12} /> {g.location}</span>}
              {g.salaryRange && <span className="flex items-center gap-1"><Briefcase size={12} /> {g.salaryRange}</span>}
              {g.deadline && <span className="flex items-center gap-1"><Clock size={12} /> {new Date(g.deadline).toLocaleDateString()}</span>}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {g.skillsRequired?.map((s) => (
                <span key={s} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{s}</span>
              ))}
            </div>
            <button onClick={() => setSelectedGig(g)} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2">
              <Send size={14} /> Apply Now
            </button>
          </motion.div>
        ))}
        {!loading && filtered.length === 0 && <p className="text-center col-span-full text-muted-foreground">No gigs found right now.</p>}
      </div>

      {selectedGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass rounded-2xl p-6 max-w-md w-full border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Apply: {selectedGig.title}</h3>
              <button onClick={() => setSelectedGig(null)}><X className="text-muted-foreground" size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Cover Letter</label>
                <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Why are you a great fit?" className="w-full bg-muted rounded-lg px-4 py-2 text-foreground border border-border focus:border-primary outline-none text-sm h-32 resize-none" />
              </div>
              <button onClick={handleApply} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:opacity-90 transition">Submit Application</button>
            </div>
          </motion.div>
        </div>
      )}

      {user && myApps.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">My Applications</h2>
          <div className="space-y-3">
            {myApps.map((a) => (
              <div key={a.id} className="glass rounded-xl p-4 flex items-center justify-between border border-border/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.gig?.title}</p>
                  <p className="text-xs text-muted-foreground">{a.gig?.company} · Applied {new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${a.status === "accepted" ? "bg-green-500/20 text-green-400" : a.status === "rejected" ? "bg-destructive/20 text-destructive" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </PageLayout>
  );
};

export default Gigs;
