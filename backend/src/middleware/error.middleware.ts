import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Handle invalid JSON syntax errors from body-parser
  if (
    err instanceof SyntaxError &&
    'statusCode' in err &&
    (err as any).statusCode === 400 &&
    'type' in err &&
    (err as any).type === 'entity.parse.failed'
  ) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid JSON payload. Please check your request body syntax.'
    });
  }

  // Log error for debugging
  console.error('Unhandled error:', err);

  // Send generic error response
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};