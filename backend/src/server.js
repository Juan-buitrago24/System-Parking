import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import parkingRoutes from "./routes/parkingRoutes.js";
import rateRoutes from "./routes/rateRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import plateRecognitionRoutes from "./routes/plateRecognitionRoutes.js";

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚗 System Parking API v1.0",
    endpoints: {
      auth: "/api/auth",
      vehicles: "/api/vehicles",
      parkingSpaces: "/api/parking-spaces",
      rates: "/api/rates",
      payments: "/api/payments",
      reports: "/api/reports",
      plateRecognition: "/api/plate-recognition",
      docs: "/api/docs"
    }
  });
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de vehículos
app.use("/api/vehicles", vehicleRoutes);

// Rutas de espacios de parqueo
app.use("/api/parking-spaces", parkingRoutes);

// Rutas de tarifas
app.use("/api/rates", rateRoutes);

// Rutas de pagos
app.use("/api/payments", paymentRoutes);

// Rutas de reportes
app.use("/api/reports", reportRoutes);

// Rutas de reconocimiento de placas
app.use("/api/plate-recognition", plateRecognitionRoutes);

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada"
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor"
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
});
