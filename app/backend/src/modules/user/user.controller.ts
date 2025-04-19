import { Body, Controller, Get, Put, Post, Req, UseGuards } from '@nestjs/common';
import { PersonalitySurveyScoreRequestDto } from 'src/dto/user/personality-survey-score.request.dto';
import { LoveLanguageSurveyScoreRequestDto } from 'src/dto/user/lovelanguage-survey-score.request.dto';
import { Request } from 'express';
import { BasicResponseDto } from 'src/dto/common/basic.response.dto';
import { UpdateCredentialDto } from 'src/dto/user/credential.request.dto';
import { UserPersonalityDto } from 'src/dto/user/personality.request.dto';
import { UserProfileDto } from 'src/dto/user/profile.request.dto';
import { UserLoveLanguageDto } from 'src/dto/user/lovelanguage.request.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get the profile information of the current user.
   *
   * @param req - The request object containing user information.
   * @returns The profile data of the user in the response body.
   * @throws NotFoundException if the user is not found.
   */
  @UseGuards(AuthGuard)
  @Get('profile')
  async getUserProfile(@Req() req: Request) {
    const userId = Number(req['user'].id);
    const userData = await this.userService.getUserProfile(userId);

    return new BasicResponseDto(
      'User profile retrieved successfully',
      userData,
    );
  }

  /**
   * Update or create the profile information of the current user.
   *
   * @param req - The request object containing user information.
   * @param dto - The profile data transfer object.
   * @returns The updated profile data of the user in the response body.
   * @throws NotFoundException if the user is not found.
   * @throws BadRequestException if the dto is invalid.
   */
  @UseGuards(AuthGuard)
  @Put('profile')
  async updateOrCreateUserProfile(
    @Req() req: Request,
    @Body() dto: UserProfileDto,
  ) {
    const userId = Number(req['user'].id);
    const updatedUser = await this.userService.updateOrCreateUserProfile(
      userId,
      dto,
    );

    return new BasicResponseDto(
      'User profile updated successfully',
      updatedUser,
    );
  }

  /**
   * Get the personality information of the current user.
   *
   * @param req - The request object containing user information.
   * @returns The personality data of the user in the response body.
   * @throws NotFoundException if the user is not found.
   */
  @UseGuards(AuthGuard)
  @Get('personality')
  async getUserPersonality(@Req() req: Request) {
    const userId = Number(req['user'].id);
    const personalityData = await this.userService.getUserPersonality(userId);

    return new BasicResponseDto(
      'User personality retrieved successfully',
      personalityData,
    );
  }

  /**
   * Update or create the personality information of the current user.
   *
   * @param req - The request object containing user information.
   * @param dto - The personality data transfer object.
   * @returns The updated personality data of the user in the response body.
   * @throws NotFoundException if the user is not found.
   * @throws BadRequestException if the dto is invalid.
   */
  @UseGuards(AuthGuard)
  @Put('personality')
  async updateOrCreateUserPersonality(
    @Req() req: Request,
    @Body() dto: UserPersonalityDto,
  ) {
    const userId = Number(req['user'].id);
    const updatedPersonality =
      await this.userService.updateOrCreateUserPersonality(userId, dto);

    return new BasicResponseDto(
      'User personality updated successfully',
      updatedPersonality,
    );
  }

  /**
   * Update the credential information of the current user, such as the password.
   *
   * @param req - The request object containing user information.
   * @param dto - The credential update data transfer object.
   * @returns A response indicating the password was updated successfully.
   * @throws UnauthorizedException if the current password is incorrect.
   * @throws NotFoundException if the user is not found.
   */
  @UseGuards(AuthGuard)
  @Put('credential')
  async updateUserCredential(
    @Req() req: Request,
    @Body() dto: UpdateCredentialDto,
  ) {
    const userId = Number(req['user'].id);
    const result = await this.userService.updateUserCredential(userId, dto);

    return new BasicResponseDto('Password updated successfully', result);
  }

  /**
   * Get the love language information of the current user.
   *
   * @param req - The request object containing user information.
   * @returns The love language data of the user in the response body.
   * @throws NotFoundException if the user is not found.
   */
  @UseGuards(AuthGuard)
  @Get('lovelanguage')
  async getUserLoveLanguage(@Req() req: Request) {
    const userId = Number(req['user'].id);
    const loveLanguageData = await this.userService.getUserLoveLanguage(userId);

    return new BasicResponseDto(
      'User love language retrieved successfully',
      loveLanguageData,
    );
  }

  /**
   * Update or create the love language information of the current user.
   *
   * @param req - The request object containing user information.
   * @param dto - The love language data transfer object.
   * @returns The updated love language data of the user in the response body.
   * @throws NotFoundException if the user is not found.
   * @throws BadRequestException if the dto is invalid.
   */
  @UseGuards(AuthGuard)
  @Put('lovelanguage')
  async updateOrCreateUserLoveLanguage(
    @Req() req: Request,
    @Body() dto: UserLoveLanguageDto,
  ) {
    const userId = Number(req['user'].id);
    const updatedLoveLanguage =
      await this.userService.updateOrCreateUserLoveLanguage(userId, dto);

    return new BasicResponseDto(
      'User love language updated successfully',
      updatedLoveLanguage,
    );
  }

  /**
   * Calculate and update the personality traits of the current user based on survey answers.
   *
   * @param dto - The personality survey score data transfer object.
   * @returns The updated personality data of the user in the response body.
   * @throws NotFoundException if the user is not found.
   * @throws BadRequestException if the dto is invalid.
   */
  @UseGuards(AuthGuard)
  @Post('personality/score')
  async scorePersonalitySurvey(
    @Body() dto: PersonalitySurveyScoreRequestDto,
  ) {
    const result = await this.userService.scorePersonalitySurvey(dto);
    return new BasicResponseDto(
      'Personality survey scored and user data updated',
      result,
    );
  }

  /**
   * Calculate and update the love language of the current user based on survey answers.
   *
   * @param dto - The love language survey score data transfer object.
   * @returns The updated love language data of the user in the response body.
   * @throws NotFoundException if the user is not found.
   * @throws BadRequestException if the dto is invalid.
   */
  @UseGuards(AuthGuard)
  @Post('lovelanguage/score')
  async scoreLoveLanguageSurvey(
    @Body() dto: LoveLanguageSurveyScoreRequestDto,
  ) {
    const result = await this.userService.scoreLoveLanguageSurvey(dto);
    return new BasicResponseDto(
      'Love language survey scored and user data updated',
      result,
    );
  }
}


