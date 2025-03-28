import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';

/**
 * Generates a JWT token for the given user.
 *
 * @param user - The user object for which to generate the token.
 * @returns The generated JWT token.
 */
export const generateToken = (user: User): string => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
};

/**
 * Verifies the given JWT token and returns the decoded payload.
 *
 * @param token - The JWT token to verify.
 * @returns The decoded JWT payload.
 */
export const verifyToken = (token: string): jwt.JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
};
