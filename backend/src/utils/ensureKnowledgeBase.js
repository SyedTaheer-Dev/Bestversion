import KnowledgeEntry from "../models/KnowledgeEntry.js";

const defaultEntries = [
  {
    title: "Account login and signup help",
    category: "support",
    keywords: ["login", "sign up", "signup", "register", "email", "account", "auth"],
    priority: 95,
    content:
      "Users can create an account with email and password, phone OTP, or Google sign-in when Google is configured. Login and signup happen from the /auth page. If email login fails, confirm the email and password first. If phone OTP is used, request a fresh 6-digit code and enter the newest OTP only.",
  },
  {
    title: "Password reset help",
    category: "support",
    keywords: ["reset", "forgot password", "password", "email reset"],
    priority: 88,
    content:
      "Password reset starts from the Reset tab on the auth page. The backend can send a reset email when SMTP is configured. In local testing mode, the app can return a reset link directly so the password can be changed without email delivery.",
  },
  {
    title: "Platform overview",
    category: "platform",
    keywords: ["platform", "website", "best version", "what is this", "features"],
    priority: 92,
    content:
      "Best Version is a secure growth platform for students, professionals, creators, leaders, and entrepreneurs. It combines skill-building, talent discovery, mentorship, gigs, internships, challenges, community rooms, a dashboard, and an admin panel in one place.",
  },
  {
    title: "Where to find opportunities",
    category: "platform",
    keywords: ["gigs", "internships", "jobs", "opportunities", "freelance", "career"],
    priority: 86,
    content:
      "Users can browse opportunities from the homepage and from the dedicated opportunities area. The platform highlights internships, freelance gigs, competitions, startup challenges, and job openings for early-career growth.",
  },
  {
    title: "Dashboard and learning flow",
    category: "platform",
    keywords: ["dashboard", "mentors", "challenges", "growth", "streak", "bookings"],
    priority: 82,
    content:
      "After login, users can open the dashboard to see their profile progress, streaks, recent activity, mentorship bookings, gig applications, and challenge updates. Mentors, gigs, and challenges each have separate pages for action and tracking.",
  },
  {
    title: "Personal assistant guidance",
    category: "personal",
    keywords: ["career", "confused", "recommend", "suggest", "personal", "help me choose"],
    priority: 80,
    content:
      "When a user is unsure where to start, guide them toward the most relevant platform path: Skills for learning, Talents for discovery, Platform for available tools, Mentors for guidance, Opportunities for internships or gigs, and Challenges for daily momentum.",
  },
  {
    title: "Admin panel visibility",
    category: "admin",
    keywords: ["admin", "users", "signups", "logins", "tracking", "activity"],
    priority: 90,
    content:
      "The admin panel shows recent users, recent auth events, signup and login counts, and the method used for each event such as email, phone OTP, or Google. Admins can also manage the chatbot knowledge base from the same panel.",
  },
  {
    title: "Basic troubleshooting",
    category: "support",
    keywords: ["error", "not working", "stuck", "backend", "server", "port", "cookie"],
    priority: 84,
    content:
      "If the site is not working, check that the backend is running, MongoDB is connected, and the frontend and backend ports match the environment variables. If auth feels broken, clear old sessions, restart both servers, and confirm the API health endpoint returns status ok.",
  },
];

export const ensureKnowledgeBase = async () => {
  for (const entry of defaultEntries) {
    await KnowledgeEntry.findOneAndUpdate(
      { title: entry.title },
      { $setOnInsert: entry },
      { upsert: true, new: true }
    );
  }
};
