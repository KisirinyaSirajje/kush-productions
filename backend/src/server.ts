import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '4000');
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    
    await app.listen({ port, host });
    
    console.log(`
    🚀 Kush Films API Server Started!
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📡 URL: http://${host}:${port}
    🏥 Health: http://${host}:${port}/health
    🌍 Environment: ${process.env.NODE_ENV || 'development'}
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  try {
    await app.close();
    console.log('Server closed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();
