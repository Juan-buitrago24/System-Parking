const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.parkingSpace.count();
  if (existing > 0) {
    console.log('Seed: parking spaces already exist, skipping');
    return;
  }

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

