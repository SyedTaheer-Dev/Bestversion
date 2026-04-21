import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const ensureAdminUser = async () => {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@bestversion.com").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const adminName = process.env.ADMIN_NAME || "Best Version Admin";

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      fullName: adminName,
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      authProviders: ["email"],
      role: "admin",
      lastAuthMethod: "email",
    });
    console.log(`Admin user created for ${adminEmail}`);
    return;
  }

  let dirty = false;
  if (admin.role !== "admin") {
    admin.role = "admin";
    dirty = true;
  }
  if (!admin.password) {
    admin.password = await bcrypt.hash(adminPassword, 10);
    dirty = true;
  }
  if (!admin.fullName) {
    admin.fullName = adminName;
    dirty = true;
  }
  if (!admin.authProviders.includes("email")) {
    admin.authProviders.push("email");
    dirty = true;
  }

  if (dirty) {
    await admin.save();
  }
};
