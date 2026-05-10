import type { BoardSize } from "../types/game";

interface Feedback {
  value: number;
  correct: boolean;
}

interface BoardGridProps {
  board: number[];
  size: BoardSize;
  paused: boolean;
  completedCount: number;
  feedback: Feedback | null;
  onClick: (value: number) => void;
}

export function BoardGrid({
  board,
  size,
  paused,
  completedCount,
  feedback,
  onClick,
}: BoardGridProps) {
  return (
    <div
      className="board-grid"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
    >
      {board.map((value) => {
        const isCompleted = value <= completedCount;
        const isFeedback = feedback?.value === value;

        return (
          <button
            key={value}
            type="button"
            className={`cell${isCompleted ? " cell-completed" : ""}${isFeedback && feedback.correct ? " cell-hit-correct" : ""}${isFeedback && !feedback.correct ? " cell-hit-wrong" : ""}`}
            onClick={() => {
              if (!isCompleted && !paused) {
                onClick(value);
              }
            }}
            disabled={paused || isCompleted}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}