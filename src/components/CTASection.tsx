import { motion } from "framer-motion";

const CTASection = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/8 blur-[150px] rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-secondary/8 blur-[100px] rounded-full" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto text-center"
    >
      <h2 className="font-display text-3xl md:text-6xl font-bold mb-6">
        <span className="gradient-text">Learn. Build. Earn. Grow.</span>
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
        Best Version creates a complete growth ecosystem that helps youth transform potential into progress, skills into proof, and talent into opportunity.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#contact" className="px-8 py-4 rounded-full font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity glow-md text-lg">
          Join the Platform
        </a>
        <a href="#contact" className="px-8 py-4 rounded-full font-semibold border border-border hover:border-primary/50 text-foreground hover:text-primary transition-colors text-lg">
          Become a Mentor
        </a>
      </div>
    </motion.div>
  </section>
);

export default CTASection;
