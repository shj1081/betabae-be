import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileRequestDto {
  // file은 decorator에서 처리

  @IsString()
  @IsNotEmpty()
  context: string;
}
