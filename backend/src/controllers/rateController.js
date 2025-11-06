import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// @desc    Crear tarifa
// @route   POST /api/rates
// @access  Private (Admin)
export const createRate = async (req, res) => {
  try {
    const { name, description, vehicleType, rateType, amount, minTime, validUntil } = req.body;

    // Validaciones
    if (!name || !vehicleType || !rateType || !amount) {
      return res.status(400).json({
        success: false,
        message: "Campos requeridos: name, vehicleType, rateType, amount"
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "El monto debe ser mayor a 0"
      });
    }

    const rate = await prisma.rate.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        vehicleType,
        rateType,
        amount: parseFloat(amount),
        minTime: minTime ? parseInt(minTime) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        isActive: true
      }
    });

    res.status(201).json({
      success: true,
      message: "Tarifa creada exitosamente",
      data: rate
    });
  } catch (error) {
    console.error("Error en createRate:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear tarifa"
    });
  }
};

// @desc    Obtener todas las tarifas
// @route   GET /api/rates
// @access  Private
export const getRates = async (req, res) => {
  try {
    const { isActive, vehicleType } = req.query;
    
    const where = {};
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (vehicleType) where.vehicleType = vehicleType;

    const rates = await prisma.rate.findMany({
      where,
      orderBy: [
        { isActive: 'desc' },
        { vehicleType: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.status(200).json({
      success: true,
      count: rates.length,
      data: rates
    });
  } catch (error) {
    console.error("Error en getRates:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener tarifas"
    });
  }
};

// @desc    Obtener tarifa por ID
// @route   GET /api/rates/:id
// @access  Private
export const getRate = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rate = await prisma.rate.findUnique({
      where: { id: parseInt(id) }
    });

    if (!rate) {
      return res.status(404).json({
        success: false,
        message: "Tarifa no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      data: rate
    });
  } catch (error) {
    console.error("Error en getRate:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener tarifa"
    });
  }
};

// @desc    Obtener tarifas activas por tipo de vehículo
// @route   GET /api/rates/active/:vehicleType
// @access  Private
export const getActiveRatesByType = async (req, res) => {
  try {
    const { vehicleType } = req.params;
    
    const rates = await prisma.rate.findMany({
      where: {
        vehicleType,
        isActive: true,
        OR: [
          { validUntil: null },
          { validUntil: { gte: new Date() } }
        ]
      },
      orderBy: { rateType: 'asc' }
    });

    res.status(200).json({
      success: true,
      count: rates.length,
      data: rates
    });
  } catch (error) {
    console.error("Error en getActiveRatesByType:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener tarifas activas"
    });
  }
};

// @desc    Actualizar tarifa
// @route   PUT /api/rates/:id
// @access  Private (Admin)
export const updateRate = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};

    // Solo actualizar campos proporcionados
    if (req.body.name !== undefined) updateData.name = req.body.name.trim();
    if (req.body.description !== undefined) updateData.description = req.body.description?.trim() || null;
    if (req.body.amount !== undefined) {
      const amount = parseFloat(req.body.amount);
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "El monto debe ser mayor a 0"
        });
      }
      updateData.amount = amount;
    }
    if (req.body.minTime !== undefined) updateData.minTime = req.body.minTime ? parseInt(req.body.minTime) : null;
    if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;
    if (req.body.validUntil !== undefined) updateData.validUntil = req.body.validUntil ? new Date(req.body.validUntil) : null;

    const rate = await prisma.rate.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.status(200).json({
      success: true,
      message: "Tarifa actualizada exitosamente",
      data: rate
    });
  } catch (error) {
    console.error("Error en updateRate:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: "Tarifa no encontrada"
      });
    }
    res.status(500).json({
      success: false,
      message: "Error al actualizar tarifa"
    });
  }
};

// @desc    Eliminar tarifa (soft delete - desactivar)
// @route   DELETE /api/rates/:id
// @access  Private (Admin)
export const deleteRate = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete - solo desactivar
    const rate = await prisma.rate.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    });

    res.status(200).json({
      success: true,
      message: "Tarifa desactivada exitosamente",
      data: rate
    });
  } catch (error) {
    console.error("Error en deleteRate:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: "Tarifa no encontrada"
      });
    }
    res.status(500).json({
      success: false,
      message: "Error al eliminar tarifa"
    });
  }
};
