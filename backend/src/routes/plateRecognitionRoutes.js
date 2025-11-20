import express from 'express';
import multer from 'multer';
import { recognizePlate, validateExit } from '../controllers/plateRecognitionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configurar multer para almacenar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Solo aceptar imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

// @route   POST /api/plate-recognition/scan
// @desc    Reconocer placa de una imagen
// @access  Private
router.post('/scan', protect, upload.single('photo'), recognizePlate);

// @route   POST /api/plate-recognition/validate-exit
// @desc    Validar si el vehículo puede salir (verificar pago)
// @access  Private
router.post('/validate-exit', protect, upload.single('photo'), validateExit);

export default router;
