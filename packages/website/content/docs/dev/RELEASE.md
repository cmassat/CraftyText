# Releasing CraftyText

The release pipeline is triggered by pushing a `v*` tag. The `Release CraftyText` workflow (`.github/workflows/release.yml`) then runs **validate → build (5-platform matrix) → publish** and creates a GitHub Release with installers and `SHA256SUMS.txt`.

The flow below covers both release candidates and stable releases — same steps, only the version string differs.

## Prerequisites

- Push access to `cmassat/craftytext`
- `gh` CLI authenticated (`gh auth status`)
- A clean checkout of the latest `develop`

## 1. Cut a release branch (first RC only)

```bash
git checkout develop
git pull --ff-only
git checkout -b release/vX.Y.0     # e.g. release/v0.19.0
```

Reuse the same branch for every RC of that minor version (`rc.1`, `rc.2`, …) **and** the eventual stable tag. For follow-ups, just `git checkout release/vX.Y.0` and skip to step 2.

## 2. Bump the version

Edit the `version` field in **both** manifests, keeping them identical:

- `package.json` (workspace root)
- `packages/desktop/package.json`

electron-builder runs with `packages/desktop` as its working directory, so the desktop manifest is the one that supplies `${version}` to every `artifactName` in `electron-builder.yml`. The root manifest keeps the workspace consistent and is what the release workflow hashes for its Electron binary cache key.

| Stage             | Version string                      |
| ----------------- | ----------------------------------- |
| Beta              | `0.20.0-beta.1`, `0.20.0-beta.2`, … |
| Release candidate | `0.20.0-rc.1`, `0.20.0-rc.2`, …     |
| Stable            | `0.20.0`                            |

Any pre-release suffix works — the workflow marks a release as a pre-release whenever the tag contains a `-`, so `beta` and `rc` behave identically. Pick one per release series and stay consistent.

## 3. Commit and push the branch

```bash
git add package.json packages/desktop/package.json
git commit -m "chore(release): vX.Y.Z[-beta.N|-rc.N]"
git push -u origin release/vX.Y.0
```

## 4. Tag and push

```bash
git tag -a vX.Y.Z-beta.N -m "vX.Y.Z-beta.N"
git push origin vX.Y.Z-beta.N
```

A `-` in the tag (e.g. `v0.20.0-beta.1`) tells the workflow to mark the GitHub Release as **pre-release** automatically. Plain `vX.Y.Z` tags publish as stable releases.

## 5. Open a tracking PR (RC only)

Open a **draft** PR from `release/vX.Y.0` → `develop` for visibility. Do **not** merge it until the matching stable tag is pushed — merging an RC commit would freeze `develop` at the RC version.

```bash
gh pr create --draft --base develop --head release/vX.Y.0 \
  --title "chore(release): vX.Y.0 release branch (DO NOT MERGE until stable)" \
  --body "Tracking branch for vX.Y.0. Merge after the stable tag is published."
```

## 6. Monitor the workflow

```bash
gh run list --workflow=release.yml --limit 3
gh run watch <run-id> --exit-status
```

Approximate timing: validate ~30 s · build matrix ~15–30 min (5 platforms in parallel) · publish ~1 min.

## 7. Verify the published release

```bash
gh release view vX.Y.Z-rc.N
```

Confirm:

- `Pre-release` badge on the release page (RC only)
- **24 assets**:
  - **Linux** (5): `AppImage`, `deb`, `rpm`, `snap`, `tar.gz`
  - **macOS arm64** (4): `dmg`, `dmg.blockmap`, `zip`, `zip.blockmap`
  - **macOS x64** (4): `dmg`, `dmg.blockmap`, `zip`, `zip.blockmap`
  - **Windows x64** (3): `setup.exe`, `setup.exe.blockmap`, `zip`
  - **Windows arm64** (3): `setup.exe`, `setup.exe.blockmap`, `zip`
  - **Auto-updater metadata** (4): `latest.yml`, `latest-mac.yml`, `latest-linux.yml`, `builder-debug.yml`
  - **Checksums** (1): `SHA256SUMS.txt`
- Auto-generated release notes list the PRs merged since the previous tag

## 8. Post-stable cleanup (after stable `vX.Y.0` ships)

1. Mark the tracking PR from step 5 ready for review and merge into `develop`
2. Open a follow-up PR bumping `develop`'s `package.json` to the next dev version (e.g. `0.20.0-dev`)

---

For hotfixes off a previously-released tag, see [RELEASE_HOTFIX.md](RELEASE_HOTFIX.md). Once the hotfix branch is ready, steps 2–7 above apply.
