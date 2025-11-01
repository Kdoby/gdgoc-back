import { Injectable } from '@nestjs/common';
import { ScoreRecord, Difficulty, RankingResponse } from './score.model';
import { CreateScoreDto } from './dto/create-score.dto';

@Injectable()
export class ScoreService {
  private rankings: {
    easy: ScoreRecord[];
    medium: ScoreRecord[];
    hard: ScoreRecord[];
  } = {
    easy: [],
    medium: [],
    hard: [],
  };

  /**
   * 점수 기록 저장
   * @param createScoreDto 점수 기록 정보
   * @returns 성공 여부 및 랭킹 정보
   */
  async createScore(createScoreDto: CreateScoreDto): Promise<{
    success: boolean;
    message: string;
    rank?: number;
  }> {
    const { name, difficulty, score, time } = createScoreDto;

    // 난이도 유효성 검사
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return {
        success: false,
        message: 'Invalid difficulty level.',
      };
    }

    // 이름 유효성 검사
    if (!name || name.trim().length === 0 || name.length > 20) {
      return {
        success: false,
        message: 'Invalid name. Name must be between 1 and 20 characters.',
      };
    }

    // 새로운 기록 생성
    const newRecord: ScoreRecord = {
      name: name.trim(),
      score,
      time,
      recordedAt: new Date(),
    };

    // 해당 난이도의 랭킹에 추가
    const difficultyRanking = this.rankings[
      difficulty as Difficulty
    ] as ScoreRecord[];
    difficultyRanking.push(newRecord);

    // 정렬: 점수 내림차순 → 동점 시 시간 오름차순 → 동시간 시 기록 시간 오름차순
    difficultyRanking.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // 점수 내림차순
      }
      if (a.time !== b.time) {
        return a.time - b.time; // 시간 오름차순 (짧은 시간이 더 좋음)
      }
      return a.recordedAt.getTime() - b.recordedAt.getTime(); // 기록 시간 오름차순
    });

    // 상위 5개만 유지
    if (difficultyRanking.length > 5) {
      this.rankings[difficulty as Difficulty] = difficultyRanking.slice(0, 5);
    }

    // 현재 유저의 랭킹 찾기
    const userRank =
      difficultyRanking.findIndex(
        (record) =>
          record.name === newRecord.name &&
          record.score === newRecord.score &&
          record.time === newRecord.time &&
          record.recordedAt.getTime() === newRecord.recordedAt.getTime(),
      ) + 1;

    // 상위 5위 안에 들어갔는지 확인
    const rank = userRank <= 5 ? userRank : undefined;

    return {
      success: true,
      message: 'Score successfully recorded.',
      rank,
    };
  }

  /**
   * 난이도별 랭킹 조회
   * @param difficulty 난이도
   * @returns 랭킹 정보
   */
  getRanking(difficulty: string): RankingResponse {
    // 난이도 유효성 검사
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return {
        difficulty,
        ranking: [],
      };
    }

    const ranking = this.rankings[difficulty as Difficulty];

    // 상위 5개만 반환 (이미 정렬되어 있음)
    const topRanking = ranking.slice(0, 5).map((record, index) => ({
      rank: index + 1,
      name: record.name,
      score: record.score,
      time: record.time,
      recordedAt: record.recordedAt.toISOString(),
    }));

    return {
      difficulty,
      ranking: topRanking,
    };
  }

  /**
   * 서버 메모리 초기화 (개발용)
   */
  resetRankings(): { success: boolean; message: string } {
    this.rankings = {
      easy: [],
      medium: [],
      hard: [],
    };

    return {
      success: true,
      message: 'Rankings have been reset.',
    };
  }
}

