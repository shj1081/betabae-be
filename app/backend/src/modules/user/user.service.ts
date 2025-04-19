import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { ErrorResponseDto } from 'src/dto/common/error.response.dto';
import { UpdateCredentialDto } from 'src/dto/user/credential.request.dto';
import { UserPersonalityDto } from 'src/dto/user/personality.request.dto';
import { UserPersonalityResponseDto } from 'src/dto/user/personality.response.dto';
import { UserProfileDto } from 'src/dto/user/profile.request.dto';
import { UserProfileResponseDto } from 'src/dto/user/profile.response.dto';
import { UserLoveLanguageDto } from 'src/dto/user/lovelanguage.request.dto';
import { UserLoveLanguageResponseDto } from 'src/dto/user/lovelanguage.response.dto';
import { ExceptionCode } from 'src/enums/custom.exception.code';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: number) {
    // select를 이용하여 불필요 필드 차단 -> 쿼리 부담 줄임
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        legal_name: true,
        profile: {
          select: {
            nickname: true,
            birthday: true,
            introduce: true,
            gender: true,
            mbti: true,
            interests: true,
            province: true,
            city: true,
            profile_image: {
              select: {
                file_url: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException(
        new ErrorResponseDto(
          ExceptionCode.USER_NOT_FOUND,
          `User with ID ${userId} not found`,
        ),
      );
    }

    // profile_image_url 필드를 직접 매핑
    const profileData = {
      user: {
        id: user.id,
        email: user.email,
        legal_name: user.legal_name,
      },
      profile: user.profile
        ? {
            nickname: user.profile.nickname,
            birthday: user.profile.birthday,
            introduce: user.profile.introduce,
            gender: user.profile.gender,
            mbti: user.profile.mbti,
            interests: user.profile.interests,
            province: user.profile.province,
            city: user.profile.city,
            profile_image_url: user.profile.profile_image?.file_url || null,
          }
        : null,
    };

    return plainToInstance(UserProfileResponseDto, profileData, {
      excludeExtraneousValues: true,
    });
  }

  async updateOrCreateUserProfile(userId: number, dto: UserProfileDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(
        new ErrorResponseDto(
          ExceptionCode.USER_NOT_FOUND,
          `User with ID ${userId} not found`,
        ),
      );
    }



    // Check if profile exists
    const existingProfile = await this.prisma.userProfile.findUnique({
      where: { user_id: userId },
    });

    // 프로필 생성 또는 업데이트
    if (existingProfile) {
      // interests 처리
      const interests = dto.interests ? dto.interests : undefined;

      // 업데이트용 프로필 데이터 객체 구성 - null/undefined가 아닌 필드만 포함
      const profileData = Object.entries({
        nickname: dto.nickname,
        birthday: new Date(dto.birthday),
        gender: dto.gender,
        mbti: dto.mbti,
        interests,
        province: dto.province,
        city: dto.city,
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
      // 프로필 생성 시 필수 정보
      if (
        dto.nickname === undefined ||
        dto.birthday === undefined ||
        dto.gender === undefined ||
        dto.province === undefined ||
        dto.city === undefined
      ) {
        throw new BadRequestException(
          new ErrorResponseDto(
            ExceptionCode.NOT_ENOUGH_PROFILE_INFO,
            '프로필 생성을 위해 age, gender, province, city 정보가 모두 필요합니다.',
          ),
        );
      }

      // 새 프로필 생성을 위한 타입 안전한 데이터 객체 생성
      const createProfileData = {
        nickname: dto.nickname!,
        birthday: new Date(dto.birthday!),
        gender: dto.gender!,
        province: dto.province!,
        city: dto.city!,
        mbti: dto.mbti,
        interests: dto.interests,
      };

      await this.prisma.userProfile.create({
        data: {
          user_id: userId,
          ...createProfileData,
          interests: Array.isArray(dto.interests)
            ? dto.interests.join(',')
            : dto.interests || '',
        },
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
        new ErrorResponseDto(
          ExceptionCode.USER_NOT_FOUND,
          `User with ID ${userId} not found`,
        ),
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
          updated_at: new Date(),
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
          updated_at: new Date(),
        },
      });
    }
  }

  async updateUserCredential(userId: number, dto: UpdateCredentialDto) {
    // 1. Find the user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(
        new ErrorResponseDto(
          ExceptionCode.USER_NOT_FOUND,
          `User with ID ${userId} not found`,
        ),
      );
    }

    // 2. Compare passwords
    const passwordMatch = await bcrypt.compare(dto.currentPassword, user.password_hash);
    if (!passwordMatch) {
      throw new UnauthorizedException(
        new ErrorResponseDto(
          ExceptionCode.INVALID_CREDENTIALS,
          'Current password is incorrect',
        ),
      );
    }

    // 3. Hash new password
    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password_hash: newHash },
    });

    return { success: true, message: 'Password updated successfully.' };
  }

  async getUserLoveLanguage(userId: number) {
    const loveLanguage = await this.prisma.userLoveLanguage.findUnique({
      where: { user_id: userId },
    });

    if (!loveLanguage) {
      throw new NotFoundException(
        new ErrorResponseDto(
          ExceptionCode.USER_PERSONALITY_NOT_FOUND, // Consider making a new ExceptionCode for love language
          `Love language data for user with ID ${userId} not found`,
        ),
      );
    }

    return plainToInstance(UserLoveLanguageResponseDto, loveLanguage, {
      excludeExtraneousValues: true,
    });
  }

  async updateOrCreateUserLoveLanguage(userId: number, dto: UserLoveLanguageDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(
        new ErrorResponseDto(
          ExceptionCode.USER_NOT_FOUND,
          `User with ID ${userId} not found`,
        ),
      );
    }

    // Check if love language exists, upsert if needed
    const existingLoveLanguage = await this.prisma.userLoveLanguage.findUnique({
      where: { user_id: userId },
    });

    if (existingLoveLanguage) {
      // Update existing love language
      return this.prisma.userLoveLanguage.update({
        where: { user_id: userId },
        data: {
          words_of_affirmation: dto.words_of_affirmation,
          acts_of_service: dto.acts_of_service,
          receiving_gifts: dto.receiving_gifts,
          quality_time: dto.quality_time,
          physical_touch: dto.physical_touch,
          updated_at: new Date(),
        },
      });
    } else {
      // Create new love language
      return this.prisma.userLoveLanguage.create({
        data: {
          user_id: userId,
          words_of_affirmation: dto.words_of_affirmation,
          acts_of_service: dto.acts_of_service,
          receiving_gifts: dto.receiving_gifts,
          quality_time: dto.quality_time,
          physical_touch: dto.physical_touch,
          updated_at: new Date(),
        },
      });
    }
  }

  // Calculate personality from survey answers (mock logic)
  async scorePersonalitySurvey(dto: { answers: number[] }) {
    const [a1, a2, a3, a4, a5] = dto.answers;
    const personality = {
      openness: a1,
      conscientiousness: a2,
      extraversion: a3,
      agreeableness: a4,
      neuroticism: a5,
    };
    return { personality };
  }

  // Calculate love language from survey answers (mock logic)
  async scoreLoveLanguageSurvey(dto: { answers: number[] }) {
    const [a1, a2, a3, a4, a5] = dto.answers;
    const loveLanguage = {
      words_of_affirmation: a1,
      acts_of_service: a2,
      receiving_gifts: a3,
      quality_time: a4,
      physical_touch: a5,
    };
    return { loveLanguage };
  }
}


