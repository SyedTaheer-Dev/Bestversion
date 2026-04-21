import express from "express";
import KnowledgeEntry from "../models/KnowledgeEntry.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

const WEBSITE_CONTEXT = [
  "Best Version is a secure growth platform with sections for Vision, Skills, Talents, Platform, Journey, Features, Mentors, Community, Opportunities, and Challenges.",
  "Users can sign up or log in with email, phone OTP, and Google sign-in when Google is configured.",
  "Core logged-in pages include Dashboard, Mentors, Gigs/Opportunities, Challenges, and an Admin panel for admins.",
  "The assistant should handle simple Q&A, website support, personal guidance, and answers based on the admin knowledge base.",
].join(" ");

const SUPPORT_HINTS = [
  {
    match: ["login", "sign in", "signin", "signup", "sign up", "register", "account"],
    answer:
      "You can use the Auth page to sign up or log in with email and password. Phone OTP is also available, and Google sign-in works when the Google client is configured.",
  },
  {
    match: ["otp", "phone", "code"],
    answer:
      "For phone OTP, request a fresh code and use only the latest 6-digit OTP. If a previous code fails, generate a new one and try again.",
  },
  {
    match: ["reset", "forgot password", "password"],
    answer:
      "Use the Reset tab on the auth page. If SMTP is configured, the platform sends an email. In local testing, it can also return a direct reset link.",
  },
  {
    match: ["admin", "activity", "track users", "signups", "logins"],
    answer:
      "Admins can open the admin panel to see recent users, auth methods, signup counts, login counts, and recent auth events.",
  },
  {
    match: ["mentor", "gigs", "opportunity", "challenge", "dashboard"],
    answer:
      "After login, users can open Dashboard for progress, Mentors for sessions, Opportunities for gigs and internships, and Challenges for daily tasks and streaks.",
  },
];

const normalize = (value = "") => value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");

const tokenize = (value = "") => normalize(value).split(/\s+/).filter(Boolean);

const scoreEntry = (entry, queryTokens, fullQuery) => {
  let score = Number(entry.priority || 0);
  const haystack = normalize(`${entry.title} ${entry.category} ${(entry.keywords || []).join(" ")} ${entry.content}`);

  queryTokens.forEach((token) => {
    if (token.length < 2) return;
    if (haystack.includes(token)) score += token.length > 5 ? 5 : 3;
  });

  (entry.keywords || []).forEach((keyword) => {
    if (fullQuery.includes(normalize(keyword))) score += 8;
  });

  if (fullQuery.includes(normalize(entry.title))) score += 10;

  return score;
};

const selectKnowledge = async (question) => {
  const entries = await KnowledgeEntry.find({ isPublished: true }).sort({ priority: -1, updatedAt: -1 }).lean();
  const fullQuery = normalize(question);
  const queryTokens = tokenize(question);

  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry, queryTokens, fullQuery) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.entry);
};

const buildKnowledgeContext = (entries) => {
  if (!entries.length) return "No admin knowledge entries matched strongly, so answer from core website context only.";

  return entries
    .map(
      (entry, index) =>
        `${index + 1}. [${entry.category}] ${entry.title}\nKeywords: ${(entry.keywords || []).join(", ") || "none"}\nAnswer notes: ${entry.content}`
    )
    .join("\n\n");
};

const buildLocalReply = ({ question, entries, user }) => {
  const q = normalize(question);
  const matchedHint = SUPPORT_HINTS.find((hint) => hint.match.some((term) => q.includes(term)));

  const intro = user?.fullName ? `Hi ${user.fullName.split(" ")[0]}! ` : "";
  const knowledgeReply = entries[0]?.content || "I can help with platform guidance, auth help, and admin knowledge questions.";

  if (matchedHint) {
    return `${intro}${matchedHint.answer}\n\nHelpful context: ${knowledgeReply}`;
  }

  if (q.includes("what should i do") || q.includes("where should i start") || q.includes("recommend")) {
    return `${intro}Start with the path that matches your goal: Skills for learning, Talents for discovery, Mentors for guidance, Opportunities for internships or gigs, and Challenges for daily momentum. ${knowledgeReply}`;
  }

  return `${intro}${knowledgeReply}`;
};

const callGemini = async ({ messages, knowledgeContext, user }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const systemText = [
    "You are Best Version AI, a concise and helpful assistant for the Best Version platform.",
    "You handle four jobs: simple Q&A, website support, personal assistant guidance, and answers grounded in the admin knowledge base.",
    "Keep answers practical, short, and easy to follow.",
    "Only claim website features that exist in the provided context.",
    "If something is not configured or you are unsure, say that clearly instead of guessing.",
    `Core website context: ${WEBSITE_CONTEXT}`,
    `Logged-in user context: ${user ? `Name: ${user.fullName || "Member"}, role: ${user.role || "user"}` : "Guest user"}`,
    `Admin knowledge base context:\n${knowledgeContext}`,
  ].join("\n\n");

  const contents = messages
    .filter((msg) => msg?.content)
    .map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: String(msg.content) }],
    }));

  if (!contents.length) {
    contents.push({ role: "user", parts: [{ text: "Say hello and explain how you can help." }] });
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemText }] },
      contents,
      generationConfig: {
        temperature: 0.5,
        topP: 0.9,
        maxOutputTokens: 500,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Gemini request failed.");
    throw new Error(errorText || "Gemini request failed.");
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim() || null;
};

router.post("/", optionalAuth, async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const lastMessage = messages[messages.length - 1]?.content || "";

    if (!lastMessage.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const entries = await selectKnowledge(lastMessage);
    const knowledgeContext = buildKnowledgeContext(entries);

    let reply = null;
    let provider = "local-knowledge";

    try {
      reply = await callGemini({ messages, knowledgeContext, user: req.user || null });
      if (reply) provider = "gemini";
    } catch (error) {
      console.error("Gemini chat failed, falling back to local knowledge:", error.message);
    }

    if (!reply) {
      reply = buildLocalReply({ question: lastMessage, entries, user: req.user || null });
    }

    return res.json({
      reply,
      provider,
      matchedKnowledge: entries.map((entry) => ({
        id: entry._id.toString(),
        title: entry.title,
        category: entry.category,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Chat request failed" });
  }
});

export default router;
