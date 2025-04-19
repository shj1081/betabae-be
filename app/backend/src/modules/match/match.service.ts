import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { MatchStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ErrorResponseDto } from 'src/dto/common/error.response.dto';
import { MatchResponseDto } from 'src/dto/match/match.response.dto';
import { ExceptionCode } from 'src/enums/custom.exception.code';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async createMatch(
    requesterId: number,
    requestedId: number,
  ): Promise<MatchResponseDto> {
    // Check if users exist
    const requester = await this.prisma.user.findUnique({
      where: { id: requesterId },
    });

    if (!requester) {
      throw new NotFoundException(
        new ErrorResponseDto(
          ExceptionCode.USER_NOT_FOUND,
          `Requester with ID ${requesterId} not found`,
        ),
      );
    }

    const requested = await this.prisma.user.findUnique({
      where: { id: requestedId },
    });

    if (!requested) {
      throw new NotFoundException(
        new ErrorResponseDto(
          ExceptionCode.USER_NOT_FOUND,
          `Requested user with ID ${requestedId} not found`,
        ),
      );
    }

    // Check if a match already exists between these users
    const existingMatch = await this.prisma.match.findFirst({
      where: {
        OR: [
          {
            requester_id: requesterId,
            requested_id: requestedId,
          },
          {
            requester_id: requestedId,
            requested_id: requesterId,
          },
        ],
      },
    });

    if (existingMatch) {
      throw new BadRequestException(
        new ErrorResponseDto(
          ExceptionCode.MATCH_ALREADY_EXISTS,
          'A match already exists between these users',
        ),
      );
    }

    // Create the match
    const match = await this.prisma.match.create({
      data: {
        requester_id: requesterId,
        requested_id: requestedId,
        status: MatchStatus.PENDING,
        requester_consent: true, // Requester consents by default
        requested_consent: false, // Requested user hasn't consented yet
      },
      include: {
        requester: {
          select: {
            id: true,
            legal_name: true,
            
          },
        },
        requested: {
          select: {
            id: true,
            legal_name: true,
            
          },
        },
      },
    });

    return this.mapMatchToDto(match);
  }

  async acceptMatch(userId: number, matchId: number): Promise<MatchResponseDto> {
    const match = await this.getMatchById(matchId);

    // Ensure the user is the requested user in the match
    if (match.requested_id !== userId) {
      throw new BadRequestException(
        new ErrorResponseDto(
          ExceptionCode.UNAUTHORIZED_MATCH_ACTION,
          'Only the requested user can accept this match',
        ),
      );
    }

    // Ensure match is in PENDING status
    if (match.status !== MatchStatus.PENDING) {
      throw new BadRequestException(
        new ErrorResponseDto(
          ExceptionCode.INVALID_MATCH_STATUS,
          `Match is already ${match.status.toLowerCase()}`,
        ),
      );
    }

    // Update match status to ACCEPTED
    const updatedMatch = await this.prisma.match.update({
      where: { id: matchId },
      data: {
        status: MatchStatus.ACCEPTED,
        requested_consent: true,
      },
      include: {
        requester: {
          select: {
            id: true,
            legal_name: true,
            
          },
        },
        requested: {
          select: {
            id: true,
            legal_name: true,
            
          },
        },
      },
    });

    // TODO: Create a conversation for the match when accepted (BETA_BAE?)
    await this.prisma.conversation.create({
      data: {
        match_id: matchId,
        type: 'BETA_BAE', // Default conversation type
      },
    });

    return this.mapMatchToDto(updatedMatch);
  }

  async rejectMatch(userId: number, matchId: number): Promise<MatchResponseDto> {
    const match = await this.getMatchById(matchId);

    // Ensure the user is the requested user in the match
    if (match.requested_id !== userId) {
      throw new BadRequestException(
        new ErrorResponseDto(
          ExceptionCode.UNAUTHORIZED_MATCH_ACTION,
          'Only the requested user can reject this match',
        ),
      );
    }

    // Ensure match is in PENDING status
    if (match.status !== MatchStatus.PENDING) {
      throw new BadRequestException(
        new ErrorResponseDto(
          ExceptionCode.INVALID_MATCH_STATUS,
          `Match is already ${match.status.toLowerCase()}`,
        ),
      );
    }

    // Update match status to REJECTED
    const updatedMatch = await this.prisma.match.update({
      where: { id: matchId },
      data: {
        status: MatchStatus.REJECTED,
      },
      include: {
        requester: {
          select: {
            id: true,
            legal_name: true,
          },
        },
        requested: {
          select: {
            id: true,
            legal_name: true,
          },
        },
      },
    });

    return this.mapMatchToDto(updatedMatch);
  }

  async getReceivedMatches(userId: number): Promise<MatchResponseDto[]> {
    const matches = await this.prisma.match.findMany({
      where: {
        requested_id: userId,
        status: MatchStatus.PENDING,
      },
      include: {
        requester: {
          select: {
            id: true,
            legal_name: true,
            
          },
        },
        requested: {
          select: {
            id: true,
            legal_name: true,
            
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return matches.map((match) => this.mapMatchToDto(match));
  }

  async getAllMatches(userId: number): Promise<MatchResponseDto[]> {
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [
          { requester_id: userId },
          { requested_id: userId },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            legal_name: true,
            
          },
        },
        requested: {
          select: {
            id: true,
            legal_name: true,
            
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return matches.map((match) => this.mapMatchToDto(match));
  }

  private async getMatchById(matchId: number) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException(
        new ErrorResponseDto(
          ExceptionCode.MATCH_NOT_FOUND,
          `Match with ID ${matchId} not found`,
        ),
      );
    }

    return match;
  }

  private mapMatchToDto(match: any): MatchResponseDto {
    return plainToInstance(
      MatchResponseDto,
      {
        id: match.id,
        requester: match.requester,
        requested: match.requested,
        status: match.status,
        requesterConsent: match.requester_consent,
        requestedConsent: match.requested_consent,
        createdAt: match.created_at,
        updatedAt: match.updated_at,
      },
      { excludeExtraneousValues: true },
    );
  }
}
