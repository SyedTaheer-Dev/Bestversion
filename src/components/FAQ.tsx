import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "Who is this platform for?", a: "Best Version is designed for youth aged 16 to 33 — including students, young professionals, creators, aspiring entrepreneurs, freelancers, and future leaders who want to discover and develop their true potential." },
  { q: "How does talent identification work?", a: "Through a series of skill assessments, personality tests, and guided discovery sessions, we help you identify your natural strengths, talent areas, and the career paths where you can truly shine." },
  { q: "Can I earn on this platform?", a: "Absolutely! Best Version offers freelance gigs, micro-tasks, internship opportunities, competition prizes, and startup pathways — all designed to help you start earning while you're still growing." },
  { q: "Can I build a portfolio here?", a: "Yes! Our Smart Portfolio Builder automatically compiles your projects, certificates, achievements, and skills into a professional portfolio you can share with employers and clients." },
  { q: "Is it useful for students and professionals both?", a: "Yes. Whether you're a college student exploring career options or a young professional looking to level up, Best Version adapts to your goals with personalized learning paths, mentorship, and opportunities." },
  { q: "How is this different from other learning platforms?", a: "Best Version isn't just about learning — it's a complete growth ecosystem. We combine talent discovery, skill development, real projects, earning opportunities, mentorship, and community all in one place." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">FAQ</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Got <span className="gradient-text">Questions?</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass gradient-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors"
              >
                <span className="font-semibold text-sm pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
