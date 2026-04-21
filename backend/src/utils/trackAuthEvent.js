import AuthEvent from "../models/AuthEvent.js";

export const trackAuthEvent = async ({ req, user, eventType, method }) => {
  try {
    await AuthEvent.create({
      user: user?._id || null,
      eventType,
      method,
      email: user?.email || "",
      phone: user?.phone || "",
      fullName: user?.fullName || "",
      ipAddress: req?.headers["x-forwarded-for"]?.toString()?.split(",")[0]?.trim() || req?.socket?.remoteAddress || "",
      userAgent: req?.get?.("user-agent") || "",
    });
  } catch (error) {
    console.error("Auth event tracking failed:", error.message);
  }
};
