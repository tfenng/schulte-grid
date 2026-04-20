import { formatBoardSize } from "../lib/format";
import type { BoardSize } from "../types/game";

interface ModePageProps {
  selectedSize: BoardSize;
  onSelectSize: (size: BoardSize) => void;
  onBack: () => void;
  onStart: () => void;
}

const boardSizes: BoardSize[] = [3, 4, 5];

export function ModePage({ selectedSize, onSelectSize, onBack, onStart }: ModePageProps) {
  return (
    <section className="page-shell">
      <p className="eyebrow">模式选择</p>
      <h2>先选棋盘尺寸</h2>
      <p className="page-lead">MVP 仅支持正序规则，点错数字会被忽略。</p>

      <div className="size-selector">
        {boardSizes.map((size) => (
          <button
            key={size}
            type="button"
            className={`size-button${selectedSize === size ? " size-button-active" : ""}`}
            onClick={() => onSelectSize(size)}
          >
            {formatBoardSize(size)}
          </button>
        ))}
      </div>

      <div className="inline-actions">
        <button type="button" className="secondary-button" onClick={onBack}>
          返回首页
        </button>
        <button type="button" className="primary-button" onClick={onStart}>
          开始本局
        </button>
      </div>
    </section>
  );
}
