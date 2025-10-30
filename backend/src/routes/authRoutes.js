import express from "express";
import {
  register,
  login,
  verifyAccount,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  logout
} from "../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
  validateEmail,
  validateResetPassword,
  validateUpdateProfile
} from "../middleware/validationMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/verify/:token", verifyAccount);
router.post("/forgot-password", validateEmail, forgotPassword);
router.post("/reset-password/:token", validateResetPassword, resetPassword);

// Rutas protegidas (requieren autenticación)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, validateUpdateProfile, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/logout", protect, logout);

export default router;
