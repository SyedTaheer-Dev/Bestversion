import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SocialLinks from "./SocialLinks";
import bvLogo from "@/assets/bv-logo.png";

const productLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Mentors", href: "/mentors" },
  { label: "Opportunities", href: "/gigs" },
  { label: "Challenges", href: "/challenges" },
];

const sectionLinks = [
  { label: "Vision", href: "#vision" },
  { label: "Skills", href: "#skills" },
  { label: "Journey", href: "#journey" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "#contact" },
];

const Footer = () => {
  const navigate = useNavigate();

  const handleLink = (href: string) => {
    if (href.startsWith("/")) {
      navigate(href);
      return;
    }

    if (href.startsWith("#")) {
      if (window.location.pathname !== "/") {
        navigate(`/${href}`);
        return;
      }
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer id="contact" className="relative overflow-hidden border-t border-border/50 bg-background/70">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/4 h-[260px] w-[520px] rounded-full bg-primary/8 blur-[150px]" />
        <div className="absolute right-1/4 top-12 h-[220px] w-[420px] rounded-full bg-secondary/8 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-16">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1.3fr,0.8fr,0.8fr,1fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <img src={bvLogo} alt="Best Version" width={48} height={48} className="h-12 w-12 rounded-2xl ring-1 ring-primary/25 drop-shadow-[0_0_20px_hsl(var(--primary)/0.45)]" />
              <div>
                <h3 className="font-display text-xl font-bold gradient-text">Best Version</h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Talent · Opportunity · Growth</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              A smoother youth growth platform with secure cookie sessions, mentor discovery, real opportunities, and daily challenges that keep momentum visible.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Phone OTP", "Secure sessions", "Fast access"].map((item) => (
                <span key={item} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">{item}</span>
              ))}
            </div>
            <div className="mt-6">
              <SocialLinks />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">Explore</h4>
            <div className="flex flex-col gap-3">
              {sectionLinks.map((l) => (
                <button key={l.label} onClick={() => handleLink(l.href)} className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary">
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">Product</h4>
            <div className="flex flex-col gap-3">
              {productLinks.map((l) => (
                <button key={l.label} onClick={() => handleLink(l.href)} className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary">
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="rounded-3xl border border-border/60 bg-card/65 p-6 backdrop-blur-xl">
            <h4 className="font-display text-sm font-semibold text-foreground">Stay in your best flow</h4>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Start with email or phone OTP and continue from any device with a secure session that feels effortless.
            </p>
            <button onClick={() => navigate('/auth')} className="mt-5 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_hsl(var(--primary)/0.22)] transition hover:opacity-95">
              Open secure access
            </button>
          </motion.div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Best Version. Designed for smoother momentum.</p>
          <div className="flex flex-wrap gap-5">
            <button onClick={() => navigate('/auth')} className="transition-colors hover:text-primary">Account</button>
            <button onClick={() => handleLink('#features')} className="transition-colors hover:text-primary">Features</button>
            <button onClick={() => handleLink('#contact')} className="transition-colors hover:text-primary">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
