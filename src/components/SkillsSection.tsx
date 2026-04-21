import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Users, TrendingUp, Sparkles, Cpu, Globe, Target } from "lucide-react";
import SectionShowcase from "./SectionShowcase";

const skills = [
  { icon: BookOpen, title: "Skills", desc: "Master in-demand technical and soft skills" },
  { icon: MessageSquare, title: "Communication", desc: "Express ideas clearly and persuasively" },
  { icon: Users, title: "Leadership", desc: "Inspire and guide teams to success" },
  { icon: TrendingUp, title: "Business", desc: "Understand markets, strategy, and growth" },
  { icon: Sparkles, title: "Creativity", desc: "Think differently and innovate boldly" },
  { icon: Cpu, title: "Technology", desc: "Stay ahead with modern tech skills" },
  { icon: Globe, title: "Networking", desc: "Build meaningful professional connections" },
  { icon: Target, title: "Career", desc: "Navigate your path with clarity and purpose" },
];

const SkillsSection = () => (
  <section id="skills" className="section-padding">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Skills Development</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
          Build Skills That <span className="gradient-text">Matter</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Develop a powerful skill set across eight critical domains that prepare you for any career path.</p>
      </motion.div>

      <SectionShowcase
        imageSrc="/section-media/skills-lab.svg"
        imageAlt="Skills lab illustration"
        eyebrow="Skill foundation"
        title="A visual map of the core skill areas"
        description="The skills image now highlights learning, communication, leadership, technology, creativity, and career growth so the section feels directly tied to the skill cards below."
        reverse
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {skills.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group glass gradient-border rounded-2xl p-5 hover:glow-sm transition-all duration-300 cursor-default"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-colors">
              <s.icon className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="font-display font-semibold mb-1">{s.title}</h3>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SkillsSection;
