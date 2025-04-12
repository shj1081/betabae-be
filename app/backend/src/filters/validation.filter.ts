import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseDto } from '../dto/common/error.response.dto';
import { ExceptionCode } from '../enums/custom.exception.code';

@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse();

    let errors: Record<string, string[]> = {};
    let errorMessage = 'Validation failed';

    if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      if (Array.isArray(exceptionResponse.message)) {
        // NestJS의 기본 validation 에러 형식
        errors = this.formatNestValidationErrors(exceptionResponse.message);
        errorMessage = exceptionResponse.message.join(', ');
      } else if (typeof exceptionResponse.message === 'string') {
        // 일반 BadRequest 에러
        errors = { error: [exceptionResponse.message] };
        errorMessage = exceptionResponse.message;
      }
    }

    response
      .status(HttpStatus.BAD_REQUEST)
      .json(new ErrorResponseDto(ExceptionCode.VALIDATION_ERROR, errorMessage));
  }

  private formatNestValidationErrors(
    messages: string[],
  ): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    messages.forEach((message) => {
      const [property, ...errorParts] = message.split(' ');
      if (!errors[property]) {
        errors[property] = [];
      }
      errors[property].push(errorParts.join(' '));
    });

    return errors;
  }
}
