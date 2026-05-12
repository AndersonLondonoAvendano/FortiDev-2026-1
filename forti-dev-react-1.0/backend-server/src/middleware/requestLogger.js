import { logger } from '../config/logger.js';

export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      ms: Date.now() - start,
      ip: req.ip,
      user: req.user?.id ?? 'anonymous',
    });
  });
  next();
}
