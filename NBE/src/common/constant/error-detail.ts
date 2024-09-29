import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../enum/error-code.enum';

interface ErrorDetail {
  message: string;
  statusCode: HttpStatus;
}

export const ERROR_DETAIL: Record<ErrorCode, ErrorDetail> = {
  [ErrorCode.TOKEN_EXPIRED]: {
    message: '이미 만료된 토큰입니다.',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.INVALID_TOKEN]: {
    message: '유효하지 않은 인증 토큰입니다.',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.TOKEN_NOT_PROVIDED]: {
    message: '인증 토큰이 제공되지 않았습니다.',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.UNAUTHORIZED_USER]: {
    message: '올바르지 않은 접근입니다.',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.INVALID_INPUT]: {
    message: '올바르지 않은 입력입니다.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.OPTIMISTIC_LOCK_CONFLICT]: {
    message: '동시 요청으로 인해 작업을 완료할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    statusCode: HttpStatus.CONFLICT,
  },
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    message: '핸들링 하지 못한 에러입니다.',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};
