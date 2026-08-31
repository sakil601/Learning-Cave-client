import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(req) {
  if (!req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = req.cookies.get('lc_session')?.value;
  if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));

  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-change-me');
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
}

export const config = { matcher: ['/admin/:path*'] };
