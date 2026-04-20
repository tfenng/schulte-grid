import { formatBoardSize, formatDuration } from "../lib/format";
import type { GameResult } from "../types/game";

interface HomePageProps {
  bestResult: GameResult | null;
  historyCount: number;
  onStart: () => void;
  onOpenHistory: () => void;
}

export function HomePage({ bestResult, historyCount, onStart, onOpenHistory }: HomePageProps) {
  return (
    <section className="page-shell">
      <p className="eyebrow">Desktop MVP</p>
      <h1>舒尔特方格</h1>
      <p className="page-lead">从 1 开始顺序点击，用最短时间完成一整局。</p>

      <div className="hero-actions">
        <button type="button" className="primary-button" onClick={onStart}>
          开始训练
        </button>
        <button type="button" className="secondary-button" onClick={onOpenHistory}>
          查看历史
        </button>
      </div>

      <div className="stat-grid">
        <article className="stat-card">
          <span>最佳成绩</span>
          <strong>{bestResult ? formatDuration(bestResult.durationMs) : "暂无记录"}</strong>
          <small>{bestResult ? formatBoardSize(bestResult.size) : "完成首局后显示"}</small>
        </article>
        <article className="stat-card">
          <span>历史局数</span>
          <strong>{historyCount}</strong>
          <small>已保存到本地</small>
        </article>
      </div>
    </section>
  );
}
