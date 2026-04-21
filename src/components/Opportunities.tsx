import { motion } from "framer-motion";
import { Building, Code, Trophy, Rocket, Briefcase } from "lucide-react";
import SectionShowcase from "./SectionShowcase";

const opportunities = [
  { icon: Building, title: "Internships", count: "120+", desc: "Paid internships at startups and companies", tag: "Popular" },
  { icon: Code, title: "Freelance Gigs", count: "85+", desc: "Micro-tasks and project-based work", tag: "Earning" },
  { icon: Trophy, title: "Competitions", count: "30+", desc: "Skill-based contests with prizes", tag: "Compete" },
  { icon: Rocket, title: "Startup Challenges", count: "15+", desc: "Build and pitch your startup ideas", tag: "Innovation" },
  { icon: Briefcase, title: "Job Openings", count: "200+", desc: "Entry-level and early-career roles", tag: "Career" },
];

const Opportunities = () => (
  <section className="section-padding relative">
    <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-secondary/5 blur-[120px] rounded-full -z-10" />
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Opportunities</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
          Real Paths to <span className="gradient-text">Real Outcomes</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">A curated feed of opportunities designed for young talent ready to make an impact.</p>
      </motion.div>

      <SectionShowcase
        imageSrc="/section-media/opportunity-board.svg"
        imageAlt="Opportunity board illustration"
        eyebrow="Outcomes"
        title="Internships, gigs, competitions, and jobs in one board"
        description="The opportunities image now looks like a real opportunity board with role cards, filters, and career outcomes tied to internships, gigs, competitions, and jobs."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {opportunities.map((o, i) => (
          <motion.div
            key={o.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group glass gradient-border rounded-2xl p-5 hover:glow-sm transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <o.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{o.tag}</span>
            </div>
            <h3 className="font-display font-bold mb-0.5">{o.title}</h3>
            <p className="text-xl font-bold gradient-text mb-1">{o.count}</p>
            <p className="text-xs text-muted-foreground">{o.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Opportunities;
