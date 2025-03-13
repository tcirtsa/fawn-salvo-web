import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth/');

    // 如果没有token且不是认证页面，重定向到登录页
    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // 如果有token且在认证页面，重定向到首页
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 其他情况正常访问
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};