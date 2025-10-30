import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const VALID_STATES = ["DISPONIBLE", "OCUPADO", "RESERVADO", "MANTENIMIENTO"];

// Crear espacio
export const createSpace = async (req, res) => {
  try {
    const { number, type, row, col } = req.body;

    if (!number || !type) {
      return res.status(400).json({ success: false, message: "number y type son requeridos" });
    }

    const space = await prisma.parkingSpace.create({
      data: {
        number: number.toUpperCase().trim(),
        type,
        row: row ?? null,
        col: col ?? null
      }
    });

    res.status(201).json({ success: true, data: space });
  } catch (error) {
    console.error("createSpace error:", error);
    res.status(500).json({ success: false, message: "Error al crear espacio" });
  }
};

// Listar espacios
export const getSpaces = async (req, res) => {
  try {
    const spaces = await prisma.parkingSpace.findMany({ orderBy: [{ row: 'asc' }, { col: 'asc' }, { number: 'asc' }] });
    res.status(200).json({ success: true, data: spaces });
  } catch (error) {
    console.error("getSpaces error:", error);
    res.status(500).json({ success: false, message: "Error al listar espacios" });
  }
};

// Obtener espacio por id
export const getSpace = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const space = await prisma.parkingSpace.findUnique({ where: { id } });
    if (!space) return res.status(404).json({ success: false, message: "Espacio no encontrado" });
    res.status(200).json({ success: true, data: space });
  } catch (error) {
    console.error("getSpace error:", error);
    res.status(500).json({ success: false, message: "Error al obtener espacio" });
  }
};

// Actualizar espacio
export const updateSpace = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;

    if (data.state && !VALID_STATES.includes(data.state)) {
      return res.status(400).json({ success: false, message: 'Estado inválido' });
    }

    const updated = await prisma.parkingSpace.update({ where: { id }, data });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("updateSpace error:", error);
    res.status(500).json({ success: false, message: "Error al actualizar espacio" });
  }
};

// Eliminar espacio
export const deleteSpace = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.parkingSpace.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("deleteSpace error:", error);
    res.status(500).json({ success: false, message: "Error al eliminar espacio" });
  }
};

// Asignar manualmente (body: { vehicleId })
export const assignSpace = async (req, res) => {
  const id = parseInt(req.params.id);
  const { vehicleId } = req.body;

  if (!vehicleId) return res.status(400).json({ success: false, message: 'vehicleId es requerido' });

  try {
    const space = await prisma.parkingSpace.findUnique({ where: { id } });
    if (!space) return res.status(404).json({ success: false, message: 'Espacio no encontrado' });
    if (space.state !== 'DISPONIBLE' && space.state !== 'RESERVADO') {
      return res.status(400).json({ success: false, message: 'Espacio no disponible para asignación' });
    }

    // Transacción: actualizar ParkingSpace y Vehicle
    const result = await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
      if (!vehicle) throw new Error('Vehículo no encontrado');

      const updatedSpace = await tx.parkingSpace.update({ where: { id }, data: { state: 'OCUPADO', vehicleId: vehicle.id } });

      await tx.vehicle.update({ where: { id: vehicle.id }, data: { parkingSpace: updatedSpace.number, status: 'ACTIVO' } });

      return updatedSpace;
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("assignSpace error:", error);
    const message = error.message || 'Error al asignar espacio';
    res.status(400).json({ success: false, message });
  }
};

// Auto-asignar: body { vehicleId }
export const autoAssign = async (req, res) => {
  const { vehicleId } = req.body;

  if (!vehicleId) return res.status(400).json({ success: false, message: 'vehicleId es requerido' });

  try {
    // Encontrar primer disponible por row/col/number
    const space = await prisma.parkingSpace.findFirst({ where: { state: 'DISPONIBLE' }, orderBy: [{ row: 'asc' }, { col: 'asc' }, { number: 'asc' }] });
    if (!space) return res.status(404).json({ success: false, message: 'No hay espacios disponibles' });

    const result = await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
      if (!vehicle) throw new Error('Vehículo no encontrado');

      const updatedSpace = await tx.parkingSpace.update({ where: { id: space.id }, data: { state: 'OCUPADO', vehicleId: vehicle.id } });
      await tx.vehicle.update({ where: { id: vehicle.id }, data: { parkingSpace: updatedSpace.number, status: 'ACTIVO' } });
      return updatedSpace;
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("autoAssign error:", error);
    res.status(400).json({ success: false, message: error.message || 'Error al auto-asignar' });
  }
};

// Liberar espacio
export const releaseSpace = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const space = await prisma.parkingSpace.findUnique({ where: { id } });
    if (!space) return res.status(404).json({ success: false, message: 'Espacio no encontrado' });

    const result = await prisma.$transaction(async (tx) => {
      let vehicleUpdated = null;
      if (space.vehicleId) {
        // Limpiar referencia en vehicle
        vehicleUpdated = await tx.vehicle.update({ where: { id: space.vehicleId }, data: { parkingSpace: null /* no cambiamos status aquí, exit flow debe manejarlo */ } });
      }

      const updatedSpace = await tx.parkingSpace.update({ where: { id }, data: { state: 'DISPONIBLE', vehicleId: null } });
      return { updatedSpace, vehicleUpdated };
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("releaseSpace error:", error);
    res.status(500).json({ success: false, message: 'Error al liberar espacio' });
  }
};

