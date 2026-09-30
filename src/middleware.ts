import { NextResponse, type NextRequest } from 'next/server';
import { adminConfigured, isAuthorizedAdmin } from '@/lib/auth';

/** HTTP Basic Auth in front of /admin. Admin is hidden entirely (404) until ADMIN_PASSWORD is set. */
export function middleware(req: NextRequest) {
  if (!adminConfigured()) return new NextResponse('Not found', { status: 404 });
  if (isAuthorizedAdmin(req.headers.get('authorization'))) return NextResponse.next();
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Flowmanic admin", charset="UTF-8"', 'Cache-Control': 'no-store' },
  });
}

export const config = { matcher: ['/admin/:path*'] };
