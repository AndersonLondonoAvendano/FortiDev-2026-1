import jwt from 'jsonwebtoken';
import * as authService from './auth.service.js';
import { env } from '../../config/env.js';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

function extractRequestUser(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(header.slice(7), env.JWT_SECRET);
  } catch {
    return null;
  }
}

export async function register(req, res, next) {
  try {
    const { email, password, name, role } = req.validated.body;
    const requester = extractRequestUser(req);
    const user = await authService.register({ email, password, name, role, requester });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.validated.body;
    const { accessToken, refreshToken, user } = await authService.login({ email, password });
    res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
    res.json({ accessToken, user });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const { accessToken, refreshToken } = await authService.refresh(req.cookies?.refreshToken);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    await authService.logout(req.cookies?.refreshToken);
    res.clearCookie('refreshToken', { path: '/' });
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}
