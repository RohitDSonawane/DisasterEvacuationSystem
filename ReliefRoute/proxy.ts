import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {

    // Note: In a real app, you'd check a secure cookie.
    // For this demo, the Zustand store handles the token in localStorage (client-side).
    // However, we can use a basic cookie check if we set it on login.
    
    // For now, let's assume client-side protection or a cookie.
    // Let's implement a simple redirect if the path starts with /dashboard
    // and a reliefroute_token cookie is NOT present.
    
    const token = request.cookies.get('rr_token');
    const { pathname } = request.nextUrl;

    // 1. If trying to access dashboard without token -> redirect to login
    if (pathname.startsWith('/dashboard') && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. If trying to access login/landing WITH token -> redirect to dashboard
    if ((pathname === '/login' || pathname === '/') && token) {
        // Optional: Redirect to dashboard if already logged in
        // return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
