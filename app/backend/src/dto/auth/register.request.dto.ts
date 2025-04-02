import { Gender, MBTI } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsJSON,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class PersonalityDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  openness: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  conscientiousness: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  extraversion: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  agreeableness: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  neuroticism: number;
}

// TODO: 길이 제한은 논의 후 수정 필요
export class RegisterRequestDto {
  @IsString()
  @MinLength(5)
  @MaxLength(15)
  username: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  introduce?: string;

  @IsNumber()
  age: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(MBTI)
  @IsOptional()
  mbti?: MBTI;

  @IsJSON()
  @IsOptional()
  interests?: string[]; // TODO: 타입 정의 필요?

  @IsString()
  province: string;

  @IsString()
  city: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PersonalityDto)
  personality: PersonalityDto;
}
