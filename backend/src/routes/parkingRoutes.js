import express from "express";
import {
  createSpace,
  getSpaces,
  getSpace,
  updateSpace,
  deleteSpace,
  assignSpace,
  autoAssign,
  releaseSpace
} from "../controllers/parkingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// CRUD
router.post("/", createSpace);
router.get("/", getSpaces);
router.get("/:id", getSpace);
router.put("/:id", updateSpace);
router.delete("/:id", deleteSpace);

// Operaciones específicas
router.post("/:id/assign", assignSpace);
router.post("/auto-assign", autoAssign);
router.post("/:id/release", releaseSpace);

export default router;

