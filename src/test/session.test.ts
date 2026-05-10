import { expect, it, describe } from "vitest";
import type { GameSession } from "../types/game";
import {
  createSession,
  getElapsedMs,
  pauseSession,
  resumeSession,
  selectBoardValue,
  createResult,
} from "../lib/game/session";

const BASE_TIME = 1_000_000_000;

function makeSession(overrides: Partial<GameSession> = {}): GameSession {
  return {
    config: { size: 3 },
    board: Array.from({ length: 9 }, (_, i) => i + 1),
    completedCount: 0,
    startedAt: new Date(BASE_TIME).toISOString(),
    elapsedMs: 0,
    runningSinceMs: BASE_TIME,
    ...overrides,
  };
}

function makeResult(overrides: Partial<import("../types/game").GameResult> = {}): import("../types/game").GameResult {
  return {
    id: "run-1",
    size: 3,
    startedAt: new Date(BASE_TIME - 60_000).toISOString(),
    completedAt: new Date(BASE_TIME).toISOString(),
    durationMs: 3_000,
    averageTapMs: 333,
    best: false,
    ...overrides,
  };
}

describe("createSession", () => {
  it("creates a session with a shuffled board for the given size", () => {
    const session = createSession({ size: 4 }, BASE_TIME);
    expect(session.board).toHaveLength(16);
    expect(session.completedCount).toBe(0);
    expect(session.runningSinceMs).toBe(BASE_TIME);
  });

  it("board contains all unique values from 1 to size^2", () => {
    const session = createSession({ size: 5 }, BASE_TIME);
    const sorted = [...session.board].sort((a, b) => a - b);
    expect(sorted).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
  });
});

describe("getElapsedMs", () => {
  it("returns stored elapsedMs when paused", () => {
    const session = makeSession({ runningSinceMs: null, elapsedMs: 500 });
    expect(getElapsedMs(session, BASE_TIME + 10_000)).toBe(500);
  });

  it("accumulates time between start and now when running", () => {
    const session = makeSession({ runningSinceMs: BASE_TIME, elapsedMs: 0 });
    expect(getElapsedMs(session, BASE_TIME + 3_000)).toBe(3_000);
  });

  it("includes stored elapsedMs plus elapsed time when running", () => {
    const session = makeSession({ runningSinceMs: BASE_TIME, elapsedMs: 1_000 });
    expect(getElapsedMs(session, BASE_TIME + 2_000)).toBe(3_000);
  });
});

describe("pauseSession", () => {
  it("stores elapsed time and sets runningSinceMs to null", () => {
    const session = makeSession({ runningSinceMs: BASE_TIME, elapsedMs: 0 });
    const paused = pauseSession(session, BASE_TIME + 5_000);
    expect(paused.runningSinceMs).toBe(null);
    expect(paused.elapsedMs).toBe(5_000);
  });

  it("returns the same session object if already paused", () => {
    const session = makeSession({ runningSinceMs: null, elapsedMs: 500 });
    expect(pauseSession(session, BASE_TIME)).toBe(session);
  });
});

describe("resumeSession", () => {
  it("resets runningSinceMs to now when resuming", () => {
    const session = makeSession({ runningSinceMs: null, elapsedMs: 5_000 });
    const resumed = resumeSession(session, BASE_TIME + 10_000);
    expect(resumed.runningSinceMs).toBe(BASE_TIME + 10_000);
    expect(resumed.elapsedMs).toBe(5_000);
  });

  it("returns the same session object if already running", () => {
    const session = makeSession({ runningSinceMs: BASE_TIME });
    expect(resumeSession(session, BASE_TIME + 1_000)).toBe(session);
  });
});

describe("selectBoardValue", () => {
  it("does not advance when wrong value is clicked", () => {
    const session = makeSession({ completedCount: 0 });
    const result = selectBoardValue(session, 2); // target is 1
    expect(result.advanced).toBe(false);
    expect(result.completed).toBe(false);
    expect(result.session.completedCount).toBe(0);
  });

  it("advances when correct value is clicked", () => {
    const session = makeSession({ completedCount: 0 });
    const result = selectBoardValue(session, 1);
    expect(result.advanced).toBe(true);
    expect(result.completed).toBe(false);
    expect(result.session.completedCount).toBe(1);
  });

  it("marks completed when the last cell is correctly clicked", () => {
    const session = makeSession({ completedCount: 8 });
    const result = selectBoardValue(session, 9);
    expect(result.advanced).toBe(true);
    expect(result.completed).toBe(true);
  });

  it("does not mark completed when clicking a non-final correct value", () => {
    const session = makeSession({ completedCount: 7 });
    const result = selectBoardValue(session, 8);
    expect(result.advanced).toBe(true);
    expect(result.completed).toBe(false);
  });
});

describe("createResult", () => {
  it("marks best when no prior result exists", () => {
    const session = makeSession({ runningSinceMs: null, elapsedMs: 3_000 });
    const result = createResult(session, BASE_TIME + 10_000, []);
    expect(result.best).toBe(true);
    expect(result.size).toBe(3);
    expect(result.durationMs).toBe(3_000);
  });

  it("marks best when beating the prior best", () => {
    const session = makeSession({ runningSinceMs: null, elapsedMs: 1_000 });
    const history = [makeResult({ durationMs: 3_000 })];
    const result = createResult(session, BASE_TIME + 2_000, history);
    expect(result.best).toBe(true);
  });

  it("does not mark best when slower than prior best", () => {
    const session = makeSession({ runningSinceMs: null, elapsedMs: 5_000 });
    const history = [makeResult({ durationMs: 3_000 })];
    const result = createResult(session, BASE_TIME + 5_000, history);
    expect(result.best).toBe(false);
  });

  it("ignores prior results of different board size", () => {
    const session = makeSession({ runningSinceMs: null, elapsedMs: 10_000 });
    const history = [makeResult({ size: 5 as const, durationMs: 100 })];
    const result = createResult(session, BASE_TIME + 10_000, history);
    expect(result.best).toBe(true);
  });
});