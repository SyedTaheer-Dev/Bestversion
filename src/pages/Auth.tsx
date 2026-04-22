import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Loader2,
  Sparkles,
  ShieldCheck,
  Smartphone,
  KeyRound,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { AppUser } from "@/types/app";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
          prompt: () => void;
          cancel: () => void;
        };
      };
    };
  }
}

type AuthMode = "login" | "signup" | "forgot" | "phone";

type AuthResponse = {
  token: string;
  user: AppUser;
};

type PhoneOtpResponse = {
  message: string;
  demoCode?: string;
};

const socialModes: AuthMode[] = ["login", "signup"];

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setAuthData } = useAuth();
  const { toast } = useToast();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const requestedAdminAccess = ((location.state as { from?: string } | null)?.from || "") === "/admin";
  const redirectTo = useMemo(() => {
    const from = (location.state as { from?: string } | null)?.from;
    return from || "/dashboard";
  }, [location.state]);

  const saveToken = (token: string) => {
    try {
      localStorage.setItem("bv_token", token);
    } catch {
      // ignore localStorage issues
    }
  };

  const handleAuthSuccess = (data: AuthResponse, successMessage: string) => {
    saveToken(data.token);
    setAuthData(data.token, data.user);
    toast({ title: successMessage });
    navigate(redirectTo, { replace: true });
  };

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  useEffect(() => {
    if (!socialModes.includes(mode) || !googleClientId || !googleButtonRef.current) {
      return;
    }

    let cancelled = false;

    const handleGoogleCredential = async (credential: string) => {
      setLoading(true);
      try {
        const data = await api<AuthResponse>("/auth/google", {
          method: "POST",
          body: JSON.stringify({ credential }),
        });

        handleAuthSuccess(data, "Google sign-in successful");
      } catch (error) {
        toast({
          title: "Google sign-in failed",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const renderGoogle = () => {
      if (cancelled || !window.google || !googleButtonRef.current) return;
      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: ({ credential }: { credential?: string }) => {
          if (!credential) return;
          void handleGoogleCredential(credential);
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: mode === "login" ? "continue_with" : "signup_with",
        width: googleButtonRef.current.offsetWidth || 360,
      });
    };

    if (window.google) {
      renderGoogle();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-google-signin="true"]');
    if (existingScript) {
      existingScript.addEventListener("load", renderGoogle, { once: true });
      return () => existingScript.removeEventListener("load", renderGoogle);
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleSignin = "true";
    script.addEventListener("load", renderGoogle, { once: true });
    document.body.appendChild(script);

    return () => {
      cancelled = true;
      script.removeEventListener("load", renderGoogle);
    };
  }, [googleClientId, mode, navigate, redirectTo, setAuthData, toast]);

  const inputClass =
    "w-full rounded-2xl border border-border/70 bg-muted/40 px-4 py-3.5 pl-11 text-sm text-foreground placeholder:text-muted-foreground shadow-[0_6px_25px_rgba(0,0,0,0.12)] outline-none transition focus:border-primary/60 focus:bg-background";

  const resetPhoneFlow = () => {
    setOtp("");
    setOtpSent(false);
    setDemoCode(null);
  };

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    if (nextMode !== "phone") resetPhoneFlow();
  };

  const useAdminCredentials = () => {
    setMode("login");
    setEmail("admin@bestversion.com");
    setPassword("Admin@123");
    setFullName("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      handleAuthSuccess(data, "Welcome back!");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Minimum 6 characters required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await api<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
      });

      handleAuthSuccess(data, "Account created successfully");
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api<{ message: string; resetUrl?: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      toast({
        title: "Reset request ready",
        description: data.resetUrl ? `${data.message} Reset link copied for local testing.` : data.message,
      });

      if (data.resetUrl) {
        await navigator.clipboard.writeText(data.resetUrl).catch(() => undefined);
        window.open(data.resetUrl, "_blank");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOtp("");
    try {
      const data = await api<PhoneOtpResponse>("/auth/phone-otp/send", {
        method: "POST",
        body: JSON.stringify({ phone, fullName }),
      });
      setOtpSent(true);
      setDemoCode(data.demoCode || null);
      toast({ title: "OTP ready", description: data.message });
    } catch (error) {
      toast({
        title: "Could not send OTP",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Invalid code", description: "Enter the full 6-digit OTP.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const data = await api<AuthResponse>("/auth/phone-otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code: otp, fullName }),
      });

      handleAuthSuccess(data, "Phone verified successfully");
    } catch (error) {
      toast({
        title: "OTP verification failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-10 md:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_32%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.14),transparent_28%)]" />
      <div className="absolute left-[-8rem] top-20 h-80 w-80 rounded-full bg-primary/8 blur-[120px]" />
      <div className="absolute bottom-0 right-[-6rem] h-72 w-72 rounded-full bg-secondary/8 blur-[120px]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr,0.95fr]">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
              <Sparkles size={14} /> Premium MongoDB experience
            </div>
            <div>
              <button onClick={() => navigate("/")} className="text-left">
                <h1 className="font-display text-5xl font-bold leading-tight text-foreground">
                  Secure access that feels
                  <span className="gradient-text"> fast, modern, and premium.</span>
                </h1>
              </button>
              <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
                Sign in with email or phone OTP. Your session stays secure with HTTP-only cookies while the platform keeps the experience smooth across dashboard, mentors, gigs, and challenges.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Cookie auth", copy: "HTTP-only secure session flow" },
                { icon: Smartphone, title: "Phone OTP", copy: "Quick local demo mode included" },
                { icon: KeyRound, title: "Instant access", copy: "Fast sign-in flow when enabled" },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.08 }}
                  className="rounded-3xl border border-border/60 bg-card/75 p-4 shadow-[0_12px_38px_rgba(0,0,0,0.16)] backdrop-blur-xl"
                >
                  <item.icon className="mb-3 text-primary" size={20} />
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.copy}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <div className="mx-auto w-full max-w-[460px] overflow-hidden rounded-[32px] border border-border/60 bg-card/80 p-5 shadow-[0_16px_70px_rgba(0,0,0,0.24)] backdrop-blur-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft size={14} /> Back home
              </button>
              <div className="text-right">
                <h1 className="font-display text-2xl font-bold gradient-text">Best Version</h1>
                <p className="mt-1 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">Cookie-secure access</p>
              </div>
            </div>

            {requestedAdminAccess ? (
              <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/8 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Admin access requested</p>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Use the default admin account to open the admin panel directly.
                    </p>
                    <p className="mt-2 text-xs text-primary">admin@bestversion.com · Admin@123</p>
                  </div>
                  <button
                    type="button"
                    onClick={useAdminCredentials}
                    className="rounded-xl border border-primary/25 bg-primary/12 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/18"
                  >
                    Use admin login
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mb-6 grid grid-cols-4 gap-2 rounded-2xl border border-border/60 bg-background/60 p-1">
              {[
                { id: "login", label: "Login" },
                { id: "signup", label: "Sign up" },
                { id: "phone", label: "OTP" },
                { id: "forgot", label: "Reset" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changeMode(item.id as AuthMode)}
                  className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                    mode === item.id
                      ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${otpSent ? "sent" : "new"}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
              >
                {socialModes.includes(mode) ? (
                  <>
                    <div className="mb-5 space-y-2">
                      <h2 className="font-display text-2xl font-bold text-foreground">
                        {mode === "login" ? "Welcome back" : "Create your account"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {mode === "login"
                          ? "Continue and jump straight into your dashboard."
                          : "Start securely. Your session will be remembered safely."}
                      </p>
                    </div>

                    {googleClientId ? (
                      <div className="mb-5">
                        <div ref={googleButtonRef} className="min-h-[44px]" />
                      </div>
                    ) : null}

                    <div className="mb-5 flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="h-px flex-1 bg-border" />
                      or continue with email
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  </>
                ) : null}

                {mode === "login" && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                      <Mail size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_35px_hsl(var(--primary)/0.24)] transition hover:opacity-95 disabled:opacity-60"
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                      {loading ? "Signing in..." : "Login"}
                    </button>
                  </form>
                )}

                {mode === "signup" && (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_35px_hsl(var(--primary)/0.24)] transition hover:opacity-95 disabled:opacity-60"
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                      {loading ? "Creating..." : "Create Account"}
                    </button>
                  </form>
                )}

                {mode === "forgot" && (
                  <>
                    <div className="mb-5 space-y-2">
                      <h2 className="font-display text-2xl font-bold text-foreground">Reset password</h2>
                      <p className="text-sm text-muted-foreground">
                        We’ll send a reset link by email, or provide a preview link locally if SMTP is not configured.
                      </p>
                    </div>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="relative">
                        <Mail size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className={inputClass}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_35px_hsl(var(--primary)/0.24)] transition hover:opacity-95 disabled:opacity-60"
                      >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                        {loading ? "Preparing..." : "Send Reset Link"}
                      </button>
                    </form>
                  </>
                )}

                {mode === "phone" && (
                  <>
                    <div className="mb-5 space-y-2">
                      <h2 className="font-display text-2xl font-bold text-foreground">Sign in with phone</h2>
                      <p className="text-sm text-muted-foreground">
                        Request a 6-digit OTP and verify it to start a secure cookie session.
                      </p>
                    </div>

                    {!otpSent ? (
                      <form onSubmit={handleSendOtp} className="space-y-4">
                        <div className="relative">
                          <User size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Full name (optional)"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div className="relative">
                          <Smartphone size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                          <input
                            type="tel"
                            placeholder="Phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className={inputClass}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_35px_hsl(var(--primary)/0.24)] transition hover:opacity-95 disabled:opacity-60"
                        >
                          {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                          {loading ? "Sending..." : "Send OTP"}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-5">
                        <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Phone</p>
                          <p className="mt-2 text-sm font-medium text-foreground">{phone}</p>
                          {demoCode ? (
                            <p className="mt-3 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary">
                              Demo OTP: <span className="font-semibold tracking-[0.3em]">{demoCode}</span>
                            </p>
                          ) : null}
                        </div>
                        <div>
                          <label className="mb-3 block text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                            Enter OTP
                          </label>
                          <InputOTP maxLength={6} value={otp} onChange={setOtp} containerClassName="justify-center">
                            <InputOTPGroup>
                              {Array.from({ length: 6 }).map((_, index) => (
                                <InputOTPSlot
                                  key={index}
                                  index={index}
                                  className="h-12 w-11 rounded-xl border border-border bg-muted/50 first:rounded-xl first:border last:rounded-xl"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={resetPhoneFlow}
                            className="flex-1 rounded-2xl border border-border/60 bg-background/70 py-3 text-sm font-medium text-foreground transition hover:bg-muted/60"
                          >
                            Change number
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_35px_hsl(var(--primary)/0.24)] transition hover:opacity-95 disabled:opacity-60"
                          >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                            Verify OTP
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;