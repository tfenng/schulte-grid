export type BoardSize = 3 | 4 | 5;

export interface GameConfig {
  size: BoardSize;
}

export interface GameSession {
  config: GameConfig;
  board: number[];
  completedCount: number;
  startedAt: string;
  elapsedMs: number;
  runningSinceMs: number | null;
}

export interface GameResult {
  id: string;
  size: BoardSize;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  averageTapMs: number;
  best: boolean;
}
