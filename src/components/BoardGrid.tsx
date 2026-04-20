import type { BoardSize } from "../types/game";

interface BoardGridProps {
  board: number[];
  size: BoardSize;
  currentTarget: number;
  paused: boolean;
  onSelect: (value: number) => void;
}

export function BoardGrid({ board, size, currentTarget, paused, onSelect }: BoardGridProps) {
  return (
    <div
      className="board-grid"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
    >
      {board.map((value) => {
        const isCompleted = value < currentTarget;
        const isCurrent = value === currentTarget;

        return (
          <button
            key={value}
            type="button"
            className={`cell${isCompleted ? " cell-completed" : ""}${isCurrent ? " cell-current" : ""}`}
            onClick={() => onSelect(value)}
            disabled={paused || isCompleted}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
