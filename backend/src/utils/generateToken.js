import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generar JWT token
export const generateJWT = (userId, email, role) => {
  return jwt.sign(
    { 
      id: userId, 
      email, 
      role 
    },
    process.env.JWT_SECRET || "your-secret-key-change-in-production",
    { expiresIn: "7d" }
  );
};

// Generar token aleatorio para verificación/reset
export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Verificar JWT token
export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-change-in-production");
  } catch (error) {
    return null;
  }
};
