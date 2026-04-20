import { BoardGrid } from "../components/BoardGrid";
import { formatBoardSize, formatDuration } from "../lib/format";
import { getNextTarget } from "../lib/game/board";
import type { GameSession } from "../types/game";

interface TrainingPageProps {
  session: GameSession;
  elapsedMs: number;
  onSelectValue: (value: number) => void;
  onPauseToggle: () => void;
  onExit: () => void;
}

export function TrainingPage({
  session,
  elapsedMs,
  onSelectValue,
  onPauseToggle,
  onExit,
}: TrainingPageProps) {
  const currentTarget = getNextTarget(session.completedCount);
  const paused = session.runningSinceMs === null;

  return (
    <section className="page-shell page-shell-wide">
      <div className="training-header">
        <div>
          <p className="eyebrow">训练中</p>
          <h2>{formatBoardSize(session.config.size)}</h2>
        </div>
        <div className="inline-actions">
          <button type="button" className="secondary-button" onClick={onPauseToggle}>
            {paused ? "继续训练" : "暂停"}
          </button>
          <button type="button" className="ghost-button" onClick={onExit}>
            退出
          </button>
        </div>
      </div>

      <div className="training-panel">
        <article className="stat-card">
          <span>当前目标</span>
          <strong>{currentTarget}</strong>
          <small>按从小到大点击</small>
        </article>
        <article className="stat-card">
          <span>已用时间</span>
          <strong>{formatDuration(elapsedMs)}</strong>
          <small>{paused ? "已暂停" : "进行中"}</small>
        </article>
        <article className="stat-card">
          <span>当前进度</span>
          <strong>
            {session.completedCount} / {session.board.length}
          </strong>
          <small>完成整盘即结算</small>
        </article>
      </div>

      <BoardGrid
        board={session.board}
        size={session.config.size}
        currentTarget={currentTarget}
        paused={paused}
        onSelect={onSelectValue}
      />
    </section>
  );
}
