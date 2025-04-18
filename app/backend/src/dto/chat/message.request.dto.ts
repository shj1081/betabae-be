import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsInt()
  @IsNotEmpty()
  conversationId: number;

  @IsString()
  @IsNotEmpty()
  messageText: string;
}

export class SendImageMessageDto {
  @IsInt()
  @IsNotEmpty()
  conversationId: number;
  
  // Multer will handle file validation
  // This is just a placeholder field for documentation
  file?: Express.Multer.File;

  @IsString()
  @IsOptional()
  messageText?: string; // Optional caption for the image
}
