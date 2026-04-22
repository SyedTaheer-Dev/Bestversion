import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import mentorsRoutes from "./routes/mentorsRoutes.js";
import gigsRoutes from "./routes/gigsRoutes.js";
import challengesRoutes from "./routes/challengesRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { ensureAdminUser } from "./utils/ensureAdminUser.js";
import { ensureKnowledgeBase } from "./utils/ensureKnowledgeBase.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

const normalizeOrigin = (url) => (url ? url.replace(/\/$/, "") : url);

const staticAllowedOrigins = [
  normalizeOrigin(process.env.FRONTEND_URL),
  normalizeOrigin(process.env.CLIENT_URL),
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "https://bestversion.vercel.app",
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = normalizeOrigin(origin);

  if (staticAllowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  // Allow Vercel preview deployments
  if (/^https:\/\/bestversion.*\.vercel\.app$/.test(normalizedOrigin)) {
    return true;
  }

  return false;
};

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Bestversion backend is running",
    health: "/api/health",
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    port,
    allowedOrigins: staticAllowedOrigins,
    cookieMode: true,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/mentors", mentorsRoutes);
app.use("/api/gigs", gigsRoutes);
app.use("/api/challenges", challengesRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/*", (_req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((err, _req, res, _next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: err.message || "Internal server error" });
});

connectDB()
  .then(async () => {
    await ensureAdminUser();
    await ensureKnowledgeBase();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
      console.log(`Allowed frontend origins: ${staticAllowedOrigins.join(", ")}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });