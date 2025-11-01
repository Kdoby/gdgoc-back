import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ScoreService } from './score.service';
import { CreateScoreDto } from './dto/create-score.dto';

@Controller('api')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  /**
   * 점수 기록 저장
   * POST /api/score
   */
  @Post('score')
  @HttpCode(HttpStatus.OK)
  async createScore(@Body() createScoreDto: CreateScoreDto) {
    return await this.scoreService.createScore(createScoreDto);
  }

  /**
   * 난이도별 랭킹 조회
   * GET /api/rank/:difficulty
   */
  @Get('rank/:difficulty')
  getRanking(@Param('difficulty') difficulty: string) {
    return this.scoreService.getRanking(difficulty);
  }

  /**
   * 서버 메모리 초기화 (개발용)
   * DELETE /api/reset
   */
  @Delete('reset')
  @HttpCode(HttpStatus.OK)
  resetRankings() {
    return this.scoreService.resetRankings();
  }
}

