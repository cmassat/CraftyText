/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import path from 'path'
import { fileURLToPath } from 'url'
import * as thirdPartyChecker from './thirdPartyChecker.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const desktopRoot = path.resolve(__dirname, '..', 'packages/desktop')

thirdPartyChecker.validateLicenses(desktopRoot)
