import path from 'path'
import { app } from 'electron'
import os from 'os'
import { isDirectory } from 'common/filesystem'
import parseArgs, { type ParsedArgs } from './parser'
import { getPath } from '../utils'

const write = (s: string): boolean => process.stdout.write(s)
const writeLine = (s: string): boolean => write(s + '\n')

const cli = (): ParsedArgs => {
  let argv = process.argv.slice(1)
  if (process.env.NODE_ENV === 'development') {
    // Don't pass electron development arguments to CraftyText and change user data path.
    argv = ['--user-data-dir', path.join(getPath('appData'), 'craftytext-dev')]
  } else {
    // Filter out default runner/app/build directories (like ".", "out", and project root)
    // so they aren't mistaken as folders/files to open, but preserve actual user-specified paths.
    argv = argv.filter((arg) => {
      if (arg.startsWith('--')) return true
      try {
        const resolved = path.resolve(arg)
        const appPath = path.resolve(app.getAppPath())
        const parentPath = path.resolve(appPath, '..')
        const grandParentPath = path.resolve(parentPath, '..')
        const outPath = path.join(appPath, 'out')

        if (
          resolved === appPath ||
          resolved === parentPath ||
          resolved === grandParentPath ||
          resolved === outPath ||
          arg === '.' ||
          arg === 'out' ||
          arg === 'out/main/index.js'
        ) {
          return false
        }
      } catch {
        // Fall back to keeping the argument if resolve fails
      }
      return true
    })
  }

  const args = parseArgs(argv, true)
  if (args['--help']) {
    write(`Usage: craftytext [commands] [path ...]

  Available commands:

        --debug                   Enable debug mode
        --safe                    Disable plugins and other user configuration
    -n, --new-window              Open a new window on second-instance
        --user-data-dir           Change the user data directory
        --disable-gpu             Disable GPU hardware acceleration
        --disable-spellcheck      Disable built-in spellchecker
    -v, --verbose                 Be verbose
        --version                 Print version information
    -h, --help                    Print this help message
`)
    process.exit(0)
  }

  if (args['--version']) {
    writeLine(`CraftyText: ${MARKTEXT_VERSION_STRING}`)
    writeLine(`Node.js: ${process.versions.node}`)
    writeLine(`Electron: ${process.versions.electron}`)
    writeLine(`Chromium: ${process.versions.chrome}`)
    writeLine(`OS: ${os.type()} ${os.arch()} ${os.release()}`)
    process.exit(0)
  }

  // Check for portable mode and ensure the user data path is absolute. We assume
  // that the path is writable if not this lead to an application crash.
  if (!args['--user-data-dir']) {
    const portablePath = path.join(app.getAppPath(), '..', '..', 'craftytext-user-data')
    if (isDirectory(portablePath)) {
      args['--user-data-dir'] = portablePath
    }
  } else {
    args['--user-data-dir'] = path.resolve(args['--user-data-dir'])
  }

  return args
}

export default cli
