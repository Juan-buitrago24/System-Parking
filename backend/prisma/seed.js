const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed parking spaces
  const existingSpaces = await prisma.parkingSpace.count();
  if (existingSpaces === 0) {
    const rows = ['A','B','C','D'];
    const cols = 6;
    const spaces = [];

    for (const r of rows) {
      for (let c = 1; c <= cols; c++) {
        spaces.push({
          number: `${r}-${String(c).padStart(2,'0')}`,
          type: c % 3 === 0 ? 'LARGE' : (c % 5 === 0 ? 'HANDICAPPED' : 'COMPACT'),
          state: 'DISPONIBLE',
          row: rows.indexOf(r) + 1,
          col: c
        });
      }
    }

    await prisma.parkingSpace.createMany({ data: spaces });
    console.log('Seed: created', spaces.length, 'parking spaces');
  } else {
    console.log('Seed: parking spaces already exist');
  }

  // Seed rates
  const existingRates = await prisma.rate.count();
  if (existingRates === 0) {
    const rates = [
      // Tarifas para CARROS
      {
        name: 'Carro - Por Hora',
        description: 'Tarifa por hora para automoviles',
        vehicleType: 'CARRO',
        rateType: 'POR_HORA',
        amount: 3000,
        minTime: 1,
        isActive: true
      },
      {
        name: 'Carro - Dia Completo',
        description: 'Tarifa por dia completo para automoviles',
        vehicleType: 'CARRO',
        rateType: 'POR_DIA',
        amount: 25000,
        minTime: null,
        isActive: true
      },
      {
        name: 'Carro - Mensualidad',
        description: 'Tarifa mensual para automoviles',
        vehicleType: 'CARRO',
        rateType: 'MENSUAL',
        amount: 450000,
        minTime: null,
        isActive: true
      },
      // Tarifas para MOTOS
      {
        name: 'Moto - Por Hora',
        description: 'Tarifa por hora para motocicletas',
        vehicleType: 'MOTO',
        rateType: 'POR_HORA',
        amount: 2000,
        minTime: 1,
        isActive: true
      },
      {
        name: 'Moto - Dia Completo',
        description: 'Tarifa por dia completo para motocicletas',
        vehicleType: 'MOTO',
        rateType: 'POR_DIA',
        amount: 15000,
        minTime: null,
        isActive: true
      },
      {
        name: 'Moto - Fraccion 15min',
        description: 'Tarifa por fraccion de 15 minutos para motocicletas',
        vehicleType: 'MOTO',
        rateType: 'FRACCION',
        amount: 500,
        minTime: 0.25,
        isActive: true
      },
      // Tarifas para CAMIONETAS
      {
        name: 'Camioneta - Por Hora',
        description: 'Tarifa por hora para camionetas',
        vehicleType: 'CAMIONETA',
        rateType: 'POR_HORA',
        amount: 4000,
        minTime: 1,
        isActive: true
      },
      {
        name: 'Camioneta - Dia Completo',
        description: 'Tarifa por dia completo para camionetas',
        vehicleType: 'CAMIONETA',
        rateType: 'POR_DIA',
        amount: 30000,
        minTime: null,
        isActive: true
      },
      // Tarifas para CAMIONES
      {
        name: 'Camion - Por Hora',
        description: 'Tarifa por hora para camiones',
        vehicleType: 'CAMION',
        rateType: 'POR_HORA',
        amount: 5000,
        minTime: 1,
        isActive: true
      },
      {
        name: 'Camion - Dia Completo',
        description: 'Tarifa por dia completo para camiones',
        vehicleType: 'CAMION',
        rateType: 'POR_DIA',
        amount: 40000,
        minTime: null,
        isActive: true
      }
    ];

    await prisma.rate.createMany({ data: rates });
    console.log('Seed: created', rates.length, 'rates');
  } else {
    console.log('Seed: rates already exist');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

