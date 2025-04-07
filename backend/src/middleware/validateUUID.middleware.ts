import { Request, Response, NextFunction } from 'express';
import { validate as isUUID } from 'uuid';

/**
 * Middleware to validate UUID params in the request.
 * @param paramNames Array of param names to validate as UUIDs
 */
export function validateUUIDParams(paramNames: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const param of paramNames) {
      const value = req.params[param];
      if (value && !isUUID(value)) {
        return res.status(400).json({
          status: 'error',
          message: `Invalid UUID format for parameter '${param}': ${value}`
        });
      }
    }
    next();
  };
}