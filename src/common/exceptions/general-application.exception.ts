import { HttpException, HttpStatus } from '@nestjs/common';

export class GeneralApplicationException extends HttpException {
  constructor(message: string, detail?: Record<string, any>) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: message || 'An unexpected error occurred',
        detail,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
