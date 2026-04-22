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

  return