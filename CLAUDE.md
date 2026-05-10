# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run tauri dev` — Start the Tauri dev server (runs both Rust backend and Vite frontend)
- `npm run build` — TypeScript compile + Vite production build
- `npm test` — Run all tests via Vitest (`vitest run`)
- `npm run test:watch` — Run tests in watch mode
- `cargo check --manifest-path src-tauri/Cargo.toml` — Check Rust compilation

## Architecture

### Game Rules
Numbers must be clicked in ascending order (1, 2, 3...). Clicking the wrong number is silently ignored — no error feedback, no state change. The game completes when all numbers are clicked in order.

### Screen State Machine (App.tsx)
`Screen` type: `"home" | "mode" | "training" | "result" | "history"`

Flow: `home → mode → training → result → history → home`

The `openScreen()` function wraps `setScreen()` in `startTransition()` for React concurrent mode.

### Data Flow
- `TrainingPage` determines click correctness (compares against `completedCount + 1`) and triggers both visual feedback (CSS class flash) and audio (Web Audio API oscillator) inline, before calling `onSelectValue(value, correct)`.
- `App.handleSelectValue(value, correct)` only calls `selectBoardValue()` when `correct === true`, and advances screen only on `completedCount === board.length`.
- `selectBoardValue()` in `session.ts` uses `getNextTarget()` and `isCorrectSelection()` from `board.ts` for the core game logic.

### Key Types
- `GameSession` — live game state: board, completedCount, elapsedMs, runningSinceMs (null when paused)
- `GameResult` — completed game record: durationMs, averageTapMs, best (boolean for "beat your best")
- `GameConfig` — size only: `{ size: 3 | 4 | 5 }`

### TrainingPage Feedback Pattern
`TrainingPage` owns the feedback state (`{ value, correct } | null`) and a 400ms setTimeout to clear it. The visual flash and audio play are triggered there; the parent only receives the confirmed-correct value.

### Test Setup
- `src/test/setup.ts` — defines `window.localStorage` as an in-memory `MemoryStorage` and mocks `window.AudioContext` for jsdom environment
- Cell buttons have class `cell`; selecting by text content (`screen.getByRole("button", { name: "1" })`) must sort by value first, since board order is shuffled and doesn't match numeric order
- Game completion is detected with `screen.getByRole("heading", { name: "本局结算" })` after the last click

## Project Structure

```
src/
  App.tsx              — Root component, screen state machine, game event handlers
  App.css              — All styles (CSS custom properties, no Tailwind)
  lib/
    game/
      board.ts         — createBoard (shuffle), getNextTarget, isCorrectSelection
      session.ts       — createSession, getElapsedMs, pauseSession, resumeSession,
                         selectBoardValue, createResult
    storage/
      history.ts       — loadHistory, saveResult (localStorage wrapper)
    format.ts         — formatDuration, formatBoardSize
  pages/               — HomePage, ModePage, TrainingPage, ResultPage, HistoryPage
  components/
    BoardGrid.tsx      — Grid of clickable cells; owns no game logic
  types/
    game.ts            — GameConfig, GameSession, GameResult, BoardSize
src-tauri/             — Rust backend (Tauri 2)
```