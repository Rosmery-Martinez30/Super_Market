import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor(entityName: string, detail?: Record<string, any>) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: `${entityName} not found`,
        detail,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
