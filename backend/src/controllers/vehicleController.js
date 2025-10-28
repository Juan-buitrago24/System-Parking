import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// @desc    Registrar entrada de vehículo
// @route   POST /api/vehicles/entry
// @access  Private
export const registerEntry = async (req, res) => {
  try {
    const {
      plate,
      type,
      color,
      brand,
      model,
      ownerName,
      ownerPhone,
      ownerEmail,
      parkingSpace,
      observations
    } = req.body;

    // Verificar si el vehículo ya está activo en el parqueadero
    const activeVehicle = await prisma.vehicle.findFirst({
      where: {
        plate: plate.toUpperCase(),
        status: "ACTIVO"
      }
    });

    if (activeVehicle) {
      return res.status(400).json({
        success: false,
        message: "Este vehículo ya se encuentra en el parqueadero.",
        data: activeVehicle
      });
    }

    // Registrar entrada
    const vehicle = await prisma.vehicle.create({
      data: {
        plate: plate.toUpperCase(),
        type,
        color: color?.trim() || null,
        brand: brand?.trim() || null,
        model: model?.trim() || null,
        ownerName: ownerName.trim(),
        ownerPhone: ownerPhone?.trim() || null,
        ownerEmail: ownerEmail?.toLowerCase().trim() || null,
        parkingSpace: parkingSpace?.trim() || null,
        observations: observations?.trim() || null,
        status: "ACTIVO",
        registeredById: req.user.id
      },
      include: {
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

    res.status(201).json({
      success: true,
      message: "Vehículo registrado exitosamente.",
      data: vehicle
    });
  } catch (error) {
    console.error("Error en registerEntry:", error);
    res.status(500).json({
      success: false,
      message: "Error al registrar entrada del vehículo."
    });
  }
};

// @desc    Registrar salida de vehículo
// @route   POST /api/vehicles/exit/:plate
// @access  Private
export const registerExit = async (req, res) => {
  try {
    const { plate } = req.params;
    const { observations } = req.body;

    // Buscar vehículo activo
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        plate: plate.toUpperCase(),
        status: "ACTIVO"
      }
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "No se encontró un vehículo activo con esta placa."
      });
    }

    // Registrar salida
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: {
        exitTime: new Date(),
        status: "INACTIVO",
        observations: observations?.trim() || vehicle.observations
      },
      include: {
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

    // Calcular tiempo de permanencia
    const entryTime = new Date(vehicle.entryTime);
    const exitTime = new Date(updatedVehicle.exitTime);
    const durationMs = exitTime - entryTime;
    const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);

    res.status(200).json({
      success: true,
      message: "Salida registrada exitosamente.",
      data: {
        ...updatedVehicle,
        duration: {
          hours: durationHours,
          ms: durationMs
        }
      }
    });
  } catch (error) {
    console.error("Error en registerExit:", error);
    res.status(500).json({
      success: false,
      message: "Error al registrar salida del vehículo."
    });
  }
};

// @desc    Buscar vehículo por placa
// @route   GET /api/vehicles/search/:plate
// @access  Private
export const searchVehicle = async (req, res) => {
  try {
    const { plate } = req.params;

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        plate: plate.toUpperCase(),
        status: "ACTIVO"
      },
      include: {
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

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "No se encontró un vehículo activo con esta placa."
      });
    }

    // Calcular tiempo de permanencia
    const entryTime = new Date(vehicle.entryTime);
    const now = new Date();
    const durationMs = now - entryTime;
    const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);

    res.status(200).json({
      success: true,
      data: {
        ...vehicle,
        duration: {
          hours: durationHours,
          ms: durationMs
        }
      }
    });
  } catch (error) {
    console.error("Error en searchVehicle:", error);
    res.status(500).json({
      success: false,
      message: "Error al buscar vehículo."
    });
  }
};

// @desc    Listar vehículos activos
// @route   GET /api/vehicles/active
// @access  Private
export const listActiveVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: "ACTIVO"
      },
      include: {
        registeredBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        entryTime: "desc"
      }
    });

    // Calcular duración para cada vehículo
    const vehiclesWithDuration = vehicles.map(vehicle => {
      const entryTime = new Date(vehicle.entryTime);
      const now = new Date();
      const durationMs = now - entryTime;
      const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);

      return {
        ...vehicle,
        duration: {
          hours: durationHours,
          ms: durationMs
        }
      };
    });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehiclesWithDuration
    });
  } catch (error) {
    console.error("Error en listActiveVehicles:", error);
    res.status(500).json({
      success: false,
      message: "Error al listar vehículos activos."
    });
  }
};

// @desc    Obtener historial de un vehículo por placa
// @route   GET /api/vehicles/history/:plate
// @access  Private
export const getVehicleHistory = async (req, res) => {
  try {
    const { plate } = req.params;

    const vehicles = await prisma.vehicle.findMany({
      where: {
        plate: plate.toUpperCase()
      },
      include: {
        registeredBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        entryTime: "desc"
      }
    });

    if (vehicles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró historial para esta placa."
      });
    }

    // Calcular duración para cada registro
    const historyWithDuration = vehicles.map(vehicle => {
      const entryTime = new Date(vehicle.entryTime);
      const exitTime = vehicle.exitTime ? new Date(vehicle.exitTime) : new Date();
      const durationMs = exitTime - entryTime;
      const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);

      return {
        ...vehicle,
        duration: {
          hours: durationHours,
          ms: durationMs
        }
      };
    });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: historyWithDuration
    });
  } catch (error) {
    console.error("Error en getVehicleHistory:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener historial del vehículo."
    });
  }
};

// @desc    Obtener todos los vehículos (con paginación)
// @route   GET /api/vehicles
// @access  Private
export const getAllVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          registeredBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          entryTime: "desc"
        },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.vehicle.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: vehicles,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error en getAllVehicles:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener vehículos."
    });
  }
};

// @desc    Obtener estadísticas del parqueadero
// @route   GET /api/vehicles/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    const [activeCount, todayCount, totalCount, byType] = await Promise.all([
      // Vehículos activos
      prisma.vehicle.count({
        where: { status: "ACTIVO" }
      }),
      // Vehículos que entraron hoy
      prisma.vehicle.count({
        where: {
          entryTime: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      // Total de vehículos registrados
      prisma.vehicle.count(),
      // Por tipo de vehículo
      prisma.vehicle.groupBy({
        by: ["type"],
        where: { status: "ACTIVO" },
        _count: true
      })
    ]);

    // Actividad reciente (últimos 10 movimientos)
    const recentActivity = await prisma.vehicle.findMany({
      take: 10,
      orderBy: {
        updatedAt: "desc"
      },
      select: {
        plate: true,
        type: true,
        status: true,
        entryTime: true,
        exitTime: true,
        parkingSpace: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      success: true,
      data: {
        active: activeCount,
        today: todayCount,
        total: totalCount,
        byType: byType.reduce((acc, item) => {
          acc[item.type] = item._count;
          return acc;
        }, {}),
        recentActivity
      }
    });
  } catch (error) {
    console.error("Error en getStats:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas."
    });
  }
};

// @desc    Actualizar información de un vehículo
// @route   PUT /api/vehicles/:id
// @access  Private
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      color,
      brand,
      model,
      ownerName,
      ownerPhone,
      ownerEmail,
      parkingSpace,
      observations
    } = req.body;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(id) }
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehículo no encontrado."
      });
    }

    const updateData = {};
    if (color !== undefined) updateData.color = color?.trim() || null;
    if (brand !== undefined) updateData.brand = brand?.trim() || null;
    if (model !== undefined) updateData.model = model?.trim() || null;
    if (ownerName !== undefined) updateData.ownerName = ownerName.trim();
    if (ownerPhone !== undefined) updateData.ownerPhone = ownerPhone?.trim() || null;
    if (ownerEmail !== undefined) updateData.ownerEmail = ownerEmail?.toLowerCase().trim() || null;
    if (parkingSpace !== undefined) updateData.parkingSpace = parkingSpace?.trim() || null;
    if (observations !== undefined) updateData.observations = observations?.trim() || null;

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        registeredBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Vehículo actualizado exitosamente.",
      data: updatedVehicle
    });
  } catch (error) {
    console.error("Error en updateVehicle:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar vehículo."
    });
  }
};
