import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
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

  async registerAndLogin(dto: RegisterRequestDto) {
    // check if user already exists
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (user)
      throw new BadRequestException(
        new ErrorResponseDto(
          ExceptionCode.USER_ALREADY_EXISTS,
          `Email ${dto.email} already exists`,
        ),
      );

    // hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // create user with basic information only
    await this.prisma.user.create({
      data: {
        email: dto.email,
        password_hash: hashedPassword,
        name: dto.name,
      },
    });

    return this.login(dto.email, dto.password);
  }

  async login(email: string, password: string): Promise<{ sessionId: string }> {
    // find user by email from User table
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      throw new UnauthorizedException(
        new ErrorResponseDto(ExceptionCode.USER_NOT_FOUND, `Email ${email} not found`),
      );

    // compare password with password_hash from User table
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      throw new UnauthorizedException(
        new ErrorResponseDto(ExceptionCode.INVALID_CREDENTIALS, 'Password is incorrect'),
      );

    // generate sessionId
    const sessionId = uuidv4();
    const sessionKey = `session:${sessionId}`;

    // save sessionId and user_id to redis without TTL
    await this.redis.set(sessionKey, JSON.stringify({ id: user.id, email: user.email }));

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
