const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const departments = ['Mess', 'Hostel', 'Library', 'Transport'];

  for (const name of departments) {
    await prisma.department.upsert({
      where: { name }, // requires `name` to be unique in schema
      update: {},       // no update fields needed
      create: { name }, // create new department
    });
  }

  console.log('✅ Departments seeded successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
