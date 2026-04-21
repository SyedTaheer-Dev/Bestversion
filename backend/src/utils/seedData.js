import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Mentor from "../models/Mentor.js";
import Gig from "../models/Gig.js";
import Challenge from "../models/Challenge.js";

dotenv.config();

const today = new Date().toISOString().split("T")[0];

const mentors = [
  {
    name: "Ananya Rao",
    title: "Product Manager at ScaleUp",
    expertise: ["Product", "Career Growth", "Startups"],
    bio: "Helps early talent break into product, sharpen thinking, and build strong portfolios.",
    avatarUrl: "/section-media/mentor-ananya.svg",
    hourlyRate: 1499,
    available: true,
  },
  {
    name: "Rohan Mehta",
    title: "Frontend Lead",
    expertise: ["React", "UI Engineering", "Interviews"],
    bio: "Frontend mentor focused on real projects, clean code, and interview readiness.",
    avatarUrl: "/section-media/mentor-rohan.svg",
    hourlyRate: 1299,
    available: true,
  },
  {
    name: "Sarah Khan",
    title: "Growth Marketer",
    expertise: ["Marketing", "Personal Branding", "Content"],
    bio: "Guides students and early-career professionals on digital growth and visibility.",
    avatarUrl: "/section-media/mentor-sarah.svg",
    hourlyRate: 999,
    available: true,
  },
];

const gigs = [
  {
    title: "Frontend Intern",
    company: "Best Version Labs",
    description: "Work on landing pages, components, and UI polish for a youth platform.",
    type: "internship",
    location: "Remote",
    salaryRange: "₹15k - ₹25k / month",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    skillsRequired: ["React", "Tailwind", "JavaScript"],
    isActive: true,
  },
  {
    title: "Content Research Gig",
    company: "NextLeap Studio",
    description: "Research careers, internships, and upskilling content for Gen Z users.",
    type: "gig",
    location: "Hybrid",
    salaryRange: "₹8k - ₹12k / project",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    skillsRequired: ["Research", "Writing", "Google Sheets"],
    isActive: true,
  },
  {
    title: "Campus Community Intern",
    company: "SkillSpark",
    description: "Lead campus outreach, partnerships, and student engagement campaigns.",
    type: "internship",
    location: "Bengaluru",
    salaryRange: "₹18k / month",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
    skillsRequired: ["Communication", "Events", "Community"],
    isActive: true,
  },
];

const challenges = [
  {
    title: "Ship a tiny project update",
    description: "Push one useful improvement to your current project today.",
    category: "coding",
    points: 20,
    challengeDate: today,
  },
  {
    title: "Reach out to a mentor",
    description: "Send one thoughtful message to someone you admire in your field.",
    category: "networking",
    points: 15,
    challengeDate: today,
  },
  {
    title: "Learn for 30 focused minutes",
    description: "Study a skill that moves you one step closer to your career goal.",
    category: "learning",
    points: 10,
    challengeDate: today,
  },
];

const seed = async () => {
  await connectDB();

  await Promise.all([
    Mentor.deleteMany({}),
    Gig.deleteMany({}),
    Challenge.deleteMany({ challengeDate: today }),
  ]);

  await Promise.all([
    Mentor.insertMany(mentors),
    Gig.insertMany(gigs),
    Challenge.insertMany(challenges),
  ]);

  console.log("Seed data inserted successfully");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
