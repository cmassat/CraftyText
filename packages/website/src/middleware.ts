import type { NextRequest } from 'next/server'

// No custom production domain is configured for CraftyText yet.
export function middleware(req: NextRequest) {
  void req
  return undefined
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|sitemap\\.xml|robots\\.txt|docs-index\\.json|assets/|docs/).*)'
  ]
}
