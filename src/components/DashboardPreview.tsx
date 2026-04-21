import { motion } from "framer-motion";
import { TrendingUp, BookOpen, FolderOpen, Award, Zap, Trophy } from "lucide-react";
import SectionShowcase from "./SectionShowcase";

const cards = [
  { icon: TrendingUp, label: "Progress Score", value: "78%", sub: "+12% this week", color: "text-primary" },
  { icon: BookOpen, label: "Skills Matched", value: "6 / 8", sub: "2 skills to go", color: "text-secondary" },
  { icon: Zap, label: "Current Streak", value: "14 Days", sub: "Personal best!", color: "text-accent" },
  { icon: FolderOpen, label: "Next Step", value: "Build Project", sub: "Web Portfolio App", color: "text-glow-blue" },
  { icon: Trophy, label: "Opportunities", value: "5 New", sub: "Internships & gigs", color: "text-primary" },
  { icon: Award, label: "Badges Earned", value: "12", sub: "3 new this month", color: "text-secondary" },
];

const DashboardPreview = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/5 blur-[150px] rounded-full -z-10" />
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Your Dashboard</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
          Your Growth, <span className="gradient-text">At a Glance</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">A personalized dashboard that tracks your progress, skills, streaks, opportunities, and achievements in real time.</p>
      </motion.div>

      <SectionShowcase
        imageSrc="/section-media/dashboard-insights.svg"
        imageAlt="Dashboard insight illustration"
        eyebrow="Insight layer"
        title="A dashboard preview that matches progress tracking"
        description="The dashboard image now shows streaks, progress, skills, and opportunity signals so the preview feels closer to the real product experience."
        reverse
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass gradient-border rounded-3xl p-6 md:p-8 glow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-bold text-lg">Welcome back, Alex</h3>
            <p className="text-sm text-muted-foreground">Let's continue growing today</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">14 day streak 🔥</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-muted/40 border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <c.icon className={`w-4 h-4 ${c.color}`} />
                <span className="text-xs text-muted-foreground">{c.label}</span>
              </div>
              <p className="font-display font-bold text-xl mb-0.5">{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/40 border border-border/50 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Overall Growth Progress</span>
            <span className="text-sm font-bold text-primary">78%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "78%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default DashboardPreview;
