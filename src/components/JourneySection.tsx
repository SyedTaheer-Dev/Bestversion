import { motion } from "framer-motion";
import SectionShowcase from "./SectionShowcase";

const steps = [
  { num: "01", title: "Join the Platform", desc: "Create your profile and set your growth goals" },
  { num: "02", title: "Take Skill Test", desc: "Assess your current abilities across key areas" },
  { num: "03", title: "Talent Identified", desc: "Discover your natural strengths and best-fit paths" },
  { num: "04", title: "Learn Skills", desc: "Master new skills through structured courses" },
  { num: "05", title: "Build Projects", desc: "Apply knowledge by building real-world projects" },
  { num: "06", title: "Compete & Grow", desc: "Enter competitions to test and sharpen your abilities" },
  { num: "07", title: "Work & Earn", desc: "Take on internships and freelance opportunities" },
  { num: "08", title: "Build Portfolio", desc: "Showcase your best work in a professional portfolio" },
  { num: "09", title: "Get Opportunities", desc: "Land jobs, clients, and career breakthroughs" },
];

const JourneySection = () => (
  <section id="journey" className="section-padding">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Your Journey</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
          From Potential to <span className="gradient-text">Progress</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">A clear, guided path that takes you from discovery to real-world success.</p>
      </motion.div>

      <SectionShowcase
        imageSrc="/section-media/journey-map.svg"
        imageAlt="Journey roadmap illustration"
        eyebrow="Roadmap"
        title="A step-by-step path from signup to real outcomes"
        description="The journey image now reflects the actual user path: join, assess, learn, build, earn, and unlock opportunities without making the homepage heavy."
      />

      <div className="relative">
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-secondary/50 to-accent/50" />
        <div className="space-y-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative pl-16 md:pl-20"
            >
              <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-card/90 font-display text-sm font-bold text-primary shadow-lg backdrop-blur-xl">
                {s.num}
              </div>
              <div className="glass gradient-border rounded-2xl p-5">
                <h3 className="font-display text-lg font-bold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default JourneySection;
