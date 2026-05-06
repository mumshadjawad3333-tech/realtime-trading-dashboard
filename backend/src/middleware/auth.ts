import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'access-secret-123';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret-456';
/**
 * Generates an Access Token (Short-lived)
 */
export const generateAccessToken = (username: string) => {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: '15m' }); // 15 minutes
};

/**
 * Generates a Refresh Token (Long-lived)
 */
export const generateRefreshToken = (username: string) => {
  return jwt.sign({ username }, REFRESH_SECRET, { expiresIn: '7d' }); // 7 days
};

/**
 * Middleware to protect routes via Access Token
 */
export const authGuard = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded; 
    next();
  } catch (err) {
    res.status(403).json({ message: 'Forbidden: Access token expired or invalid' });
  }
};

/**
 * Helper to verify Refresh Tokens specifically
 */
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as { username: string };
  } catch (err) {
    return null;
  }
};