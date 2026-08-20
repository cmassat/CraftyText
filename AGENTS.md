# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm monorepo for MarkText. The Electron desktop app lives in `packages/desktop`, with process-specific code under `src/main`, `src/preload`, and `src/renderer/src`. Shared desktop types and utilities are in `src/shared` and `src/common`. Desktop assets are in `packages/desktop/src/renderer/src/assets`, while packaged static files such as locales are in `packages/desktop/static`.

The editor engine packages are split between `packages/muya` (TypeScript core) and `packages/muyajs` (legacy JavaScript package). The documentation/marketing site is in `packages/website`. Repository-level automation lives in `scripts`, and build outputs such as `dist` and `out` should not be edited directly.

## Build, Test, and Development Commands

Use Node `>=20.19.0` and pnpm `>=10`.

- `pnpm install`: install workspace dependencies and run postinstall setup.
- `pnpm dev`: start the desktop app with `electron-vite dev`.
- `pnpm start`: preview the built desktop app.
- `pnpm build`: build the desktop app.
- `pnpm build:linux`, `pnpm build:mac`, `pnpm build:win`: create platform packages.
- `pnpm lint`: run the root ESLint config.
- `pnpm typecheck`: run `vue-tsc` for the desktop package.
- `pnpm check`: run lint and typecheck together.

For package-specific work, prefer filters, for example `pnpm --filter @muyajs/core test` or `pnpm --filter marktext-website lint`.

## Coding Style & Naming Conventions

Desktop code uses TypeScript, Vue, and standard-style formatting: 2-space indentation, no semicolons, and no space before function parentheses. Prefer type-only imports where applicable. Vue component names should be descriptive, but the ESLint config does not require multi-word names. Existing desktop test files use kebab-case names ending in `.spec.ts`.

Run `pnpm lint` before submitting changes. Use `pnpm format` only when broad Prettier formatting is intended.

## Testing Guidelines

Desktop unit tests use Vitest in `packages/desktop/test/unit`; run them with `pnpm test:unit`. Desktop end-to-end tests use Playwright in `packages/desktop/test/e2e`; run them with `pnpm test:e2e`. `pnpm test` runs the desktop Vitest suite.

For editor-core changes in `packages/muya`, run `pnpm --filter @muyajs/core test`; CommonMark/GFM conformance tests are under `packages/muya/test/spec`.

## Commit & Pull Request Guidelines

Recent history uses concise imperative commits, often with Conventional Commit scopes such as `fix(desktop): ...` or `docs: ...`. Keep subjects specific and include issue or PR references when relevant, for example `fix(desktop): preserve text direction in PDF export (#4874)`.

Pull requests should describe the user-visible change, list tests run, link related issues, and include screenshots or recordings for UI changes.
