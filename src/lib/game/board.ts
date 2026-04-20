import type { BoardSize } from "../../types/game";

export function createBoard(size: BoardSize): number[] {
  const total = size * size;
  const board = Array.from({ length: total }, (_, index) => index + 1);

  for (let index = board.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [board[index], board[swapIndex]] = [board[swapIndex], board[index]];
  }

  return board;
}

export function getNextTarget(completedCount: number): number {
  return completedCount + 1;
}

export function isCorrectSelection(value: number, target: number): boolean {
  return value === target;
}
