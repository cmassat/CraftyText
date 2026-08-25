# CraftyText Copilot Instructions

This repository is a pnpm monorepo for CraftyText, a WYSIWYG markdown editor built on Electron + Vue 3.

## High-Level Architecture

CraftyText uses a **Three-Process Electron Model** across its monorepo packages:

*   **Main Process (`packages/desktop/src/main/`)**: Handles IO, file system, native dialogs, and window management. Has full Node.js + Electron API access. Compiled to CommonJS.
*   **Preload (`packages/desktop/src/preload/`)**: The contextBridge between main and renderer. Compiled to CommonJS.
*   **Renderer (`packages/desktop/src/renderer/`)**: Vue 3 + Pinia app. Hosts the UI and editor engine. Compiled to ES Modules (ESM) only. **Fully sandboxed** (`contextIsolation: true`, `nodeIntegration: false`); all Node access must flow through `window.electron.*` or `window.fileUtils.*`.
*   **Editor Engine (`packages/muya/` & `packages/muyajs/`)**: The WYSIWYG engine. We are actively transitioning from the legacy JavaScript implementation (`muyajs`) to the TypeScript rewrite (`muya` / `@muyajs/core`).

## Build, Test, and Lint Commands

All commands should be run from the repository root using `pnpm` (Node >=20.19.0, pnpm >=10).

### Development & Build
*   **Install dependencies:** `pnpm install`
*   **Start development mode:** `pnpm run dev` (Renderer hot-reloads via Vite. Changes to the main process require restarting this command).
*   **Fast build (no packaging):** `pnpm run build:unpack`
*   **Platform builds:** `pnpm run build:win`, `pnpm run build:mac`, `pnpm run build:linux`

### Testing
*   **Unit Tests (Vitest):** `pnpm run test:unit`
    *   *Single unit test:* `pnpm -C packages/desktop exec vitest run test/unit/specs/<filename>.spec.ts`
*   **E2E Tests (Playwright):** `pnpm run test:e2e`
    *   *Single E2E test:* `pnpm -C packages/desktop exec playwright test test/e2e/<filename>.spec.ts`
*   **Engine Tests (Muya):** `pnpm --filter @muyajs/core test`

### Linting & Formatting
*   **Lint:** `pnpm run lint` (Checks ESLint)
*   **Typecheck:** `pnpm run typecheck` (Runs `vue-tsc`)
*   **Check both:** `pnpm run check`
*   **Format:** `pnpm run format` (Broad Prettier formatting; use only when intended)

## Key Conventions

*   **Code Style:** 2-space indentation, no semicolons, single quotes. TypeScript in strict mode. Prefer type-only imports where applicable.
*   **Renderer Constraints:** Never use `require()` in the renderer code (ESM only). Do not attempt direct Node.js API calls from the renderer.
*   **IPC Communication:** Most Inter-Process Communication channels between the main process and renderer should use the `mt::` prefix (e.g., `mt::open-new-tab`). See `packages/desktop/src/shared/types/ipc.ts` for the contract.
*   **File Naming:** Existing desktop test files use `kebab-case.spec.ts`. Vue component names should be descriptive.
*   **Commit Messages:** Use Conventional Commits with scopes, e.g., `fix(desktop): ...` or `docs: ...`. Keep subjects concise and reference issue/PR numbers when relevant.
