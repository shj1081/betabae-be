import { Gender, MBTI } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class UserProfileDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsOptional()
  introduce?: string;

  @IsDateString()
  @IsNotEmpty()
  birthday: string;

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
