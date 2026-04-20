import type { GameResult } from "../../types/game";

const STORAGE_KEY = "schulte-grid.history.v1";

export function loadHistory(): GameResult[] {
  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as GameResult[];
  } catch {
    return [];
  }
}

export function saveResult(result: GameResult): GameResult[] {
  const nextHistory = [result, ...loadHistory()].sort(
    (left: GameResult, right: GameResult) =>
      new Date(right.completedAt).getTime() - new Date(left.completedAt).getTime(),
  );

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));

  return nextHistory;
}
