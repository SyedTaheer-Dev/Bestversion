export type AppUser = {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  role?: "user" | "admin";
  isAdmin?: boolean;
  lastLoginAt?: string | null;
  lastAuthMethod?: "email" | "phone" | "google" | "";
  createdAt?: string;
  updatedAt?: string;
};

export type Mentor = {
  _id: string;
  id?: string;
  name: string;
  title: string;
  expertise: string[];
  bio: string;
  avatarUrl: string;
  hourlyRate: number;
  available: boolean;
};

export type Booking = {
  id: string;
  bookingDate: string;
  status: string;
  notes?: string;
  mentor?: {
    id: string;
    name: string;
    title: string;
  };
};

export type Gig = {
  _id: string;
  id?: string;
  title: string;
  company: string;
  description: string;
  type: string;
  location: string;
  salaryRange: string;
  deadline?: string;
  skillsRequired: string[];
  isActive: boolean;
  createdAt?: string;
};

export type Application = {
  id: string;
  status: string;
  coverLetter?: string;
  createdAt: string;
  gig?: {
    id: string;
    title: string;
    company: string;
  };
};

export type Challenge = {
  _id: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  points: number;
  challengeDate: string;
};

export type UserStreak = {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  lastCompletedDate: string | null;
};

export type AdminSummary = {
  totalUsers: number;
  adminUsers: number;
  emailUsers: number;
  phoneUsers: number;
  googleUsers: number;
  recentSignups: number;
  recentLogins: number;
  knowledgeEntries: number;
};

export type AdminKnowledgeEntry = {
  id: string;
  title: string;
  category: "general" | "support" | "personal" | "admin" | "platform";
  keywords: string[];
  content: string;
  priority: number;
  isPublished: boolean;
  updatedAt: string;
  createdAt: string;
};

export type AdminRecentUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  authProviders: string[];
  lastLoginAt: string | null;
  lastAuthMethod: string;
  createdAt: string;
};

export type AdminAuthEvent = {
  id: string;
  eventType: "signup" | "login" | "logout";
  method: "email" | "phone" | "google";
  email: string;
  phone: string;
  fullName: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: "user" | "admin";
  } | null;
};
