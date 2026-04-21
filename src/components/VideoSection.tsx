import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";

const VideoSection = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Watch & Learn</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            See How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Watch how Best Version transforms potential into real-world success.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative aspect-video rounded-2xl overflow-hidden border border-border/50 glow-md"
        >
          {!playing ? (
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer group"
              onClick={() => setPlaying(true)}
              style={{
                background: "linear-gradient(135deg, hsl(225 25% 10%), hsl(225 25% 14%))",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:bg-primary transition-colors"
                style={{ boxShadow: "0 0 40px hsl(190 95% 55% / 0.3)" }}
              >
                <Play size={32} className="text-primary-foreground ml-1" />
              </motion.div>
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <p className="font-display font-semibold text-lg">Best Version Platform Overview</p>
                <p className="text-sm text-muted-foreground mt-1">Learn. Build. Earn. Grow. — Your journey starts here</p>
              </div>
            </div>
          ) : (
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/9KHLTZaJcR8?autoplay=1&rel=0"
              title="Best Version Platform"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
