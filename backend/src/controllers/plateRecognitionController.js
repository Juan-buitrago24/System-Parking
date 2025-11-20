import axios from 'axios';
import FormData from 'form-data';

/**
 * Reconocer placa usando PlateRecognizer API
 * @param {Buffer} imageBuffer - Buffer de la imagen
 * @returns {Object} - Resultado del reconocimiento
 */
export const recognizePlate = async (req, res) => {
  try {
    // Verificar que se recibió una imagen
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se recibió ninguna imagen'
      });
    }

    // Crear FormData para enviar a la API
    const formData = new FormData();
    formData.append('upload', req.file.buffer, {
      filename: 'plate.jpg',
      contentType: req.file.mimetype
    });

    // Configurar API key (obtener gratis en platerecognizer.com)
    const apiToken = process.env.PLATE_RECOGNIZER_TOKEN;
    
    if (!apiToken) {
      return res.status(500).json({
        success: false,
        message: 'API de reconocimiento no configurada. Agrega PLATE_RECOGNIZER_TOKEN al .env'
      });
    }

    // Llamar a PlateRecognizer API
    // NOTA: mmc (make, model, color) requiere plan de pago
    // En plan gratuito solo detecta: plate, type, region
    const response = await axios.post(
      'https://api.platerecognizer.com/v1/plate-reader/',
      formData,
      {
        headers: {
          'Authorization': `Token ${apiToken}`,
          ...formData.getHeaders()
        },
        params: {
          regions: 'co', // Colombia
          mmc: 'true' // Marca, modelo, color (requiere plan de pago)
        }
      }
    );

    // Verificar si se detectaron placas
    const results = response.data.results;
    
    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se detectó ninguna placa en la imagen',
        suggestion: 'Intenta con: mejor iluminación, más cerca de la placa (1-2m), ángulo frontal, o placa más limpia'
      });
    }

    // Extraer información del primer resultado
    const result = results[0];
    
    // LOG: Ver qué retorna la API
    console.log('🔍 PlateRecognizer API Response:', JSON.stringify({
      plate: result.plate,
      score: result.score,
      vehicle: result.vehicle,
      region: result.region,
      mmc_available: !!(result.vehicle?.color || result.vehicle?.make || result.vehicle?.model)
    }, null, 2));
    
    // Verificar si MMC está disponible
    if (!result.vehicle?.color && !result.vehicle?.make && !result.vehicle?.model) {
      console.log('⚠️ ADVERTENCIA: MMC (Make/Model/Color) no disponible. Posibles razones:');
      console.log('  - Plan gratuito no incluye MMC');
      console.log('  - Imagen no tiene suficiente contexto del vehículo');
      console.log('  - MMC requiere actualización de plan en platerecognizer.com');
    }
    
    // Verificar confianza mínima (50%)
    if (result.score < 0.5) {
      return res.status(400).json({
        success: false,
        message: `Confianza muy baja (${Math.round(result.score * 100)}%). Por favor intenta nuevamente`,
        data: {
          plate: result.plate.toUpperCase(),
          confidence: result.score,
          suggestion: 'Mejora: más luz, más cerca, ángulo frontal, placa limpia'
        }
      });
    }
    
    const plateData = {
      plate: result.plate.toUpperCase().replace(/[^A-Z0-9]/g, ''), // Limpiar placa
      confidence: result.score, // Mantener como decimal para frontend
      vehicleType: mapVehicleType(result.vehicle?.type),
      color: result.vehicle?.color?.[0]?.color || null,
      make: result.vehicle?.make?.[0]?.make || null,
      model: result.vehicle?.model?.[0]?.model || null,
      region: result.region?.code || 'CO',
      orientation: result.orientation || 'UNKNOWN',
      colorConfidence: result.vehicle?.color?.[0]?.confidence || null,
      makeConfidence: result.vehicle?.make?.[0]?.confidence || null,
      // Indicar si MMC no está disponible (plan gratuito)
      mmcAvailable: !!(result.vehicle?.color || result.vehicle?.make || result.vehicle?.model)
    };
    
    // LOG: Ver qué se envía al frontend
    console.log('📤 Datos enviados al frontend:', plateData);
    
    // Mensaje especial si MMC no está disponible
    let message = 'Placa reconocida exitosamente';
    if (!plateData.mmcAvailable) {
      message += '. Color, marca y modelo requieren plan de pago de PlateRecognizer o entrada manual.';
    }

    res.json({
      success: true,
      message,
      data: plateData
    });

  } catch (error) {
    console.error('Error en reconocimiento de placa:', error.response?.data || error.message);
    
    // Manejar errores específicos de la API
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Token de API inválido. Verifica PLATE_RECOGNIZER_TOKEN'
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'Límite de API alcanzado. Espera un momento o mejora tu plan.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al procesar la imagen',
      error: error.message
    });
  }
};

/**
 * Mapear tipo de vehículo de la API a nuestro enum
 */
const mapVehicleType = (apiType) => {
  if (!apiType) return null;
  
  const mapping = {
    'Car': 'CARRO',
    'Sedan': 'CARRO',
    'Hatchback': 'CARRO',
    'SUV': 'CAMIONETA',
    'Pickup': 'CAMIONETA',
    'Truck': 'CAMION',
    'Motorcycle': 'MOTO',
    'Motorbike': 'MOTO',
    'Bike': 'MOTO',
    'Van': 'CAMIONETA',
    'Bus': 'CAMION'
  };
  
  return mapping[apiType] || 'CARRO';
};

/**
 * Validar salida del vehículo
 * Verifica si el vehículo ha pagado antes de autorizar la salida
 */
export const validateExit = async (req, res) => {
  try {
    // 1. Reconocer placa de la imagen
    if (!req.file) {
      return res.status(400).json({
        success: false,
        allowExit: false,
        message: 'No se recibió imagen'
      });
    }

    // Usar la función de reconocimiento internamente
    const formData = new FormData();
    formData.append('upload', req.file.buffer, {
      filename: 'exit.jpg',
      contentType: req.file.mimetype
    });

    const apiToken = process.env.PLATE_RECOGNIZER_TOKEN;
    
    const recognitionResponse = await axios.post(
      'https://api.platerecognizer.com/v1/plate-reader/',
      formData,
      {
        headers: {
          'Authorization': `Token ${apiToken}`,
          ...formData.getHeaders()
        },
        params: { regions: 'co' }
      }
    );

    if (!recognitionResponse.data.results?.length) {
      return res.status(404).json({
        success: false,
        allowExit: false,
        reason: 'NO_PLATE_DETECTED',
        message: 'No se pudo leer la placa. Verificar manualmente.'
      });
    }

    const detectedPlate = recognitionResponse.data.results[0].plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // 2. Buscar vehículo activo en el sistema
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        plate: detectedPlate,
        exitTime: null, // Todavía está dentro
        status: 'ACTIVO'
      },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        allowExit: false,
        reason: 'VEHICLE_NOT_FOUND',
        message: '⚠️ Vehículo no encontrado en el sistema',
        data: { detectedPlate }
      });
    }

    // 3. Verificar si tiene pago
    const latestPayment = vehicle.payments[0];
    const hasPaid = latestPayment && latestPayment.status === 'COMPLETADO';

    if (!hasPaid) {
      // Calcular el monto adeudado
      const duration = Date.now() - new Date(vehicle.entryTime).getTime();
      const hours = Math.ceil(duration / (1000 * 60 * 60));
      const estimatedAmount = hours * 5000; // Estimación simple

      return res.status(403).json({
        success: false,
        allowExit: false,
        reason: 'PAYMENT_REQUIRED',
        message: '🚫 PAGO PENDIENTE - No autorizado para salir',
        data: {
          vehicleId: vehicle.id,
          plate: vehicle.plate,
          vehicleType: vehicle.type,
          ownerName: vehicle.ownerName,
          entryTime: vehicle.entryTime,
          duration: formatDuration(duration),
          estimatedAmount
        }
      });
    }

    // 4. Pago verificado - Autorizar salida
    res.json({
      success: true,
      allowExit: true,
      message: '✅ SALIDA AUTORIZADA',
      data: {
        vehicleId: vehicle.id,
        plate: vehicle.plate,
        vehicleType: vehicle.type,
        paidAmount: latestPayment.amount,
        paymentMethod: latestPayment.method,
        duration: formatDuration(Date.now() - new Date(vehicle.entryTime).getTime()),
        entryTime: vehicle.entryTime
      }
    });

  } catch (error) {
    console.error('Error en validación de salida:', error);
    res.status(500).json({
      success: false,
      allowExit: false,
      message: 'Error al validar salida',
      error: error.message
    });
  }
};

/**
 * Formatear duración en formato legible
 */
const formatDuration = (milliseconds) => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
