import { describe, expect, it } from "vitest";
import { createBoard, getNextTarget, isCorrectSelection } from "../lib/game/board";

describe("createBoard", () => {
  it("creates a shuffled board with unique ascending values for a given size", () => {
    const board = createBoard(3);

    expect(board).toHaveLength(9);
    expect(new Set(board).size).toBe(9);
    expect([...board].sort((left: number, right: number) => left - right)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });
});

describe("game target helpers", () => {
  it("returns the next ascending target and validates correct taps", () => {
    expect(getNextTarget(0)).toBe(1);
    expect(getNextTarget(6)).toBe(7);
    expect(isCorrectSelection(4, 4)).toBe(true);
    expect(isCorrectSelection(4, 5)).toBe(false);
  });
});
