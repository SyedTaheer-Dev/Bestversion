import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Rocket, Palette, Crown } from "lucide-react";
import SectionShowcase from "./SectionShowcase";

const cards = [
  { icon: GraduationCap, title: "Student", desc: "Excel academically while building real-world skills and projects." },
  { icon: Briefcase, title: "Professional", desc: "Level up your career with leadership, networking, and proof of work." },
  { icon: Rocket, title: "Entrepreneur", desc: "Turn ideas into startups with mentorship and collaboration." },
  { icon: Palette, title: "Creator", desc: "Showcase your creativity and build a portfolio that stands out." },
  { icon: Crown, title: "Leader", desc: "Develop the mindset and skills to lead teams and communities." },
];

const Vision = () => (
  <section id="vision" className="section-padding">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 max-w-3xl mx-auto"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Our Vision</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
          Become the <span className="gradient-text">Best Version</span> of Yourself
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          This platform exists to discover the true potential and talents of youth and help them learn, build, earn, and grow — all before the age of 33.
        </p>
      </motion.div>

      <SectionShowcase
        imageSrc="/section-media/vision-hub.svg"
        imageAlt="Vision illustration for the Best Version audience types"
        eyebrow="Who this is for"
        title="See how Best Version supports every stage of growth"
        description="The vision image now shows clear audience paths for students, professionals, entrepreneurs, creators, and leaders so the section matches the real people this platform is built for."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group glass gradient-border rounded-2xl p-6 text-center hover:glow-sm transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <c.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-bold mb-2">Best Version of a <span className="gradient-text">{c.title}</span></h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Vision;
