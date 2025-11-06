import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// @desc    Obtener reporte de ingresos diarios
// @route   GET /api/reports/daily-income
// @access  Private
export const getDailyIncome = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      status: "PAGADO",
      paidAt: {}
    };

    if (startDate) {
      where.paidAt.gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.paidAt.lte = end;
    }

    // Agrupar por día
    const payments = await prisma.payment.findMany({
      where,
      orderBy: { paidAt: 'asc' }
    });

    // Agrupar manualmente por día
    const dailyData = {};
    payments.forEach(payment => {
      const date = payment.paidAt.toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { date, total: 0, count: 0 };
      }
      dailyData[date].total += payment.amount;
      dailyData[date].count += 1;
    });

    const result = Object.values(dailyData).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error en getDailyIncome:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener reporte de ingresos diarios"
    });
  }
};

// @desc    Obtener reporte por tipo de vehículo
// @route   GET /api/reports/by-vehicle-type
// @access  Private
export const getReportByVehicleType = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      status: "PAGADO",
      paidAt: {}
    };

    if (startDate) {
      where.paidAt.gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.paidAt.lte = end;
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        vehicle: {
          select: {
            type: true
          }
        }
      }
    });

    // Agrupar por tipo de vehículo
    const byType = {};
    payments.forEach(payment => {
      const type = payment.vehicle.type;
      if (!byType[type]) {
        byType[type] = { type, total: 0, count: 0 };
      }
      byType[type].total += payment.amount;
      byType[type].count += 1;
    });

    const result = Object.values(byType);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error en getReportByVehicleType:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener reporte por tipo de vehículo"
    });
  }
};

// @desc    Obtener reporte por método de pago
// @route   GET /api/reports/by-payment-method
// @access  Private
export const getReportByPaymentMethod = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      status: "PAGADO",
      paidAt: {}
    };

    if (startDate) {
      where.paidAt.gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.paidAt.lte = end;
    }

    const result = await prisma.payment.groupBy({
      by: ['method'],
      where,
      _sum: {
        amount: true
      },
      _count: true
    });

    const formatted = result.map(item => ({
      method: item.method,
      total: item._sum.amount || 0,
      count: item._count
    }));

    res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (error) {
    console.error("Error en getReportByPaymentMethod:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener reporte por método de pago"
    });
  }
};

// @desc    Obtener resumen general de reportes
// @route   GET /api/reports/summary
// @access  Private
export const getReportSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      status: "PAGADO",
      paidAt: {}
    };

    if (startDate) {
      where.paidAt.gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.paidAt.lte = end;
    }

    const [totalIncome, totalPayments, byMethod, byVehicle] = await Promise.all([
      // Total de ingresos
      prisma.payment.aggregate({
        where,
        _sum: { amount: true }
      }),
      // Total de pagos
      prisma.payment.count({ where }),
      // Por método de pago
      prisma.payment.groupBy({
        by: ['method'],
        where,
        _sum: { amount: true },
        _count: true
      }),
      // Por tipo de vehículo
      prisma.payment.findMany({
        where,
        include: {
          vehicle: {
            select: { type: true }
          }
        }
      })
    ]);

    // Procesar datos de vehículos
    const vehicleData = {};
    byVehicle.forEach(payment => {
      const type = payment.vehicle.type;
      if (!vehicleData[type]) {
        vehicleData[type] = { type, total: 0, count: 0 };
      }
      vehicleData[type].total += payment.amount;
      vehicleData[type].count += 1;
    });

    res.status(200).json({
      success: true,
      data: {
        totalIncome: totalIncome._sum.amount || 0,
        totalPayments,
        averageTicket: totalPayments > 0 ? (totalIncome._sum.amount || 0) / totalPayments : 0,
        byMethod: byMethod.map(item => ({
          method: item.method,
          total: item._sum.amount || 0,
          count: item._count
        })),
        byVehicleType: Object.values(vehicleData)
      }
    });
  } catch (error) {
    console.error("Error en getReportSummary:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener resumen de reportes"
    });
  }
};

// @desc    Obtener lista detallada de pagos para exportar
// @route   GET /api/reports/payments-list
// @access  Private
export const getPaymentsList = async (req, res) => {
  try {
    const { startDate, endDate, vehicleType, method } = req.query;

    const where = {
      status: "PAGADO",
      paidAt: {}
    };

    if (startDate) {
      where.paidAt.gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.paidAt.lte = end;
    }
    if (method) {
      where.method = method;
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        vehicle: {
          select: {
            plate: true,
            type: true,
            ownerName: true,
            entryTime: true,
            exitTime: true
          }
        },
        registeredBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { paidAt: 'desc' }
    });

    // Filtrar por tipo de vehículo si se especifica
    let filteredPayments = payments;
    if (vehicleType) {
      filteredPayments = payments.filter(p => p.vehicle.type === vehicleType);
    }

    res.status(200).json({
      success: true,
      data: filteredPayments
    });
  } catch (error) {
    console.error("Error en getPaymentsList:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener lista de pagos"
    });
  }
};

// @desc    Obtener top 10 vehículos con más visitas
// @route   GET /api/reports/top-vehicles
// @access  Private
export const getTopVehicles = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      status: "INACTIVO"
    };

    if (startDate || endDate) {
      where.exitTime = {};
      if (startDate) {
        where.exitTime.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.exitTime.lte = end;
      }
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      select: {
        plate: true,
        type: true,
        ownerName: true
      }
    });

    // Contar visitas por placa
    const visitCount = {};
    vehicles.forEach(vehicle => {
      const key = vehicle.plate;
      if (!visitCount[key]) {
        visitCount[key] = {
          plate: vehicle.plate,
          type: vehicle.type,
          ownerName: vehicle.ownerName,
          visits: 0
        };
      }
      visitCount[key].visits += 1;
    });

    // Ordenar y tomar top 10
    const topVehicles = Object.values(visitCount)
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: topVehicles
    });
  } catch (error) {
    console.error("Error en getTopVehicles:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener top vehículos"
    });
  }
};
