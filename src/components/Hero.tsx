import { motion } from "framer-motion";
import { TrendingUp, Zap, Award, BookOpen } from "lucide-react";
import bvLogo from "@/assets/bv-logo.png";

const pills = ["Learn", "Build", "Earn", "Grow"];

const Hero = () => (
  <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden section-padding pt-32">
    {/* Background effects */}
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-accent/8 blur-[100px]" />
    </div>

    <div className="max-w-7xl mx-auto w-full">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left - Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <motion.img
              src={bvLogo}
              alt="Best Version logo"
              width={56}
              height={56}
              className="w-14 h-14 drop-shadow-[0_0_25px_hsl(var(--primary)/0.5)]"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div>
              <p className="font-display font-bold text-lg leading-none gradient-text">Best Version</p>
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase mt-1">Talent · Opportunity · Growth</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {pills.map((p, i) => (
              <motion.span
                key={p}
                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", bounce: 0.4 }}
                whileHover={{ scale: 1.1, y: -3 }}
                className="px-4 py-1.5 rounded-full text-xs font-semibold border border-primary/30 text-primary glass cursor-default"
              >
                {p}
              </motion.span>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4"
          >
            Unlock Your{" "}
            <span className="gradient-text">Potential</span>
            <br />
            Before <span className="gradient-text">33</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-muted-foreground max-w-md mb-8 leading-relaxed"
          >
            Learn. Build. Earn. Grow — all in one growth platform built for ambitious youth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.a
              href="#journey"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-full font-semibold bg-primary text-primary-foreground glow-sm text-center"
            >
              Start Your Journey
            </motion.a>
            <motion.a
              href="#platform"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-full font-semibold border border-border hover:border-primary/50 text-foreground hover:text-primary transition-colors text-center"
            >
              Explore Platform
            </motion.a>
          </motion.div>
        </div>

        {/* Right - Dashboard Preview Card */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotateY: -5 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:block"
        >
          <div className="glass gradient-border rounded-2xl p-5 glow-md animate-float">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-primary/40" />
              <div className="w-3 h-3 rounded-full bg-secondary/40" />
              <span className="text-xs text-muted-foreground ml-2">Best Version Dashboard</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] text-muted-foreground">Growth Score</span>
                </div>
                <p className="font-display font-bold text-lg">78%</p>
              </div>
              <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[10px] text-muted-foreground">Streak</span>
                </div>
                <p className="font-display font-bold text-lg">14 🔥</p>
              </div>
              <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-[10px] text-muted-foreground">Courses</span>
                </div>
                <p className="font-display font-bold text-lg">12</p>
              </div>
              <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] text-muted-foreground">Badges</span>
                </div>
                <p className="font-display font-bold text-lg">8</p>
              </div>
            </div>
            <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
              <div className="flex justify-between text-[10px] mb-1.5">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="text-primary font-semibold">78%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[78%] rounded-full" style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))" }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
