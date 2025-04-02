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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { sessionId } = await this.authService.registerAndLogin(dto);

    // auto login after register
    res.cookie('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only in production
      sameSite: 'lax',
      path: '/',
    });

    return new BasicResponseDto('Register successful and logged in', {
      username: dto.username,
    });
  }

  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // session의 경우 ttl이 infinite이라고 가정
    // check if user is already logged in
    const currentSessionId = req.cookies.session_id;
    if (currentSessionId) {
      throw new BadRequestException(
        new ErrorResponseDto(
          ExceptionCode.ALREADY_LOGGED_IN,
          `User session ${currentSessionId} already exists`,
        ),
      );
    }

    const { sessionId } = await this.authService.login(
      dto.username,
      dto.password,
    );

    res.cookie('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only in production
      sameSite: 'lax',
      path: '/',
    });

    return new BasicResponseDto('Login successful', {
      username: dto.username,
    });
  }

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
