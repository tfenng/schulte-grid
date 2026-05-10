import { useCallback, useRef, useState } from "react";
import { BoardGrid } from "../components/BoardGrid";
import { formatBoardSize, formatDuration } from "../lib/format";
import type { GameSession } from "../types/game";

interface Feedback {
  value: number;
  correct: boolean;
}

interface TrainingPageProps {
  session: GameSession;
  elapsedMs: number;
  onSelectValue: (value: number) => void;
  onPauseToggle: () => void;
  onExit: () => void;
}

function playCorrectSound(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(523, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(784, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

function playWrongSound(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.12);
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}

export function TrainingPage({
  session,
  elapsedMs,
  onSelectValue,
  onPauseToggle,
  onExit,
}: TrainingPageProps) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Lazy init: created on first click to avoid StrictMode unmount closing it
  const audioCtx = useRef<AudioContext | null>(null);
  const paused = session.runningSinceMs === null;

  const handleCellClick = useCallback(
    (value: number) => {
      if (!audioCtx.current) {
        audioCtx.current = new AudioContext();
      }

      const correct = value === session.completedCount + 1;

      if (correct) {
        playCorrectSound(audioCtx.current);
      } else {
        playWrongSound(audioCtx.current);
      }

      setFeedback({ value, correct });

      if (feedbackTimer.current) {
        clearTimeout(feedbackTimer.current);
      }
      feedbackTimer.current = setTimeout(() => {
        setFeedback(null);
      }, 400);

      if (correct) {
        onSelectValue(value);
      }
    },
    [session.completedCount, onSelectValue],
  );

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
          <strong>{session.completedCount + 1}</strong>
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

      <div
        className="progress-indicator"
        role="progressbar"
        aria-valuenow={session.completedCount}
        aria-valuemin={0}
        aria-valuemax={session.board.length}
      >
        <div className="progress-label">
          <span>进度</span>
          <span>
            {session.completedCount} / {session.board.length}
          </span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${(session.completedCount / session.board.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <BoardGrid
        board={session.board}
        size={session.config.size}
        paused={paused}
        completedCount={session.completedCount}
        feedback={feedback}
        onClick={handleCellClick}
      />
    </section>
  );
}