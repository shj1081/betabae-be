import { IsEnum, IsString } from 'class-validator';
import { ExceptionCode } from 'src/enums/custom.exception.code';

export class ErrorResponseDto {
  @IsEnum(ExceptionCode)
  code: ExceptionCode;

  @IsString()
  message: string;

  constructor(code: ExceptionCode, message: string) {
    this.code = code;
    this.message = message;
  }
}
