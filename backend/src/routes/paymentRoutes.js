import express from "express";
import {
  calculatePayment,
  registerPayment,
  getPayments,
  getPayment,
  processRefund,
  getPaymentStats
} from "../controllers/paymentController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas públicas para operadores
router.post("/calculate", calculatePayment);
router.post("/", registerPayment);
router.get("/", getPayments);
router.get("/stats/summary", getPaymentStats);
router.get("/:id", getPayment);

// Rutas solo para administradores
router.post("/:id/refund", restrictTo("ADMIN"), processRefund);

export default router;
