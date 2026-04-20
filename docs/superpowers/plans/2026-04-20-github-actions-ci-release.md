# GitHub Actions CI And Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight CI workflow plus a tag-driven Windows release workflow that creates a GitHub Release with Tauri artifacts.

**Architecture:** Keep CI and Release in separate workflow files. CI validates the existing Node and Rust entry points; Release reuses the same project layout but runs a Windows-only Tauri packaging job with `tauri-apps/tauri-action`.

**Tech Stack:** GitHub Actions, Node.js, Rust, Tauri 2, tauri-action

---

## File Structure

- `.github/workflows/ci.yml`: push / PR validation workflow
- `.github/workflows/release.yml`: tag-driven Windows packaging and GitHub Release workflow
- `src-tauri/Cargo.toml`: package metadata for released artifacts
- `src-tauri/src/main.rs`: update the Rust lib crate reference if the lib name changes

### Task 1: Add CI Workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] Create a two-job CI workflow for `web` and `rust`
- [ ] Trigger on `push` to `main` and `codex/**`, and `pull_request` to `main`
- [ ] Run `npm ci`, `npm test`, `npm run build`, and `cargo check --manifest-path src-tauri/Cargo.toml`

### Task 2: Add Release Workflow

**Files:**
- Create: `.github/workflows/release.yml`

- [ ] Trigger on `push` tags matching `v*`
- [ ] Use `windows-latest`, Node setup, Rust toolchain, and `tauri-apps/tauri-action@v1`
- [ ] Grant `contents: write` and create a non-draft GitHub Release with uploaded artifacts

### Task 3: Fix Release Metadata

**Files:**
- Modify: `src-tauri/Cargo.toml`
- Modify: `src-tauri/src/main.rs`

- [ ] Replace template package metadata with Schulte Grid values
- [ ] Rename the Rust lib target consistently if needed

### Task 4: Verify

**Files:**
- Modify: none

- [ ] Run `npm test`
- [ ] Run `npm run build`
- [ ] Run `cargo check --manifest-path src-tauri/Cargo.toml`
- [ ] Inspect the workflow files and repo status
