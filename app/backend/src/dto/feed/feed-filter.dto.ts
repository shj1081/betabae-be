import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FeedFilterDto {
  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
