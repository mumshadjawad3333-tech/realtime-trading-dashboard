import { Request, Response } from 'express';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} from '../middleware/auth';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Simple validation for the demo
  if (username === 'admin' && password === 'password123') {
    const accessToken = generateAccessToken(username);
    const refreshToken = generateRefreshToken(username);
    
    return res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      username
    });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
};

export const refresh = (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: 'Refresh token required' });

  const decoded = verifyRefreshToken(token);
  if (!decoded) return res.status(403).json({ message: 'Invalid refresh token' });

  // Issue a brand new access token
  const newAccessToken = generateAccessToken(decoded.username);
  res.json({ accessToken: newAccessToken });
};