# Portable Mode

CraftyText stores all user configuration inside the [application data directory](APPLICATION_DATA_DIRECTORY.md) that can be changed with `--user-data-dir` command-line flag.

## Linux and Windows

On Linux and Windows you can also create a directory called `craftytext-user-data` to save all user data inside the directory. Like:

```
craftytext-portable/
 ├── craftytext (Linux) or CraftyText.exe (Windows)
 ├── craftytext-user-data/
 ├── resources/
 ├── THIRD-PARTY-LICENSES.txt
 └── ...
```
