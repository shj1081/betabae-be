import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { ErrorResponseDto } from 'src/dto/common/error.response.dto';
import { UpdateCredentialDto } from 'src/dto/user/credential.request.dto';
import { UserPersonalityDto } from 'src/dto/user/personality.request.dto';
import { UserPersonalityResponseDto } from 'src/dto/user/personality.response.dto';
import { UserProfileDto } from 'src/dto/user/profile.request.dto';
import { UserProfileResponseDto } from 'src/dto/user/profile.response.dto';
import { ExceptionCode } from 'src/enums/custom.exception.code';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        new ErrorResponseDto(ExceptionCode.USER_NOT_FOUND, `User with ID ${userId} not found`),
      );
    }

    if (!user.profile) {
      throw new NotFoundException(
        new ErrorResponseDto(ExceptionCode.USER_PROFILE_NOT_FOUND, `Profile for user with ID ${userId} not found`),
      );
    }

    // Transform raw data to DTO using plainToInstance
    return plainToInstance(UserProfileResponseDto, 
      { user, profile: user.profile },
      { excludeExtraneousValues: true }
    );
  }

  async updateOrCreateUserProfile(userId: number, dto: UserProfileDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(
        new ErrorResponseDto(ExceptionCode.USER_NOT_FOUND, `User with ID ${userId} not found`),
      );
    }

    // Update User name if provided
    if (dto.name) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { name: dto.name },
      });
    }

    // Check if profile exists
    const existingProfile = await this.prisma.userProfile.findUnique({
      where: { user_id: userId },
    });

    // 프로필 생성 또는 업데이트
    if (existingProfile) {
      // interests 처리 
      const interests = dto.interests ? dto.interests.join(',') : undefined;
      
      // 업데이트용 프로필 데이터 객체 구성 - null/undefined가 아닌 필드만 포함
      const profileData = Object.entries({
        introduce: dto.introduce,
        age: dto.age,
        gender: dto.gender,
        mbti: dto.mbti,
        interests,
        province: dto.province,
        city: dto.city
      }).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = value;
        return acc;
      }, {});
      
      // 업데이트할 내용이 있는 경우만 업데이트
      if (Object.keys(profileData).length > 0) {
        await this.prisma.userProfile.update({
          where: { user_id: userId },
          data: profileData,
        });
      }
    } else {
      // 프로필 생성 시 필수 정보 검증
      if (dto.age === undefined || dto.gender === undefined || dto.province === undefined || dto.city === undefined) {
        throw new BadRequestException(
          new ErrorResponseDto(
            ExceptionCode.NOT_ENOUGH_PROFILE_INFO, 
            '프로필 생성을 위해 age, gender, province, city 정보가 모두 필요합니다.'
          ),
        );
      } 
      
      // 새 프로필 생성을 위한 타입 안전한 데이터 객체 생성
      const createProfileData = {
        user_id: userId,
        // 필수 필드를 명시적으로 설정
        age: dto.age!,
        gender: dto.gender!,
        province: dto.province!,
        city: dto.city!,
        
        // 선택적 필드
        introduce: dto.introduce,
        mbti: dto.mbti,
        interests: dto.interests ? dto.interests.join(',') : '',
      };
      
      await this.prisma.userProfile.create({
        data: createProfileData
      });
    }

    // Return updated user with profile
    return this.getUserProfile(userId);
  }

  async getUserPersonality(userId: number) {
    const personality = await this.prisma.userPersonality.findUnique({
      where: { user_id: userId },
    });

    if (!personality) {
      throw new NotFoundException(
        new ErrorResponseDto(
          ExceptionCode.USER_PERSONALITY_NOT_FOUND,
          `Personality data for user with ID ${userId} not found`,
        ),
      );
    }

    // Transform raw data to DTO using plainToInstance
    return plainToInstance(UserPersonalityResponseDto, personality, {
      excludeExtraneousValues: true,
    });
  }

  async updateOrCreateUserPersonality(userId: number, dto: UserPersonalityDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(
        new ErrorResponseDto(ExceptionCode.USER_NOT_FOUND, `User with ID ${userId} not found`),
      );
    }

    // Check if personality exists, upsert if needed
    const existingPersonality = await this.prisma.userPersonality.findUnique({
      where: { user_id: userId },
    });

    if (existingPersonality) {
      // Update existing personality
      return this.prisma.userPersonality.update({
        where: { user_id: userId },
        data: {
          openness: dto.openness,
          conscientiousness: dto.conscientiousness,
          extraversion: dto.extraversion,
          agreeableness: dto.agreeableness,
          neuroticism: dto.neuroticism,
          last_calculated: new Date(),
        },
      });
    } else {
      // Create new personality
      return this.prisma.userPersonality.create({
        data: {
          user_id: userId,
          openness: dto.openness,
          conscientiousness: dto.conscientiousness,
          extraversion: dto.extraversion,
          agreeableness: dto.agreeableness,
          neuroticism: dto.neuroticism,
          last_calculated: new Date(),
        },
      });
    }
  }

  async updateUserCredential(userId: number, dto: UpdateCredentialDto) {
    // Find the user with all fields
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        password_hash: true,
      }
    });

    if (!user) {
      throw new NotFoundException(
        new ErrorResponseDto(ExceptionCode.USER_NOT_FOUND, `User with ID ${userId} not found`),
      );
    }

    // Verify the current password
    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        new ErrorResponseDto(ExceptionCode.INVALID_CREDENTIALS, 'Current password is incorrect'),
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // Update the password_hash field
    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        password_hash: hashedPassword,
        updated_at: new Date(),
      },
    });

    return { success: true };
  }
}
