import { Gender, MBTI } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  introduce?: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsEnum(MBTI)
  @IsOptional()
  mbti?: MBTI;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  city?: string;
}
