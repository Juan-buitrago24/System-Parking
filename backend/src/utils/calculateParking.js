/**
 * Calcula la duración en horas entre dos fechas
 * @param {Date} entryTime - Hora de entrada
 * @param {Date} exitTime - Hora de salida (opcional, usa now si no se provee)
 * @returns {number} - Duración en horas con 2 decimales
 */
export const calculateDuration = (entryTime, exitTime = new Date()) => {
  const entry = new Date(entryTime);
  const exit = new Date(exitTime);
  const durationMs = exit - entry;
  const durationHours = durationMs / (1000 * 60 * 60);
  return parseFloat(durationHours.toFixed(2));
};

/**
 * Calcula el monto a cobrar según la tarifa y duración
 * @param {number} duration - Duración en horas
 * @param {object} rate - Objeto de tarifa
 * @returns {object} - { subtotal, duration, rateInfo }
 */
export const calculateAmount = (duration, rate) => {
  if (!rate) {
    throw new Error("No se encontró una tarifa aplicable");
  }

  let subtotal = 0;
  let billedHours = duration;

  switch (rate.rateType) {
    case "POR_HORA":
      // Redondear hacia arriba las horas
      billedHours = Math.ceil(duration);
      
      // Aplicar tiempo mínimo si existe
      if (rate.minTime) {
        const minHours = rate.minTime / 60;
        billedHours = Math.max(billedHours, Math.ceil(minHours));
      }
      
      subtotal = billedHours * rate.amount;
      break;

    case "FRACCION":
      // Por fracciones de 15 minutos
      const fractions = Math.ceil((duration * 60) / 15); // Fracciones de 15 min
      billedHours = fractions * 0.25; // Convertir a horas
      subtotal = fractions * rate.amount;
      break;

    case "POR_DIA":
      // Por día completo (24 horas)
      const days = Math.ceil(duration / 24);
      billedHours = days * 24;
      subtotal = days * rate.amount;
      break;

    case "MENSUAL":
      // Tarifa plana mensual
      subtotal = rate.amount;
      billedHours = duration; // Mantener duración real
      break;

    default:
      throw new Error("Tipo de tarifa no válido");
  }

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    billedHours: parseFloat(billedHours.toFixed(2)),
    actualHours: duration,
    rateInfo: {
      id: rate.id,
      name: rate.name,
      type: rate.rateType,
      amount: rate.amount,
      vehicleType: rate.vehicleType
    }
  };
};

/**
 * Selecciona la mejor tarifa aplicable para un vehículo
 * @param {string} vehicleType - Tipo de vehículo
 * @param {number} duration - Duración en horas
 * @param {Array} rates - Array de tarifas activas
 * @returns {object} - Tarifa seleccionada
 */
export const selectBestRate = (vehicleType, duration, rates) => {
  // Filtrar tarifas por tipo de vehículo y que estén activas
  const applicableRates = rates.filter(rate => 
    rate.vehicleType === vehicleType &&
    rate.isActive &&
    (!rate.validUntil || new Date(rate.validUntil) >= new Date())
  );

  if (applicableRates.length === 0) {
    throw new Error(`No hay tarifas activas para vehículos tipo ${vehicleType}`);
  }

  // Si solo hay una tarifa, usarla
  if (applicableRates.length === 1) {
    return applicableRates[0];
  }

  // Calcular el costo con cada tarifa y seleccionar la más económica
  const calculations = applicableRates.map(rate => ({
    rate,
    ...calculateAmount(duration, rate)
  }));

  // Ordenar por subtotal (más económico primero)
  calculations.sort((a, b) => a.subtotal - b.subtotal);

  // Retornar la tarifa más económica
  return calculations[0].rate;
};

/**
 * Calcula el total con descuento aplicado
 * @param {number} subtotal - Subtotal sin descuento
 * @param {number} discount - Descuento en porcentaje (0-100) o monto fijo
 * @param {boolean} isPercentage - Si el descuento es porcentaje o monto fijo
 * @returns {object} - { subtotal, discount, total }
 */
export const applyDiscount = (subtotal, discount = 0, isPercentage = true) => {
  let discountAmount = 0;

  if (discount > 0) {
    if (isPercentage) {
      discountAmount = (subtotal * discount) / 100;
    } else {
      discountAmount = discount;
    }
  }

  const total = Math.max(0, subtotal - discountAmount);

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount: parseFloat(discountAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};

/**
 * Genera un número de recibo único
 * @returns {string} - Número de recibo formato: REC-YYYYMMDD-XXXXX
 */
export const generateReceiptNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
  
  return `REC-${year}${month}${day}-${random}`;
};
