import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('rr_token');
    const { pathname } = request.nextUrl;

    // 1. If trying to access dashboard without token -> redirect to login
    if (pathname.startsWith('/dashboard') && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. If trying to access login/landing WITH token -> redirect to dashboard
    if ((pathname === '/login' || pathname === '/') && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
