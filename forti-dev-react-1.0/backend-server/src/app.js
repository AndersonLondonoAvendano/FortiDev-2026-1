import './config/env.js';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { logger } from './config/logger.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { sanitize } from './middleware/sanitize.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/users.routes.js';
import projectRoutes from './modules/projects/projects.routes.js';
import { standaloneRouter as scanStandaloneRoutes } from './modules/scans/scans.routes.js';
import findingRoutes from './modules/findings/findings.routes.js';
import organizationRoutes from './modules/organizations/organizations.routes.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(sanitize);
app.use(requestLogger);
app.use(generalLimiter);

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/scans', scanStandaloneRoutes);
app.use('/api/findings', findingRoutes);

app.use(notFound);
app.use(errorHandler);

async function bootstrap() {
  await connectDatabase();
  const server = app.listen(env.PORT, () => {
    logger.info(`FortiDev API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  async function shutdown(signal) {
    logger.info(`${signal} received — shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error({ msg: 'Failed to start server', error: err.message });
  process.exit(1);
});
