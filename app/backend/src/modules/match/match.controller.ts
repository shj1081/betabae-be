import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { BasicResponseDto } from 'src/dto/common/basic.response.dto';
import { CreateMatchRequestDto } from 'src/dto/match/create-match.request.dto';
import { AuthGuard } from '../auth/auth.guard';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createMatch(
    @Req() req: Request,
    @Body() dto: CreateMatchRequestDto,
  ) {
    const userId = Number(req['user'].id);
    const match = await this.matchService.createMatch(userId, dto.requestedId);

    return new BasicResponseDto('Match request sent successfully', match);
  }

  @UseGuards(AuthGuard)
  @Post(':id/accept')
  async acceptMatch(
    @Req() req: Request,
    @Param('id', ParseIntPipe) matchId: number,
  ) {
    const userId = Number(req['user'].id);
    const match = await this.matchService.acceptMatch(userId, matchId);

    return new BasicResponseDto('Match accepted successfully', match);
  }

  @UseGuards(AuthGuard)
  @Post(':id/reject')
  async rejectMatch(
    @Req() req: Request,
    @Param('id', ParseIntPipe) matchId: number,
  ) {
    const userId = Number(req['user'].id);
    const match = await this.matchService.rejectMatch(userId, matchId);

    return new BasicResponseDto('Match rejected successfully', match);
  }

  @UseGuards(AuthGuard)
  @Get('received')
  async getReceivedMatches(@Req() req: Request) {
    const userId = Number(req['user'].id);
    const matches = await this.matchService.getReceivedMatches(userId);

    return new BasicResponseDto(
      'Received match requests retrieved successfully',
      matches,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllMatches(@Req() req: Request) {
    const userId = Number(req['user'].id);
    const matches = await this.matchService.getAllMatches(userId);

    return new BasicResponseDto('All matches retrieved successfully', matches);
  }
}
