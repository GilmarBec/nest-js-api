import { HttpException, HttpStatus } from '@nestjs/common';

export class ResponseError {
  static readonly USER_NOT_FOUND = new HttpException(
    { error: 'User not found', code: 'user-0001' },
    HttpStatus.NOT_FOUND,
  );

  static readonly USERNAME_ALREADY_IN_USE = new HttpException(
    { error: 'Username already in use', code: 'user-0002' },
    HttpStatus.NOT_FOUND,
  );
}
