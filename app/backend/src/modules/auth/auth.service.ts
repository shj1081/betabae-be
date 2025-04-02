import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterRequestDto } from 'src/dto/auth/register.request.dto';
import { ErrorResponseDto } from 'src/dto/common/error.response.dto';
import { ExceptionCode } from 'src/enums/custom.exception.code';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { RedisService } from 'src/infra/redis/redis.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async register(dto: RegisterRequestDto) {
    // check if user already exists
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (user)
      throw new BadRequestException(
        new ErrorResponseDto(
          ExceptionCode.USER_ALREADY_EXISTS,
          `Username ${dto.username} already exists`,
        ),
      );

    // hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // create user
    return this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password_hash: hashedPassword,
      },
    });
  }

  async login(
    username: string,
    password: string,
    currentSessionId?: string,
  ): Promise<{ sessionId: string }> {
    // Check if user is already logged in
    if (currentSessionId) {
      const existingSession = await this.redis.get(
        `session:${currentSessionId}`,
      );
      if (existingSession) {
        const sessionData = JSON.parse(existingSession);
        throw new BadRequestException(
          new ErrorResponseDto(
            ExceptionCode.ALREADY_LOGGED_IN,
            `User ${sessionData.username} is already logged in with session ${currentSessionId}`,
          ),
        );
      }
    }

    // find user by username from User table
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user)
      throw new UnauthorizedException(
        new ErrorResponseDto(
          ExceptionCode.USER_NOT_FOUND,
          `Username ${username} not found`,
        ),
      );

    // compare password with password_hash from User table
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      throw new UnauthorizedException(
        new ErrorResponseDto(
          ExceptionCode.INVALID_CREDENTIALS,
          'Password is incorrect',
        ),
      );

    // generate sessionId
    const sessionId = uuidv4();
    const sessionKey = `session:${sessionId}`;

    // save sessionId and user_id to redis without TTL
    await this.redis.set(
      sessionKey,
      JSON.stringify({ user_id: user.user_id, username: user.username }),
    );

    return { sessionId };
  }

  async logout(sessionId: string): Promise<void> {
    const sessionKey = `session:${sessionId}`;

    // Check if session exists before logout
    const session = await this.redis.get(sessionKey);
    if (!session) {
      throw new BadRequestException(
        new ErrorResponseDto(
          ExceptionCode.SESSION_NOT_FOUND,
          'Already logged out or invalid session',
        ),
      );
    }

    // Session exists, proceed with logout
    await this.redis.del(sessionKey);
  }
}
