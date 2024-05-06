import { NextResponse, type NextRequest } from 'next/server';
export { default } from "next-auth/middleware";
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    try {
        if (token && (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/')
        )) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } catch (error) {
        console.log(error);
    };
};

export const config = {
    matcher: [
        '/',
        '/sign-in',
        '/sign-up',
        '/verify/:path*',
        '/dashboard/:path*',
    ]
};