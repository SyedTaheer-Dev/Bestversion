import { motion } from "framer-motion";
import {
  Brain, BarChart3, Zap, Calendar, Flame, Medal,
  FolderOpen, FileText, BookOpen, Users, Rss, Wallet,
  Award, Filter, ScrollText, Mic, Briefcase, Code,
  UserPlus, Trophy
} from "lucide-react";
import SectionShowcase from "./SectionShowcase";

const advancedFeatures = [
  { icon: Brain, title: "AI Career Path Recommender", desc: "Personalized growth paths based on talent, interests, and test results" },
  { icon: BarChart3, title: "AI Skill Gap Analyzer", desc: "See what skills you have and what you need to improve" },
  { icon: Zap, title: "Personalized Dashboard", desc: "Smart dashboard with progress, courses, projects, badges, and opportunities" },
  { icon: Calendar, title: "Daily Challenges", desc: "Mini tasks and growth missions you can complete every day" },
  { icon: Flame, title: "Streak System", desc: "Rewards for consistent learning and participation" },
  { icon: Medal, title: "Achievement Milestones", desc: "Track milestones from first skill to first earning" },
  { icon: FolderOpen, title: "Smart Portfolio Builder", desc: "Auto-generate portfolio from projects, achievements, and skills" },
  { icon: FileText, title: "Resume Generator", desc: "Create a clean resume from your activity and achievements" },
  { icon: BookOpen, title: "Mentor Booking System", desc: "Connect with and book sessions with experienced mentors" },
  { icon: UserPlus, title: "Startup Team Matchmaking", desc: "Find co-founders, designers, marketers, and developers" },
  { icon: Rss, title: "Opportunity Feed", desc: "Curated feed for internships, gigs, competitions, and jobs" },
  { icon: Users, title: "Community Rooms", desc: "Interest-based communities: Tech, Design, Business, Content, and more" },
  { icon: Wallet, title: "Rewards Wallet", desc: "Earn coins, points, and rewards through participation" },
  { icon: Award, title: "Badge System", desc: "Premium badges: Learner, Builder, Competitor, Creator, Leader" },
  { icon: Filter, title: "Leaderboard Filters", desc: "Rank by skill, city, college, projects, and earnings" },
  { icon: ScrollText, title: "Certificate Showcase", desc: "Display certificates in your profile and portfolio" },
  { icon: Mic, title: "Events & Workshops", desc: "Webinars, career talks, workshops, and competitions" },
  { icon: Briefcase, title: "Internship Tracker", desc: "Track applied, shortlisted, interview, and hired stages" },
  { icon: Code, title: "Freelance Gig Board", desc: "Micro-task opportunities and project-based gigs" },
  { icon: Trophy, title: "Founder Stories", desc: "Inspiring stories of transformed youth journeys" },
];

const AdvancedFeatures = () => (
  <section className="section-padding relative">
    <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-accent/5 blur-[140px] rounded-full -z-10" />
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Advanced Features</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
          Built for the <span className="gradient-text">Future</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Cutting-edge tools powered by AI, gamification, and smart technology to supercharge your growth.</p>
      </motion.div>

      <SectionShowcase
        imageSrc="/section-media/advanced-ai.svg"
        imageAlt="Advanced features illustration"
        eyebrow="AI layer"
        title="AI assistance, insights, and system intelligence"
        description="The advanced layer image now points to AI support, analytics, smart recommendations, admin knowledge answers, and automation without making the page heavy."
        reverse
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {advancedFeatures.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            className="group glass gradient-border rounded-xl p-4 hover:glow-sm transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <f.icon className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AdvancedFeatures;
