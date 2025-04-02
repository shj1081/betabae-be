// src/auth/auth.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BasicResponseDto } from 'src/dto/common/basic.response.dto';
import { ExceptionCode } from 'src/dto/common/custom.exception.code';
import { ErrorResponseDto } from 'src/dto/common/error.response.dto';
import { LoginRequestDto } from '../dto/auth/login.request.dto';
import { RegisterRequestDto } from '../dto/auth/register.request.dto';
import { AuthService } from './auth.service';

// TODO: refine response
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterRequestDto) {
    await this.authService.register(dto);
    return new BasicResponseDto('Register successful', {
      username: dto.username,
    });
  }

  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { sessionId } = await this.authService.login(
      dto.username,
      dto.password,
    );

    res.cookie('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only in production
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 24h
      path: '/',
    });

    return new BasicResponseDto('Login successful', {
      username: dto.username,
    });
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    const sessionId = res.cookie['session_id'];
    if (!sessionId)
      throw new BadRequestException(
        new ErrorResponseDto(
          ExceptionCode.SESSION_NOT_FOUND,
          'Session not found',
        ),
      );

    await this.authService.logout(sessionId);
    res.clearCookie('session_id');
    return new BasicResponseDto('Logout successful');
  }
}
