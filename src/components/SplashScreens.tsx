import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles, Rocket, Target, Crown } from "lucide-react";

const slides = [
  {
    icon: Sparkles,
    headline: "Discover Your True Potential",
    subtext: "Every young person has untapped potential waiting to be identified and shaped.",
    gradient: "from-primary/20 via-secondary/10 to-transparent",
    orbColor: "bg-primary/20",
  },
  {
    icon: Rocket,
    headline: "Learn. Build. Earn. Grow.",
    subtext: "Go from self-discovery to real-world skills, projects, and opportunities.",
    gradient: "from-secondary/20 via-accent/10 to-transparent",
    orbColor: "bg-secondary/20",
  },
  {
    icon: Target,
    headline: "Talent to Opportunity",
    subtext: "Turn your strengths into proof of work, internships, freelance income, jobs, and startup ideas.",
    gradient: "from-accent/20 via-primary/10 to-transparent",
    orbColor: "bg-accent/20",
  },
  {
    icon: Crown,
    headline: "Become Your Best Version Before 33",
    subtext: "A complete youth growth ecosystem for students, professionals, creators, and leaders.",
    gradient: "from-glow-blue/20 via-primary/10 to-transparent",
    orbColor: "bg-glow-blue/20",
  },
];

interface SplashScreensProps {
  onComplete: () => void;
}

const SplashScreens = ({ onComplete }: SplashScreensProps) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    if (current < slides.length - 1) {
      setCurrent((p) => p + 1);
    } else {
      onComplete();
    }
  }, [current, onComplete]);

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          key={`orb1-${current}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full ${slide.orbColor} blur-[150px]`}
        />
        <motion.div
          key={`orb2-${current}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[120px]"
        />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center px-6 max-w-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center mb-8"
          >
            <Icon className="w-10 h-10 text-primary" />
          </motion.div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            {slide.headline.split(" ").map((word, i) => {
              const highlights = ["Potential", "Build.", "Earn.", "Grow.", "Opportunity", "Best", "Version"];
              const isHighlight = highlights.includes(word);
              return (
                <span key={i}>
                  {isHighlight ? <span className="gradient-text">{word}</span> : word}{" "}
                </span>
              );
            })}
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed max-w-md">{slide.subtext}</p>
        </motion.div>
      </AnimatePresence>

      {/* Progress + Controls */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-6 px-6">
        {/* Progress dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-primary" : "w-3 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={onComplete}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
          >
            Skip
          </button>
          <button
            onClick={next}
            className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity glow-sm"
          >
            {current === slides.length - 1 ? "Get Started" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreens;
