import { motion } from "framer-motion";
import { BookOpen, Hammer, DollarSign, Trophy, Users, Building, Lightbulb, FolderOpen, BarChart3, Heart } from "lucide-react";
import SectionShowcase from "./SectionShowcase";

const modules = [
  { icon: BookOpen, title: "Learn", label: "Courses", desc: "Access structured courses to master new skills" },
  { icon: Hammer, title: "Build", label: "Projects", desc: "Work on real projects that prove your abilities" },
  { icon: DollarSign, title: "Earn", label: "Freelance Tasks", desc: "Take on paid tasks and start earning early" },
  { icon: Trophy, title: "Compete", label: "Competitions", desc: "Challenge yourself in skill-based contests" },
  { icon: Users, title: "Network", label: "Community", desc: "Connect with peers, mentors, and leaders" },
  { icon: Building, title: "Internships", label: "Work Experience", desc: "Gain real workplace experience with top companies" },
  { icon: Lightbulb, title: "Startup Ideas", label: "Innovation Lab", desc: "Pitch, validate, and build your business ideas" },
  { icon: FolderOpen, title: "Portfolio", label: "Showcase", desc: "Build a professional portfolio of your best work" },
  { icon: BarChart3, title: "Leaderboard", label: "Rankings", desc: "Track your growth and compete with others" },
  { icon: Heart, title: "Mentorship", label: "Guidance", desc: "Learn from experienced mentors in your field" },
];

const PlatformSections = () => (
  <section id="platform" className="section-padding relative">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-secondary/5 blur-[120px] rounded-full -z-10" />
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Platform Ecosystem</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
          One Platform, <span className="gradient-text">Endless Growth</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to go from discovering your talent to landing real opportunities — all in one place.</p>
      </motion.div>

      <SectionShowcase
        imageSrc="/section-media/platform-ecosystem.svg"
        imageAlt="Platform ecosystem illustration"
        eyebrow="Ecosystem"
        title="Learn, build, earn, and grow in one flow"
        description="The platform visual now matches the real ecosystem: courses, projects, gigs, community, mentorship, opportunities, and portfolio building in one connected flow."
        reverse
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {modules.map((m, i) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group glass gradient-border rounded-2xl p-5 hover:glow-sm transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <m.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-bold text-sm mb-0.5">{m.title}</h3>
            <p className="text-xs text-primary/70 font-medium mb-1.5">{m.label}</p>
            <p className="text-xs text-muted-foreground">{m.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PlatformSections;
