import { HttpException, HttpStatus } from '@nestjs/common';

export class ResponseError {
  static readonly USER_NOT_FOUND = new HttpException(
    { error: 'User not found', code: 'user-0001' },
    HttpStatus.NOT_FOUND,
  );
}
