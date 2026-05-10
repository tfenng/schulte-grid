import { useEffect, useRef, useState } from "react";
import "./App.css";
import { createResult, createSession, getElapsedMs, pauseSession, resumeSession, selectBoardValue } from "./lib/game/session";
import { loadHistory, saveResult } from "./lib/storage/history";
import { HistoryPage } from "./pages/HistoryPage";
import { HomePage } from "./pages/HomePage";
import { ModePage } from "./pages/ModePage";
import { ResultPage } from "./pages/ResultPage";
import { TrainingPage } from "./pages/TrainingPage";
import type { BoardSize, GameConfig, GameResult, GameSession } from "./types/game";

type Screen = "home" | "mode" | "training" | "result" | "history";

const defaultConfig: GameConfig = {
  size: 3,
};

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [config, setConfig] = useState<GameConfig>(defaultConfig);
  const [history, setHistory] = useState<GameResult[]>(() => loadHistory());
  const [session, setSession] = useState<GameSession | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // Map of board size -> best result for that size (updated incrementally)
  const bestBySize = useRef<Map<BoardSize, GameResult>>(new Map());
  const [bestResult, setBestResult] = useState<GameResult | null>(() => {
    const initial = loadHistory();
    for (const entry of initial) {
      const existing = bestBySize.current.get(entry.size);
      if (!existing || entry.durationMs < existing.durationMs) {
        bestBySize.current.set(entry.size, entry);
      }
    }
    const all = [...bestBySize.current.values()];
    return all.length ? all.reduce((a, b) => (a.durationMs < b.durationMs ? a : b)) : null;
  });

  useEffect(() => {
    if (session?.runningSinceMs === null) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => {
      window.clearInterval(timer);
    };
  }, [session?.runningSinceMs]);

  const elapsedMs = session ? getElapsedMs(session, now) : 0;

  function openScreen(nextScreen: Screen): void {
    setScreen(nextScreen);
  }

  function handleStartFromMode(): void {
    const startedAt = Date.now();
    setNow(startedAt);
    setResult(null);
    setSession(createSession(config, startedAt));
    openScreen("training");
  }

  function handleRetry(): void {
    handleStartFromMode();
  }

  function handleSelectValue(value: number): void {
    if (!session || session.runningSinceMs === null) {
      return;
    }

    const currentTime = Date.now();
    const nextStep = selectBoardValue(session, value);

    if (!nextStep.advanced) {
      return;
    }

    if (nextStep.completed) {
      const nextResult = createResult(nextStep.session, currentTime, history);
      const nextHistory = saveResult(nextResult, history);
      setHistory(nextHistory);
      if (nextResult.best) {
        bestBySize.current.set(nextResult.size, nextResult);
        setBestResult((prev) =>
          !prev || nextResult.durationMs < prev.durationMs ? nextResult : prev,
        );
      }
      setResult(nextResult);
      setSession(null);
      openScreen("result");
      return;
    }

    setSession(nextStep.session);
  }

  function handlePauseToggle(): void {
    if (!session) {
      return;
    }

    const currentTime = Date.now();
    setNow(currentTime);
    setSession(
      session.runningSinceMs === null
        ? resumeSession(session, currentTime)
        : pauseSession(session, currentTime),
    );
  }

  function renderHome() {
    return (
      <HomePage
        bestResult={bestResult}
        historyCount={history.length}
        onStart={() => openScreen("mode")}
        onOpenHistory={() => openScreen("history")}
      />
    );
  }

  function renderScreen() {
    switch (screen) {
      case "mode":
        return (
          <ModePage
            selectedSize={config.size}
            onSelectSize={(size) => setConfig({ size })}
            onBack={() => openScreen("home")}
            onStart={handleStartFromMode}
          />
        );
      case "training":
        return session ? (
          <TrainingPage
            session={session}
            elapsedMs={elapsedMs}
            onSelectValue={handleSelectValue}
            onPauseToggle={handlePauseToggle}
            onExit={() => {
              setSession(null);
              openScreen("home");
            }}
          />
        ) : (
          renderHome()
        );
      case "result":
        return result ? (
          <ResultPage
            result={result}
            onRetry={handleRetry}
            onHome={() => openScreen("home")}
            onViewHistory={() => openScreen("history")}
          />
        ) : (
          renderHome()
        );
      case "history":
        return <HistoryPage history={history} onBack={() => openScreen("home")} />;
      case "home":
      default:
        return renderHome();
    }
  }

  return (
    <main className="app-shell">
      <div className="app-background" />
      <div className="app-frame">{renderScreen()}</div>
    </main>
  );
}

export default App;
