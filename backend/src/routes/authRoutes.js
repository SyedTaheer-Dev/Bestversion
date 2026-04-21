import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import UserStreak from "../models/UserStreak.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import PhoneOtp from "../models/PhoneOtp.js";
import { generateToken } from "../utils/generateToken.js";
import { clearAuthCookie, setAuthCookie } from "../utils/authCookies.js";
import { protect } from "../middleware/auth.js";
import { trackAuthEvent } from "../utils/trackAuthEvent.js";

const router = express.Router();

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  fullName: user.fullName || "",
  email: user.email || "",
  phone: user.phone || "",
  avatarUrl: user.avatarUrl || "",
  role: user.role || "user",
  isAdmin: user.role === "admin",
  lastLoginAt: user.lastLoginAt || null,
  lastAuthMethod: user.lastAuthMethod || "",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const ensureUserStreak = async (userId) => {
  const existing = await UserStreak.findOne({ user: userId });
  if (!existing) {
    await UserStreak.create({ user: userId });
  }
};

const issueAuth = async (req, res, user, { statusCode = 200, eventType = "login", method = "email" } = {}) => {
  await ensureUserStreak(user._id);

  user.lastLoginAt = new Date();
  user.lastAuthMethod = method;
  await user.save();

  const token = generateToken(user._id.toString());
  setAuthCookie(res, token);

  await trackAuthEvent({ req, user, eventType, method });

  return res.status(statusCode).json({
    user: sanitizeUser(user),
    token,
  });
};

const sendResetEmail = async (email, resetUrl) => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM;

  if (!host || !user || !pass || !from) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: "Reset your Best Version password",
    html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  return true;
};

const hashOtp = (phone, code) => crypto.createHash("sha256").update(`${phone}:${code}`).digest("hex");
const normalizePhone = (phone = "") => phone.replace(/[^\d+]/g, "").trim();

router.post("/register", async (req, res) => {
  try {
    const { fullName = "", email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      authProviders: ["email"],
    });

    return issueAuth(req, res, user, { statusCode: 201, eventType: "signup", method: "email" });
  } catch {
    return res.status(500).json({ message: "Could not create account" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return issueAuth(req, res, user, { eventType: "login", method: "email" });
  } catch {
    return res.status(500).json({ message: "Could not sign in" });
  }
});

router.post("/logout", protect, async (req, res) => {
  clearAuthCookie(res);
  await trackAuthEvent({ req, user: req.user, eventType: "logout", method: req.user.lastAuthMethod || "email" });
  return res.json({ message: "Signed out successfully" });
});

router.post("/phone-otp/send", async (req, res) => {
  try {
    const { phone, fullName = "" } = req.body;
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone || normalizedPhone.length < 10) {
      return res.status(400).json({ message: "Enter a valid phone number" });
    }

    await PhoneOtp.deleteMany({ phone: normalizedPhone });

    const isDemoMode = process.env.OTP_DEMO_MODE !== "false";
    const code = String(Math.floor(100000 + Math.random() * 900000));

    await PhoneOtp.create({
      phone: normalizedPhone,
      codeHash: hashOtp(normalizedPhone, code),
      fullName,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return res.json({
      message: isDemoMode
        ? "New demo OTP generated. Use the latest code shown in the response."
        : "OTP sent successfully.",
      demoCode: isDemoMode ? code : undefined,
    });
  } catch {
    return res.status(500).json({ message: "Could not send OTP" });
  }
});

router.post("/phone-otp/verify", async (req, res) => {
  try {
    const { phone, code, fullName = "" } = req.body;
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone || !code) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    const otpRecord = await PhoneOtp.findOne({ phone: normalizedPhone }).sort({ createdAt: -1 });
    if (!otpRecord || otpRecord.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired. Request a new code." });
    }

    const valid = otpRecord.codeHash === hashOtp(normalizedPhone, code);
    if (!valid) {
      return res.status(401).json({ message: "Invalid OTP code" });
    }

    let user = await User.findOne({ phone: normalizedPhone });
    const eventType = user ? "login" : "signup";
    if (!user) {
      user = await User.create({
        fullName: fullName || otpRecord.fullName || "Best Version Member",
        phone: normalizedPhone,
        authProviders: ["phone"],
      });
    } else {
      if (fullName && !user.fullName) user.fullName = fullName;
      if (!user.authProviders.includes("phone")) user.authProviders.push("phone");
      await user.save();
    }

    await PhoneOtp.deleteMany({ phone: normalizedPhone });
    return issueAuth(req, res, user, { eventType, method: "phone" });
  } catch {
    return res.status(500).json({ message: "Could not verify OTP" });
  }
});

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      return res.status(400).json({ message: "Google sign-in is not configured" });
    }

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!response.ok) {
      return res.status(401).json({ message: "Google token could not be verified" });
    }

    const payload = await response.json();
    if (payload.aud !== googleClientId) {
      return res.status(401).json({ message: "Google client mismatch" });
    }

    const email = payload.email?.toLowerCase()?.trim();
    if (!email) {
      return res.status(400).json({ message: "Google account email is missing" });
    }

    let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] });
    const eventType = user ? "login" : "signup";
    if (!user) {
      user = await User.create({
        fullName: payload.name || email.split("@")[0],
        email,
        googleId: payload.sub,
        avatarUrl: payload.picture || "",
        authProviders: ["google"],
      });
    } else {
      user.fullName = user.fullName || payload.name || user.fullName;
      user.email = user.email || email;
      user.googleId = user.googleId || payload.sub;
      user.avatarUrl = user.avatarUrl || payload.picture || "";
      if (!user.authProviders.includes("google")) user.authProviders.push("google");
      await user.save();
    }

    return issueAuth(req, res, user, { eventType, method: "google" });
  } catch {
    return res.status(500).json({ message: "Google sign-in failed" });
  }
});

router.get("/me", protect, async (req, res) => res.json({ user: sanitizeUser(req.user) }));

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been prepared." });
    }

    await PasswordResetToken.deleteMany({ user: user._id });
    const token = crypto.randomBytes(32).toString("hex");
    await PasswordResetToken.create({
      user: user._id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30),
    });

    const frontendUrl = process.env.RESET_PASSWORD_URL || `${process.env.FRONTEND_URL || "http://localhost:8081"}/reset-password`;
    const resetUrl = frontendUrl.includes("?") ? `${frontendUrl}&token=${token}` : `${frontendUrl}?token=${token}`;
    const emailSent = await sendResetEmail(user.email, resetUrl).catch(() => false);

    return res.json({
      message: emailSent
        ? "Password reset link sent to your email."
        : "SMTP is not configured. Use the reset link below for local testing.",
      resetUrl: emailSent ? undefined : resetUrl,
    });
  } catch {
    return res.status(500).json({ message: "Could not start password reset" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    const record = await PasswordResetToken.findOne({ token }).populate("user");
    if (!record || record.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    const user = await User.findById(record.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.email = user.email || record.user.email;
    if (!user.authProviders.includes("email")) user.authProviders.push("email");
    await user.save();
    await PasswordResetToken.deleteMany({ user: record.user._id });

    return res.json({ message: "Password updated successfully" });
  } catch {
    return res.status(500).json({ message: "Could not reset password" });
  }
});

export default router;
