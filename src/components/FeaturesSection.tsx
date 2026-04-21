import { motion } from "framer-motion";
import {
  ClipboardCheck, Brain, Fingerprint, BookOpen, Briefcase, Trophy,
  BarChart3, FolderOpen, FileText, Award, Heart, Users,
  Rocket, Target, Wallet, Star,
} from "lucide-react";
import SectionShowcase from "./SectionShowcase";

const features = [
  { icon: ClipboardCheck, title: "Skill Assessment Test" },
  { icon: Brain, title: "Personality Test" },
  { icon: Fingerprint, title: "Talent Identification" },
  { icon: BookOpen, title: "Courses & Projects" },
  { icon: Briefcase, title: "Freelance & Internships" },
  { icon: Trophy, title: "Competitions" },
  { icon: BarChart3, title: "Leaderboard" },
  { icon: FolderOpen, title: "Portfolio Builder" },
  { icon: FileText, title: "Resume Builder" },
  { icon: Award, title: "Certificates" },
  { icon: Heart, title: "Mentorship" },
  { icon: Users, title: "Community" },
  { icon: Rocket, title: "Startup Collaboration" },
  { icon: Target, title: "Job Opportunities" },
  { icon: Wallet, title: "Wallet System" },
  { icon: Star, title: "Points & Badges" },
];

const FeaturesSection = () => (
  <section id="features" className="section-padding relative">
    <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-accent/5 blur-[120px] rounded-full -z-10" />
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Key Features</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
          Everything You Need to <span className="gradient-text">Succeed</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">An end-to-end ecosystem packed with powerful tools for your growth.</p>
      </motion.div>

      <SectionShowcase
        imageSrc="/section-media/features-stack.svg"
        imageAlt="Feature stack illustration"
        eyebrow="Tools"
        title="The product stack shown as one connected toolkit"
        description="The features visual now reflects assessments, portfolio, community, leaderboard, mentorship, rewards, and growth tools in one place."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            className="group glass gradient-border rounded-xl p-4 flex items-center gap-3 hover:glow-sm transition-all duration-300"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <f.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium">{f.title}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
