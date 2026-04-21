import { motion } from "framer-motion";
import SectionShowcase from "./SectionShowcase";

const talents = [
  "Designer", "Developer", "Marketer", "Writer", "Teacher", "Speaker",
  "Entrepreneur", "Analyst", "Organizer", "Content Creator", "Researcher",
  "Salesperson", "Manager",
];

const colors = [
  "border-primary/40 text-primary",
  "border-secondary/40 text-secondary",
  "border-accent/40 text-accent",
  "border-glow-blue/40 text-glow-blue",
];

const TalentSection = () => (
  <section id="talents" className="section-padding">
    <div className="max-w-5xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Talent Identification</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
          Find Where You <span className="gradient-text">Naturally Shine</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
          Through guided assessments and discovery tools, we help you identify your natural strengths and talent areas — so you can focus on what you're truly great at.
        </p>
      </motion.div>

      <SectionShowcase
        imageSrc="/section-media/talent-radar.svg"
        imageAlt="Talent discovery radar illustration"
        eyebrow="Discovery"
        title="Assessment and talent discovery, shown simply"
        description="The talent image now reflects tests, strengths, and best-fit paths so users can quickly understand how discovery turns into direction."
      />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-3"
      >
        {talents.map((t, i) => (
          <motion.span
            key={t}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className={`px-5 py-2.5 rounded-full text-sm font-medium border glass hover:scale-105 transition-transform cursor-default ${colors[i % colors.length]}`}
          >
            {t}
          </motion.span>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TalentSection;
