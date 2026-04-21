import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") || "", [params]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({ title: "Invalid link", description: "Reset token is missing.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await api<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      toast({ title: "Password updated", description: "You can sign in now." });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-muted/50 border border-border rounded-lg px-4 py-3 pl-11 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold gradient-text">Best Version</h1>
        </div>

        <div className="glass rounded-2xl border border-border/50 p-8 glow-sm">
          <h2 className="text-xl font-display font-bold text-foreground mb-2">Set New Password</h2>
          <p className="text-sm text-muted-foreground mb-6">Choose a strong password for your account.</p>

          <form onSubmit={handleReset} className="space-y-4">
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              <input type={showPassword ? "text" : "password"} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className={inputClass} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              <input type={showPassword ? "text" : "password"} placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className={inputClass} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50">
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
