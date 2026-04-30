const { PrismaClient } = require('@prisma/client');

// Singleton del cliente Prisma para reutilizar la conexión
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

module.exports = prisma;
