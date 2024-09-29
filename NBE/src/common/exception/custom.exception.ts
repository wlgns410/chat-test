import { HttpException } from '@nestjs/common';
import { ErrorCode } from '../enum/error-code.enum';
import { ERROR_DETAIL } from '../constant/error-detail';

export class CustomException extends HttpException {
  constructor(errorCode: ErrorCode) {
    const { message, statusCode } = ERROR_DETAIL[errorCode];
    super(message, statusCode);
  }
}
