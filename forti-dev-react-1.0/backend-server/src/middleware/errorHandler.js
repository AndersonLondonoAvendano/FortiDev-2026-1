import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;

  logger.error({
    msg: 'Unhandled error',
    method: req.method,
    url: req.url,
    status,
    error: err.message,
    stack: err.stack,
  });

  const body = { error: status < 500 ? err.message : 'Internal server error' };
  if (env.NODE_ENV !== 'production' && status >= 500) {
    body.detail = err.message;
  }

  res.status(status).json(body);
}

export function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
}
