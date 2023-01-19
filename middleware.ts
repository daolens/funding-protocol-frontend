import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { DEFAULT_CHAIN_ID } from '@components/common/network-detection'

export function middleware(request: NextRequest) {
  const chainId = parseInt(request.nextUrl.pathname.split('/')?.[1])
  if (!chainId)
    return NextResponse.redirect(
      new URL(`/${DEFAULT_CHAIN_ID}` + request.nextUrl.pathname, request.url)
    )
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
}
