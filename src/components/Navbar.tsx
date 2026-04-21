import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LogOut, LayoutDashboard, Sparkles, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import bvLogo from "@/assets/bv-logo.png";

const homeLinks = ["Home", "Vision", "Skills", "Talents", "Platform", "Journey", "Features", "Contact"];
const dashLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Mentors", href: "/mentors" },
  { label: "Opportunities", href: "/gigs" },
  { label: "Challenges", href: "/challenges" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const userLabel = useMemo(() => {
    if (!user) return "Secure access";
    return user.email?.split("@")[0] || user.phone || user.fullName || "Member";
  }, [user]);

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  const renderNavLink = (label: string) => (
    <a
      key={label}
      href={`#${label.toLowerCase()}`}
      className="relative text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
    >
      {label}
    </a>
  );

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/45"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16 md:h-[74px]">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center gap-3 cursor-pointer group">
          <motion.img
            src={bvLogo}
            alt="Best Version"
            width={40}
            height={40}
            className="w-10 h-10 rounded-2xl ring-1 ring-primary/20 drop-shadow-[0_0_16px_hsl(var(--primary)/0.35)]"
            whileHover={{ rotate: 10, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base md:text-lg font-bold gradient-text">Best Version</span>
            <span className="text-[10px] text-muted-foreground tracking-[0.24em] uppercase">Secure growth platform</span>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-7">
          {isHome ? (
            homeLinks.map(renderNavLink)
          ) : (
            <>
              <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</a>
              {dashLinks.map((l) => (
                <button key={l.href} onClick={() => navigate(l.href)} className={`text-sm transition-colors ${location.pathname === l.href ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                  {l.label}
                </button>
              ))}
              {user?.isAdmin ? (
                <button onClick={() => navigate("/admin")} className={`text-sm transition-colors ${location.pathname === "/admin" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                  Admin
                </button>
              ) : null}
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => navigate("/admin")}
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg backdrop-blur-xl transition hover:border-primary/40 hover:bg-card"
          >
            <Shield size={14} className="text-primary" />
            Admin
          </button>
          <ThemeToggle />
          {user?.isAdmin ? (
            <button
              onClick={() => navigate("/admin")}
              className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg backdrop-blur-xl transition hover:border-primary/40 hover:bg-card"
            >
              <Shield size={14} className="text-primary" />
              Admin panel
            </button>
          ) : null}
          {user && (
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur-xl transition hover:border-primary/40 hover:bg-card"
            >
              <LayoutDashboard size={16} className="text-primary" />
              <span className="max-w-[130px] truncate">{userLabel}</span>
            </button>
          )}
          <button
            onClick={() => void handleAuthAction()}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_hsl(var(--primary)/0.28)] transition hover:opacity-95"
          >
            {user ? <><LogOut size={16} /> Logout</> : <><LogIn size={16} /> Login</>}
          </button>
          <button className="lg:hidden rounded-full border border-border/60 bg-card/70 p-2 text-foreground shadow-lg" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-2xl"
          >
            <div className="space-y-3 p-4">
              <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-lg">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Premium access, smooth flows</p>
                    <p className="text-xs text-muted-foreground">Use login, sign up, OTP, or admin access.</p>
                  </div>
                </div>
              </div>
              {isHome ? (
                homeLinks.map((l) => (
                  <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{l}</a>
                ))
              ) : (
                <>
                  <button onClick={() => { setOpen(false); navigate("/"); }} className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Home</button>
                  <button onClick={() => { setOpen(false); navigate("/admin"); }} className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${location.pathname === "/admin" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                    Admin
                  </button>
                  {dashLinks.map((l) => (
                    <button key={l.href} onClick={() => { setOpen(false); navigate(l.href); }} className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${location.pathname === l.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                      {l.label}
                    </button>
                  ))}
                  {user?.isAdmin ? (
                    <button onClick={() => { setOpen(false); navigate("/admin"); }} className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${location.pathname === "/admin" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                      Admin
                    </button>
                  ) : null}
                </>
              )}
              <button
                onClick={() => { setOpen(false); void handleAuthAction(); }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                {user ? <><LogOut size={16} /> Logout</> : <><LogIn size={16} /> Login</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
