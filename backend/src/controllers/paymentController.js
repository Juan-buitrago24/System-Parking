import { PrismaClient } from "@prisma/client";
import {
  calculateDuration,
  calculateAmount,
  selectBestRate,
  applyDiscount,
  generateReceiptNumber
} from "../utils/calculateParking.js";

const prisma = new PrismaClient();

// @desc    Calcular monto de pago para un vehículo
// @route   POST /api/payments/calculate
// @access  Private
export const calculatePayment = async (req, res) => {
  try {
    const { vehicleId, discount = 0, isPercentage = true } = req.body;

    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: "vehicleId es requerido"
      });
    }

    // Buscar vehículo activo
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: parseInt(vehicleId),
        status: "ACTIVO"
      }
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehículo no encontrado o ya salió"
      });
    }

    // Calcular duración
    const duration = calculateDuration(vehicle.entryTime);

    // Obtener tarifas activas para el tipo de vehículo
    const rates = await prisma.rate.findMany({
      where: {
        vehicleType: vehicle.type,
        isActive: true,
        OR: [
          { validUntil: null },
          { validUntil: { gte: new Date() } }
        ]
      }
    });

    // Seleccionar mejor tarifa
    const selectedRate = selectBestRate(vehicle.type, duration, rates);

    // Calcular monto
    const calculation = calculateAmount(duration, selectedRate);

    // Aplicar descuento
    const finalCalculation = applyDiscount(calculation.subtotal, discount, isPercentage);

    res.status(200).json({
      success: true,
      data: {
        vehicle: {
          id: vehicle.id,
          plate: vehicle.plate,
          type: vehicle.type,
          entryTime: vehicle.entryTime
        },
        duration: {
          actual: calculation.actualHours,
          billed: calculation.billedHours
        },
        rate: calculation.rateInfo,
        subtotal: calculation.subtotal,
        discount: finalCalculation.discount,
        total: finalCalculation.total
      }
    });
  } catch (error) {
    console.error("Error en calculatePayment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al calcular pago"
    });
  }
};

// @desc    Registrar pago y salida de vehículo
// @route   POST /api/payments
// @access  Private
export const registerPayment = async (req, res) => {
  try {
    const {
      vehicleId,
      method,
      discount = 0,
      isPercentage = true,
      notes
    } = req.body;

    // Validaciones
    if (!vehicleId || !method) {
      return res.status(400).json({
        success: false,
        message: "vehicleId y method son requeridos"
      });
    }

    // Buscar vehículo activo
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: parseInt(vehicleId),
        status: "ACTIVO"
      },
      include: {
        parkingSpaceRel: true
      }
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehículo no encontrado o ya salió"
      });
    }

    // Verificar que no tenga pagos pendientes
    const existingPayment = await prisma.payment.findFirst({
      where: {
        vehicleId: parseInt(vehicleId),
        status: { in: ["PENDIENTE", "PAGADO"] }
      }
    });

    if (existingPayment && existingPayment.status === "PAGADO") {
      return res.status(400).json({
        success: false,
        message: "Este vehículo ya tiene un pago registrado"
      });
    }

    // Calcular duración
    const duration = calculateDuration(vehicle.entryTime);

    // Obtener tarifas activas
    const rates = await prisma.rate.findMany({
      where: {
        vehicleType: vehicle.type,
        isActive: true,
        OR: [
          { validUntil: null },
          { validUntil: { gte: new Date() } }
        ]
      }
    });

    // Seleccionar mejor tarifa
    const selectedRate = selectBestRate(vehicle.type, duration, rates);

    // Calcular monto
    const calculation = calculateAmount(duration, selectedRate);

    // Aplicar descuento
    const finalCalculation = applyDiscount(calculation.subtotal, discount, isPercentage);

    // Generar número de recibo
    const receiptNumber = generateReceiptNumber();

    // Crear pago y actualizar vehículo en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear pago
      const payment = await tx.payment.create({
        data: {
          vehicleId: parseInt(vehicleId),
          amount: finalCalculation.total,
          method,
          status: "PAGADO",
          duration: calculation.actualHours,
          rateApplied: JSON.stringify(calculation.rateInfo),
          discount: finalCalculation.discount,
          subtotal: calculation.subtotal,
          notes: notes?.trim() || null,
          receiptNumber,
          registeredById: req.user.id
        },
        include: {
          vehicle: {
            select: {
              id: true,
              plate: true,
              type: true,
              ownerName: true,
              entryTime: true,
              parkingSpace: true
            }
          },
          registeredBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      // Actualizar vehículo a INACTIVO y establecer exitTime
      await tx.vehicle.update({
        where: { id: parseInt(vehicleId) },
        data: {
          status: "INACTIVO",
          exitTime: new Date()
        }
      });

      // Si tiene espacio asignado, liberarlo
      if (vehicle.parkingSpaceId) {
        await tx.parkingSpace.update({
          where: { id: vehicle.parkingSpaceId },
          data: {
            state: "DISPONIBLE",
            vehicleId: null
          }
        });
      }

      return payment;
    });

    res.status(201).json({
      success: true,
      message: "Pago registrado exitosamente",
      data: result
    });
  } catch (error) {
    console.error("Error en registerPayment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al registrar pago"
    });
  }
};

// @desc    Obtener todos los pagos
// @route   GET /api/payments
// @access  Private
export const getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, method, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (method) where.method = method;
    if (startDate || endDate) {
      where.paidAt = {};
      if (startDate) where.paidAt.gte = new Date(startDate);
      if (endDate) where.paidAt.lte = new Date(endDate);
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          vehicle: {
            select: {
              plate: true,
              type: true,
              ownerName: true
            }
          },
          registeredBy: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { paidAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.payment.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error en getPayments:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener pagos"
    });
  }
};

// @desc    Obtener pago por ID
// @route   GET /api/payments/:id
// @access  Private
export const getPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: {
        vehicle: true,
        registeredBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Pago no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error("Error en getPayment:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener pago"
    });
  }
};

// @desc    Procesar reembolso
// @route   POST /api/payments/:id/refund
// @access  Private (Admin)
export const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "La razón del reembolso es requerida"
      });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Pago no encontrado"
      });
    }

    if (payment.status === "REEMBOLSADO") {
      return res.status(400).json({
        success: false,
        message: "Este pago ya fue reembolsado"
      });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: parseInt(id) },
      data: {
        status: "REEMBOLSADO",
        refundedAt: new Date(),
        refundReason: reason.trim()
      },
      include: {
        vehicle: {
          select: {
            plate: true,
            type: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Reembolso procesado exitosamente",
      data: updatedPayment
    });
  } catch (error) {
    console.error("Error en processRefund:", error);
    res.status(500).json({
      success: false,
      message: "Error al procesar reembolso"
    });
  }
};

// @desc    Obtener estadísticas de pagos
// @route   GET /api/payments/stats/summary
// @access  Private
export const getPaymentStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayTotal, monthTotal, totalPayments, byMethod, byStatus] = await Promise.all([
      // Total de hoy
      prisma.payment.aggregate({
        where: {
          paidAt: { gte: today },
          status: "PAGADO"
        },
        _sum: { amount: true },
        _count: true
      }),
      // Total del mes
      prisma.payment.aggregate({
        where: {
          paidAt: {
            gte: new Date(today.getFullYear(), today.getMonth(), 1)
          },
          status: "PAGADO"
        },
        _sum: { amount: true },
        _count: true
      }),
      // Total general
      prisma.payment.count(),
      // Por método de pago
      prisma.payment.groupBy({
        by: ['method'],
        where: { status: "PAGADO" },
        _sum: { amount: true },
        _count: true
      }),
      // Por estado
      prisma.payment.groupBy({
        by: ['status'],
        _count: true
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        today: {
          total: todayTotal._sum.amount || 0,
          count: todayTotal._count
        },
        month: {
          total: monthTotal._sum.amount || 0,
          count: monthTotal._count
        },
        totalPayments,
        byMethod: byMethod.map(item => ({
          method: item.method,
          total: item._sum.amount,
          count: item._count
        })),
        byStatus: byStatus.map(item => ({
          status: item.status,
          count: item._count
        }))
      }
    });
  } catch (error) {
    console.error("Error en getPaymentStats:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas"
    });
  }
};
