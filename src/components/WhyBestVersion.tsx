import { motion } from "framer-motion";
import { Search, Zap, FolderKanban, DollarSign, Layers3, Users } from "lucide-react";
import SectionShowcase from "./SectionShowcase";

const reasons = [
  { icon: Search, title: "Discover Hidden Talent", desc: "Uncover strengths you never knew you had through guided assessments." },
  { icon: Zap, title: "Learning → Real Outcomes", desc: "Every course and skill maps directly to real-world projects and opportunities." },
  { icon: FolderKanban, title: "Proof of Work", desc: "Build a portfolio of projects that speaks louder than any resume." },
  { icon: DollarSign, title: "Early Earning Pathways", desc: "Start earning through freelance, internships, and competitions." },
  { icon: Layers3, title: "Complete Growth System", desc: "Combines mentorship, recognition, growth, and opportunities in one place." },
  { icon: Users, title: "One Ecosystem for All", desc: "Whether you're a student, professional, creator, or entrepreneur — you belong here." },
];

const WhyBestVersion = () => (
  <section className="section-padding">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Why Best Version</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
          Why This Platform <span className="gradient-text">Stands Out</span>
        </h2>
      </motion.div>

      <SectionShowcase
        imageSrc="/section-media/proof-of-work.svg"
        imageAlt="Proof of work illustration"
        eyebrow="Differentiation"
        title="Proof of work and outcomes, not just learning"
        description="The proof-of-work image now focuses on projects, portfolio signals, badges, and career readiness so the section feels grounded in real outcomes."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group glass gradient-border rounded-2xl p-6 hover:glow-sm transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
              <r.icon className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-display font-bold mb-2">{r.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyBestVersion;
