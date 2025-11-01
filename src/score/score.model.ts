export interface ScoreRecord {
  name: string;
  score: number;
  time: number;
  recordedAt: Date;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface RankingResponse {
  difficulty: string;
  ranking: Array<{
    rank: number;
    name: string;
    score: number;
    time: number;
    recordedAt: string;
  }>;
}

