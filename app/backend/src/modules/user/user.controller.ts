import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { BasicResponseDto } from 'src/dto/common/basic.response.dto';
import { UpdateCredentialDto } from 'src/dto/user/credential.request.dto';
import { UserPersonalityDto } from 'src/dto/user/personality.request.dto';
import { UserProfileDto } from 'src/dto/user/profile.request.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get the profile information of the current user.
   *
   * @summary Get the profile information of the current user.
   * @throws {NotFoundException} If the user is not found.
   * @returns {BasicResponseDto} The profile data of the user in the response body.
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
   * @summary Update or create the profile information of the current user.
   * @throws {NotFoundException} If the user is not found.
   * @throws {BadRequestException} If the dto is invalid.
   * @returns {BasicResponseDto} The updated profile data of the user in the response body.
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
   * @summary Get the personality information of the current user.
   * @throws {NotFoundException} If the user is not found.
   * @returns {BasicResponseDto} The personality data of the user in the response body.
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
   * @summary Update or create the personality information of the current user.
   * @throws {NotFoundException} If the user is not found.
   * @throws {BadRequestException} If the dto is invalid.
   * @returns {BasicResponseDto} The updated personality data of the user in the response body.
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
   * Update the credential information of the current user.
   *
   * @summary Update the credential information of the current user, such as the password.
   * @throws {UnauthorizedException} If the current password is incorrect.
   * @throws {NotFoundException} If the user is not found.
   * @returns {BasicResponseDto} A response indicating the password was updated successfully.
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
}
