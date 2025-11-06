import express from "express";
import {
  createRate,
  getRates,
  getRate,
  getActiveRatesByType,
  updateRate,
  deleteRate
} from "../controllers/rateController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas públicas (para empleados)
router.get("/", getRates);
router.get("/:id", getRate);
router.get("/active/:vehicleType", getActiveRatesByType);

// Rutas solo para administradores
router.post("/", restrictTo("ADMIN"), createRate);
router.put("/:id", restrictTo("ADMIN"), updateRate);
router.delete("/:id", restrictTo("ADMIN"), deleteRate);

export default router;
