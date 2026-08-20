# Installation

CraftyText is a free, open-source Markdown editor for **Linux**, **macOS** and **Windows**. Pre-built binaries are published with every release on [GitHub releases](https://github.com/cmassat/craftytext/releases/latest). Pick the one that matches your platform.

## Windows

| Artifact | When to choose |
| --- | --- |
| `craftytext-win-x64-<version>-setup.exe` | Recommended. NSIS installer; per-user install, lets you pick the install directory, creates Start Menu and Desktop shortcuts. |
| `craftytext-win-x64-<version>.zip` | Portable zip. Extract anywhere and run `CraftyText.exe`. See [Portable mode](PORTABLE.md) for details on keeping your data alongside the app. |

After installing, CraftyText registers itself as a handler for `.md`, `.markdown`, `.mmd`, `.mdown`, `.mdtxt` and `.mdtext` files.

## macOS

| Artifact | When to choose |
| --- | --- |
| `craftytext-mac-arm64-<version>.dmg` | Apple Silicon (M1 / M2 / M3 / M4). |
| `craftytext-mac-x64-<version>.dmg` | Intel Macs. |
| `craftytext-mac-<arch>-<version>.zip` | Plain zip alternative to the DMG. |

Open the DMG and drag CraftyText into your **Applications** folder. Builds are not currently notarized, so the first launch may prompt the system Gatekeeper — right-click the app and choose **Open** to accept it once.

Homebrew Cask distribution has not been set up for CraftyText yet.

## Linux

CraftyText is shipped in five Linux formats. Most users want the AppImage.

| Artifact | When to choose |
| --- | --- |
| `craftytext-linux-<version>.AppImage` | Recommended. Runs on most distros without root. `chmod +x` and double-click (or run directly). |
| `craftytext-linux-<version>.deb` | Debian, Ubuntu, Linux Mint, Pop!_OS, … (`sudo apt install ./craftytext-linux-<version>.deb`). |
| `craftytext-linux-<version>.rpm` | Fedora, RHEL, openSUSE, … (`sudo rpm -i craftytext-linux-<version>.rpm`). |
| `craftytext-linux-<version>.snap` | Ubuntu / any snap-enabled distro (`sudo snap install craftytext-linux-<version>.snap --dangerous --classic`). |
| `craftytext-linux-<version>.tar.gz` | Portable tarball. Extract and run the included `craftytext` binary. |

Arch Linux users can install CraftyText from the AUR (`craftytext-bin`).

> [!NOTE]
> See [Linux notes](LINUX.md) for distro-specific tips (sandbox flags, font configuration, file-association quirks).

## Verify the download

Every release contains a `latest-<platform>.yml` file with SHA-512 hashes. To verify:

```sh
# Example on macOS / Linux
shasum -a 512 craftytext-linux-<version>.AppImage
```

Compare the value to the entry in `latest-linux.yml` on the release page.

## Build from source

If you'd rather build from source — for example to track `develop`, to run on an architecture we don't publish a binary for, or to contribute — see the [Build instructions](../dev/BUILD.md) in the developer docs. A minimal recap:

```sh
git clone https://github.com/cmassat/craftytext.git
cd craftytext
pnpm install
pnpm run build
```

Output installers land in the repository's `dist/` folder.

## Updating

CraftyText checks for updates on launch (this can be disabled under **Preferences → General → Updates**). When an update is published, the app downloads it in the background and installs on next restart.

Portable installs and the AppImage do not auto-update — re-download the latest artifact when you want to upgrade.

## Uninstall

| Platform | How |
| --- | --- |
| Windows | **Settings → Apps**, or run the bundled `Uninstall CraftyText.exe`. |
| macOS | Drag **CraftyText.app** to the Trash. Optionally also remove `~/Library/Application Support/craftytext`. |
| Linux (.deb) | `sudo apt remove craftytext` |
| Linux (.rpm) | `sudo rpm -e craftytext` |
| Linux (snap) | `sudo snap remove craftytext` |
| Linux (AppImage / tar.gz) | Delete the file you extracted. |

To wipe CraftyText's user data as well, remove its [application data directory](APPLICATION_DATA_DIRECTORY.md).
