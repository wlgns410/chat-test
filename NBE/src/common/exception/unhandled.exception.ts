import { HttpException } from '@nestjs/common';
import { ErrorCode } from '../enum/error-code.enum';
import { ERROR_DETAIL } from '../constant/error-detail';

export class UnhandledException extends HttpException {
  constructor() {
    const { message, statusCode } = ERROR_DETAIL[ErrorCode.INTERNAL_SERVER_ERROR];
    super(message, statusCode);
  }
}
