import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Computer Science Student",
    quote: "Best Version helped me discover I'm naturally great at system design. Within 3 months, I built 4 projects, earned my first freelance income, and landed an internship at a top startup.",
    avatar: "AS",
  },
  {
    name: "Rohan Mehta",
    role: "Content Creator & Designer",
    quote: "I always thought I was 'just creative' — this platform showed me how to turn creativity into a real career. The portfolio builder alone changed everything for me.",
    avatar: "RM",
  },
  {
    name: "Priya Kapoor",
    role: "Freelance Developer",
    quote: "The gig board and skill assessments gave me confidence and direction. I went from zero earnings to consistent freelance income in under 6 months.",
    avatar: "PK",
  },
  {
    name: "Arjun Nair",
    role: "Aspiring Entrepreneur",
    quote: "The startup matchmaking feature connected me with my co-founder. We're now building an ed-tech product together. Best Version is where it all started.",
    avatar: "AN",
  },
];

const Testimonials = () => (
  <section className="section-padding">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Success Stories</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
          Real People, <span className="gradient-text">Real Growth</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">See how youth from different backgrounds are transforming their potential into progress.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass gradient-border rounded-2xl p-6 hover:glow-sm transition-all duration-300"
          >
            <Quote className="w-8 h-8 text-primary/30 mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t.quote}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-xs font-bold">
                {t.avatar}
              </div>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
