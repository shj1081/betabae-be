import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  legal_name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
