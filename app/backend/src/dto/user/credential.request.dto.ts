import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateCredentialDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
