import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';

export const generateToken = (user: User): string => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string): jwt.JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
};
