import { beforeEach, describe, expect, it } from "vitest";
import { loadHistory, saveResult } from "../lib/storage/history";
import type { GameResult } from "../types/game";

const firstResult: GameResult = {
  id: "run-1",
  size: 3,
  startedAt: "2026-04-20T09:00:00.000Z",
  completedAt: "2026-04-20T09:00:12.000Z",
  durationMs: 12_000,
  averageTapMs: 1_500,
  best: false,
};

describe("history storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("loads an empty history list by default", () => {
    expect(loadHistory()).toEqual([]);
  });

  it("saves new results in reverse chronological order", () => {
    const secondResult: GameResult = {
      ...firstResult,
      id: "run-2",
      completedAt: "2026-04-20T09:01:05.000Z",
      durationMs: 9_000,
      averageTapMs: 1_125,
    };

    saveResult(firstResult);
    saveResult(secondResult);

    expect(loadHistory()).toEqual([secondResult, firstResult]);
  });
});
