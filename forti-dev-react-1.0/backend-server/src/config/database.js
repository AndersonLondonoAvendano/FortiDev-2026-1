import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
});

prisma.$on('error', (e) => logger.error({ msg: 'Prisma error', error: e.message }));
prisma.$on('warn', (e) => logger.warn({ msg: 'Prisma warning', warning: e.message }));

export async function connectDatabase() {
  await prisma.$connect();
  logger.info('Database connected');
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
