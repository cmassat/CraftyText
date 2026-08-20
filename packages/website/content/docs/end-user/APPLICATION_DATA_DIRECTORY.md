# Application Data Directory

The per-user application data directory is located in the following directory:

- `%APPDATA%\craftytext` on Windows
- `$XDG_CONFIG_HOME/craftytext` or `~/.config/craftytext` on Linux
- `~/Library/Application Support/craftytext` on macOS

When [portable mode](PORTABLE.md) is enabled, the directory location is either the `--user-data-dir` parameter or `craftytext-user-data` directory.
