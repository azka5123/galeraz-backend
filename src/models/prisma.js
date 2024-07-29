const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

module.exports = {
  prisma,
  connectToDatabase
};
