import type { GameConfig, GameResult, GameSession } from "../../types/game";
import { createBoard, getNextTarget, isCorrectSelection } from "./board";

function createResultId(now: number): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `run-${now}`;
}

export function createSession(config: GameConfig, now: number): GameSession {
  return {
    config,
    board: createBoard(config.size),
    completedCount: 0,
    startedAt: new Date(now).toISOString(),
    elapsedMs: 0,
    runningSinceMs: now,
  };
}

export function getElapsedMs(session: GameSession, now: number): number {
  if (session.runningSinceMs === null) {
    return session.elapsedMs;
  }

  return session.elapsedMs + (now - session.runningSinceMs);
}

export function pauseSession(session: GameSession, now: number): GameSession {
  if (session.runningSinceMs === null) {
    return session;
  }

  return {
    ...session,
    elapsedMs: getElapsedMs(session, now),
    runningSinceMs: null,
  };
}

export function resumeSession(session: GameSession, now: number): GameSession {
  if (session.runningSinceMs !== null) {
    return session;
  }

  return {
    ...session,
    runningSinceMs: now,
  };
}

export function selectBoardValue(
  session: GameSession,
  value: number,
): { advanced: boolean; completed: boolean; session: GameSession } {
  const target = getNextTarget(session.completedCount);

  if (!isCorrectSelection(value, target)) {
    return {
      advanced: false,
      completed: false,
      session,
    };
  }

  const nextSession = {
    ...session,
    completedCount: session.completedCount + 1,
  };

  return {
    advanced: true,
    completed: nextSession.completedCount === nextSession.board.length,
    session: nextSession,
  };
}

export function createResult(
  session: GameSession,
  now: number,
  history: GameResult[],
): GameResult {
  const durationMs = getElapsedMs(session, now);
  const sameSizeBest = history
    .filter((entry) => entry.size === session.config.size)
    .reduce<number | null>(
      (best, entry) => (best === null || entry.durationMs < best ? entry.durationMs : best),
      null,
    );

  return {
    id: createResultId(now),
    size: session.config.size,
    startedAt: session.startedAt,
    completedAt: new Date(now).toISOString(),
    durationMs,
    averageTapMs: Math.round(durationMs / session.board.length),
    best: sameSizeBest === null || durationMs < sameSizeBest,
  };
}
