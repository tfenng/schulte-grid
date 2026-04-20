# Repository Guidelines

## Project Structure & Module Organization

This repository now contains a runnable Tauri desktop MVP for Schulte Grid training.

- `src/`: React + TypeScript app shell, pages, game logic, and storage helpers
- `src/components/`: reusable UI such as the number grid
- `src/pages/`: home, mode, training, result, and history screens
- `src/lib/game/`: board generation and session state helpers
- `src/lib/storage/`: local history persistence
- `src/test/`: Vitest tests for engine logic and end-to-end UI flow
- `src-tauri/`: Tauri 2 host, Rust entry point, and bundle config
- root docs such as `spec.md` and `implement-todo.md`: product scope and backlog

## Build, Test, and Development Commands

Use the real project commands, not placeholder scripts:

- `npm install`: install frontend and Tauri CLI dependencies
- `npm run tauri dev`: start the desktop app in development
- `npm test`: run Vitest suites
- `npm run build`: run TypeScript checks and produce the frontend build
- `cargo check --manifest-path src-tauri/Cargo.toml`: verify the Rust host

## Coding Style & Naming Conventions

- Use 2 spaces in frontend files and 4 spaces in Rust files
- Prefer `PascalCase` for React components, `camelCase` for functions and state, and `kebab-case` for Markdown filenames
- Keep game types explicit, for example `GameConfig`, `GameSession`, and `GameResult`
- Avoid `any`; keep the React app and Rust bridge payloads typed

## Testing Guidelines

Vitest + Testing Library are the baseline.

- Put unit and UI tests in `src/test/`
- Name tests after behavior, for example `board.test.ts` and `training-flow.test.tsx`
- Add or update tests before changing gameplay logic, storage behavior, or screen flow

## Commit & Pull Request Guidelines

Use short Conventional Commit messages such as `feat: add training flow` or `docs: update contributor guide`.

PRs should include:

- scope summary
- linked task or issue when available
- screenshots for UI changes
- commands run for verification

## Architecture Notes

The current MVP keeps the desktop host thin. Gameplay, persistence, and screen flow live in `src/`, while `src-tauri/` mainly provides the desktop shell and packaging.
