import type { GameResult } from "../../types/game";

const STORAGE_KEY = "schulte-grid.history.v1";

function isValidGameResult(entry: unknown): entry is GameResult {
  if (typeof entry !== "object" || entry === null) return false;
  const r = entry as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    (r.size === 3 || r.size === 4 || r.size === 5) &&
    typeof r.startedAt === "string" &&
    typeof r.completedAt === "string" &&
    typeof r.durationMs === "number" &&
    r.durationMs >= 0 &&
    typeof r.averageTapMs === "number" &&
    r.averageTapMs >= 0 &&
    typeof r.best === "boolean"
  );
}

export function loadHistory(): GameResult[] {
  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidGameResult);
  } catch {
    return [];
  }
}

export function saveResult(result: GameResult, history: GameResult[]): GameResult[] {
  const nextHistory = [result, ...history].sort(
    (left: GameResult, right: GameResult) =>
      new Date(right.completedAt).getTime() - new Date(left.completedAt).getTime(),
  );

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));

  return nextHistory;
}
