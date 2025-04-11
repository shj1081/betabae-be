import { IsString } from 'class-validator';

export class BasicResponseDto<T = any> {
  @IsString()
  message: string;

  data?: T;

  constructor(message: string, data?: T) {
    this.message = message;
    this.data = data;
  }
}
