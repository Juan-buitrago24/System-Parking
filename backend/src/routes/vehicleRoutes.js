import express from "express";
import {
  registerEntry,
  registerExit,
  searchVehicle,
  listActiveVehicles,
  getVehicleHistory,
  getAllVehicles,
  getStats,
  updateVehicle
} from "../controllers/vehicleController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import {
  validateVehicleEntry,
  validateVehicleExit
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de operaciones principales
router.post("/entry", validateVehicleEntry, registerEntry);
router.post("/exit/:plate", validateVehicleExit, registerExit);

// Rutas de consulta
router.get("/search/:plate", searchVehicle);
router.get("/active", listActiveVehicles);
router.get("/history/:plate", getVehicleHistory);
router.get("/stats", getStats);
router.get("/", getAllVehicles);

// Rutas de actualización
router.put("/:id", updateVehicle);

export default router;
