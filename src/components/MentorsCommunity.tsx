import { motion } from "framer-motion";
import { Users, MessageCircle, Linkedin } from "lucide-react";
import SectionShowcase from "./SectionShowcase";

const mentors = [
  { name: "Dr. Kavita Rao", title: "AI & Machine Learning", expertise: "15+ years in tech leadership", avatar: "KR" },
  { name: "Vikram Desai", title: "Startup Founder", expertise: "Built 3 funded startups", avatar: "VD" },
  { name: "Sarah Chen", title: "UX Design Lead", expertise: "Ex-Google, design mentor", avatar: "SC" },
  { name: "Raj Patel", title: "Marketing Strategist", expertise: "Growth hacking expert", avatar: "RP" },
];

const communities = [
  { name: "Tech", members: "12.4K", color: "border-primary/40" },
  { name: "Design", members: "8.2K", color: "border-secondary/40" },
  { name: "Business", members: "9.7K", color: "border-accent/40" },
  { name: "Content", members: "6.5K", color: "border-glow-blue/40" },
  { name: "Leadership", members: "5.1K", color: "border-primary/40" },
  { name: "Startups", members: "7.8K", color: "border-secondary/40" },
];

const MentorsCommunity = () => (
  <section className="section-padding">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Mentors & Community</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
          Grow With the <span className="gradient-text">Right People</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Connect with experienced mentors and join interest-based communities of ambitious youth.</p>
      </motion.div>

      <SectionShowcase
        imageSrc="/section-media/community-network.svg"
        imageAlt="Community and mentors illustration"
        eyebrow="Connection"
        title="Mentors, rooms, and collaboration in one visual"
        description="The community image now shows mentor sessions, live rooms, and peer connections so the section clearly matches networking, collaboration, and support."
        reverse
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {mentors.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass gradient-border rounded-2xl p-5 text-center hover:glow-sm transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mx-auto mb-3 text-sm font-bold">
              {m.avatar}
            </div>
            <h3 className="font-display font-bold text-sm mb-0.5">{m.name}</h3>
            <p className="text-xs text-primary font-medium mb-1">{m.title}</p>
            <p className="text-xs text-muted-foreground mb-3">{m.expertise}</p>
            <div className="flex justify-center gap-2">
              <button className="px-3 py-1.5 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                Book Session
              </button>
              <button className="p-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="font-display text-xl font-bold text-center mb-6">
          <MessageCircle className="w-5 h-5 inline mr-2 text-primary" />
          Community Rooms
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {communities.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-xl p-4 text-center border ${c.color} hover:scale-105 transition-transform cursor-pointer`}
            >
              <Users className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <p className="font-semibold text-sm mb-0.5">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.members} members</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default MentorsCommunity;
