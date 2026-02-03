// Keep Neon database alive during development
// Neon free tier sleeps after 5 minutes of inactivity

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const PING_INTERVAL = 4 * 60 * 1000; // 4 minutes (before 5-minute timeout)

async function pingDatabase() {
  try {
    // Simple query to keep connection alive
    await prisma.$queryRaw`SELECT 1`;
    console.log(`[${new Date().toLocaleTimeString()}] ✓ Database pinged successfully`);
  } catch (error) {
    console.error(`[${new Date().toLocaleTimeString()}] ✗ Database ping failed:`, error.message);
  }
}

async function startKeepAlive() {
  console.log('🔄 Starting database keep-alive service...');
  console.log(`⏱️  Pinging every ${PING_INTERVAL / 60000} minutes`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Initial ping
  await pingDatabase();

  // Set up interval
  setInterval(pingDatabase, PING_INTERVAL);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\n🛑 Stopping keep-alive service...');
    await prisma.$disconnect();
    process.exit(0);
  });
}

startKeepAlive().catch((error) => {
  console.error('Failed to start keep-alive service:', error);
  process.exit(1);
});
