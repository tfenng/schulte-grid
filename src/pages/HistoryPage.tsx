import { formatBoardSize, formatDuration, formatTimestamp } from "../lib/format";
import type { GameResult } from "../types/game";

interface HistoryPageProps {
  history: GameResult[];
  onBack: () => void;
}

export function HistoryPage({ history, onBack }: HistoryPageProps) {
  return (
    <section className="page-shell page-shell-wide">
      <div className="training-header">
        <div>
          <p className="eyebrow">训练档案</p>
          <h2>历史记录</h2>
        </div>
        <button type="button" className="secondary-button" onClick={onBack}>
          返回首页
        </button>
      </div>

      <p className="page-lead">共 {history.length} 局</p>

      {history.length === 0 ? (
        <div className="empty-state">还没有训练记录，先完成第一局。</div>
      ) : (
        <div className="history-list">
          {history.map((entry) => (
            <article key={entry.id} className="history-card">
              <div>
                <strong>{formatBoardSize(entry.size)}</strong>
                <span>{formatTimestamp(entry.completedAt)}</span>
              </div>
              <div>
                <strong>{formatDuration(entry.durationMs)}</strong>
                <span>平均 {formatDuration(entry.averageTapMs)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
