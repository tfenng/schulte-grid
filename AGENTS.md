# Repository Guidelines

## Project Structure & Module Organization

This repository is currently planning-first. The root documents are the source of truth:

- `spec.md`: product scope and feature definition for the Schulte Grid training app
- `implement-todo.md`: phased implementation checklist and MVP milestones
- `tech-stack.md`: desktop stack notes; reconcile it with the Schulte Grid scope before scaffolding

When code is added, keep the structure aligned with the current plan:

- `src/`: React + TypeScript UI
- `src/components/`, `src/pages/`, `src/stores/`, `src/lib/`: UI, screens, state, and shared utilities
- `src-tauri/`: Tauri 2 / Rust host code
- `tests/`: unit, component, and integration coverage

## Build, Test, and Development Commands

No runnable app or package manifest is committed yet, so contributors should not invent local scripts ad hoc. The documented target workflow is:

- `.\build.bat dev`: start the Tauri desktop app in development
- `.\build.bat check`: run frontend type/build checks plus Rust validation
- `.\build.bat release`: create the Windows release bundle

If you add the first implementation, make these commands real and document any deviations in the same PR.

## Coding Style & Naming Conventions

Use `TypeScript 5`, `React 18`, `Tauri 2`, and `Rust 2021` as described in `implement-todo.md`.

- Use 2 spaces in frontend files and 4 spaces in Rust files
- Prefer `PascalCase` for React components, `camelCase` for functions/variables, and `kebab-case` for document filenames
- Keep game domain types explicit, for example `GameConfig`, `GameSession`, and `GameResult`
- Enable strict typing; avoid `any` and untyped bridge payloads between `src/` and `src-tauri/`

## Testing Guidelines

Match the TODO phases with tests:

- unit tests for board generation, rule evaluation, scoring, and aggregation
- component tests for board interaction, pause/resume, and result rendering
- integration tests for the full home -> mode -> session -> result flow

Name tests after behavior, for example `game-engine.test.ts` or `training-session.integration.test.ts`. Do not merge gameplay logic without automated coverage for the changed rule path.

## Commit & Pull Request Guidelines

Git history is not available in this workspace, so no existing commit convention can be inferred. Use concise Conventional Commit style, such as `feat: add 5x5 board generator` or `docs: clarify Tauri setup`.

PRs should include:

- a short summary of user-visible or architecture-impacting changes
- linked issue or task reference when available
- screenshots or short recordings for UI changes
- notes on tests run and any follow-up gaps

## Architecture & Scope Notes

Treat `spec.md` and `implement-todo.md` as the authoritative product documents. Before coding, resolve the mismatch in `tech-stack.md` so the desktop architecture describes the Schulte Grid app rather than an unrelated audio player.
