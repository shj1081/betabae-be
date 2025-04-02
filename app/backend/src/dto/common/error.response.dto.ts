import { ExceptionCode } from './custom.exception.code';

export class ErrorResponseDto {
  code: ExceptionCode;
  message: string;

  constructor(code: ExceptionCode, message: string) {
    this.code = code;
    this.message = message;
  }
}
