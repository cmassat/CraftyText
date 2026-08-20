import type { NextConfig } from 'next'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

const __dirname = dirname(fileURLToPath(import.meta.url))

const config: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: resolve(__dirname, '../..'),
  images: {
    unoptimized: true
  }
}

initOpenNextCloudflareForDev()

export default config
