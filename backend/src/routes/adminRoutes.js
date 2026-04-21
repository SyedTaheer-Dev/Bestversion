import express from "express";
import User from "../models/User.js";
import AuthEvent from "../models/AuthEvent.js";
import KnowledgeEntry from "../models/KnowledgeEntry.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/overview", protect, requireAdmin, async (_req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    adminUsers,
    emailUsers,
    phoneUsers,
    googleUsers,
    recentSignups,
    recentLogins,
    knowledgeEntries,
    recentUsers,
    recentEvents,
    kbEntries,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ authProviders: "email" }),
    User.countDocuments({ authProviders: "phone" }),
    User.countDocuments({ authProviders: "google" }),
    AuthEvent.countDocuments({ eventType: "signup", createdAt: { $gte: sevenDaysAgo } }),
    AuthEvent.countDocuments({ eventType: "login", createdAt: { $gte: twentyFourHoursAgo } }),
    KnowledgeEntry.countDocuments({}),
    User.find({})
      .sort({ createdAt: -1 })
      .limit(12)
      .select("fullName email phone authProviders role createdAt lastLoginAt lastAuthMethod"),
    AuthEvent.find({})
      .sort({ createdAt: -1 })
      .limit(18)
      .populate("user", "fullName email phone role"),
    KnowledgeEntry.find({})
      .sort({ priority: -1, updatedAt: -1 })
      .limit(50),
  ]);

  res.json({
    summary: {
      totalUsers,
      adminUsers,
      emailUsers,
      phoneUsers,
      googleUsers,
      recentSignups,
      recentLogins,
      knowledgeEntries,
    },
    recentUsers: recentUsers.map((user) => ({
      id: user._id.toString(),
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role,
      authProviders: user.authProviders || [],
      lastLoginAt: user.lastLoginAt,
      lastAuthMethod: user.lastAuthMethod || "",
      createdAt: user.createdAt,
    })),
    recentEvents: recentEvents.map((event) => ({
      id: event._id.toString(),
      eventType: event.eventType,
      method: event.method,
      email: event.email,
      phone: event.phone,
      fullName: event.fullName,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      createdAt: event.createdAt,
      user: event.user
        ? {
            id: event.user._id.toString(),
            fullName: event.user.fullName || "",
            email: event.user.email || "",
            phone: event.user.phone || "",
            role: event.user.role || "user",
          }
        : null,
    })),
    knowledgeBase: kbEntries.map((entry) => ({
      id: entry._id.toString(),
      title: entry.title,
      category: entry.category,
      keywords: entry.keywords || [],
      content: entry.content,
      priority: entry.priority || 50,
      isPublished: entry.isPublished,
      updatedAt: entry.updatedAt,
      createdAt: entry.createdAt,
    })),
  });
});

router.post("/knowledge-base", protect, requireAdmin, async (req, res) => {
  try {
    const { title, category = "general", keywords = [], content, priority = 50, isPublished = true } = req.body || {};

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const entry = await KnowledgeEntry.create({
      title: title.trim(),
      category,
      keywords: Array.isArray(keywords)
        ? keywords.map((value) => String(value).trim()).filter(Boolean)
        : String(keywords || "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
      content: content.trim(),
      priority: Number(priority || 50),
      isPublished: Boolean(isPublished),
      createdBy: req.user?._id || null,
    });

    return res.status(201).json({
      message: "Knowledge entry created",
      entry: {
        id: entry._id.toString(),
        title: entry.title,
        category: entry.category,
        keywords: entry.keywords || [],
        content: entry.content,
        priority: entry.priority || 50,
        isPublished: entry.isPublished,
        updatedAt: entry.updatedAt,
        createdAt: entry.createdAt,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "A knowledge entry with this title already exists" });
    }
    return res.status(500).json({ message: "Could not create knowledge entry" });
  }
});

router.put("/knowledge-base/:id", protect, requireAdmin, async (req, res) => {
  try {
    const { title, category = "general", keywords = [], content, priority = 50, isPublished = true } = req.body || {};

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const entry = await KnowledgeEntry.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        category,
        keywords: Array.isArray(keywords)
          ? keywords.map((value) => String(value).trim()).filter(Boolean)
          : String(keywords || "")
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean),
        content: content.trim(),
        priority: Number(priority || 50),
        isPublished: Boolean(isPublished),
      },
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ message: "Knowledge entry not found" });
    }

    return res.json({
      message: "Knowledge entry updated",
      entry: {
        id: entry._id.toString(),
        title: entry.title,
        category: entry.category,
        keywords: entry.keywords || [],
        content: entry.content,
        priority: entry.priority || 50,
        isPublished: entry.isPublished,
        updatedAt: entry.updatedAt,
        createdAt: entry.createdAt,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "A knowledge entry with this title already exists" });
    }
    return res.status(500).json({ message: "Could not update knowledge entry" });
  }
});

router.delete("/knowledge-base/:id", protect, requireAdmin, async (req, res) => {
  const deleted = await KnowledgeEntry.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: "Knowledge entry not found" });
  }

  return res.json({ message: "Knowledge entry deleted" });
});

export default router;
