// src/auth/auth.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginRequestDto } from 'src/dto/auth/login.request.dto';
import { RegisterRequestDto } from 'src/dto/auth/register.request.dto';
import { BasicResponseDto } from 'src/dto/common/basic.response.dto';
import { ErrorResponseDto } from 'src/dto/common/error.response.dto';
import { ExceptionCode } from 'src/enums/custom.exception.code';
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

  // BUG: 이미 로그인 상태인 경우에도 로그인 성공 응답 반환함
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

  // BUG: session 쿠키가 없을 경우에도 성공 응답 반환함
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId = req.cookies.session_id;
    if (!sessionId) {
      throw new BadRequestException(
        new ErrorResponseDto(
          ExceptionCode.SESSION_NOT_FOUND,
          `Session not found with ${sessionId}`,
        ),
      );
    }

    await this.authService.logout(sessionId);
    res.clearCookie('session_id');
    return new BasicResponseDto('Logout successful');
  }
}
