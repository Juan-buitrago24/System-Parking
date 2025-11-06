import express from "express";
import {
  getDailyIncome,
  getReportByVehicleType,
  getReportByPaymentMethod,
  getReportSummary,
  getPaymentsList,
  getTopVehicles
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de reportes
router.get("/daily-income", getDailyIncome);
router.get("/by-vehicle-type", getReportByVehicleType);
router.get("/by-payment-method", getReportByPaymentMethod);
router.get("/summary", getReportSummary);
router.get("/payments-list", getPaymentsList);
router.get("/top-vehicles", getTopVehicles);

export default router;
