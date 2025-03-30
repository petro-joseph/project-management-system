import { AppError } from '../middleware/error.middleware';

export class NotFoundError extends AppError {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}
