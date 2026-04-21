import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in backend/.env");
  }

  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};
