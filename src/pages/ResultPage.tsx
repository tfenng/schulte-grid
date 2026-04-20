import { formatBoardSize, formatDuration } from "../lib/format";
import type { GameResult } from "../types/game";

interface ResultPageProps {
  result: GameResult;
  onRetry: () => void;
  onHome: () => void;
  onViewHistory: () => void;
}

export function ResultPage({ result, onRetry, onHome, onViewHistory }: ResultPageProps) {
  return (
    <section className="page-shell">
      <p className="eyebrow">本局完成</p>
      <h2>本局结算</h2>

      <div className="stat-grid">
        <article className="stat-card">
          <span>棋盘规格</span>
          <strong>{formatBoardSize(result.size)}</strong>
          <small>{result.best ? "刷新该尺寸最佳" : "已写入历史"}</small>
        </article>
        <article className="stat-card">
          <span>完成时长</span>
          <strong>{formatDuration(result.durationMs)}</strong>
          <small>本局总耗时</small>
        </article>
        <article className="stat-card">
          <span>平均点击间隔</span>
          <strong>{formatDuration(result.averageTapMs)}</strong>
          <small>总时长 / 总格数</small>
        </article>
      </div>

      <div className="inline-actions">
        <button type="button" className="secondary-button" onClick={onHome}>
          返回首页
        </button>
        <button type="button" className="secondary-button" onClick={onViewHistory}>
          查看历史
        </button>
        <button type="button" className="primary-button" onClick={onRetry}>
          再来一局
        </button>
      </div>
    </section>
  );
}
