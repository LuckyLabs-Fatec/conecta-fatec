import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_COOKIE_KEY = 'conecta-fatec-auth';
const PROTECTED_PATHS = [
  '/admin',
  '/acompanhar-projetos',
  '/configuracoes',
  '/mediador',
  '/perfil',
  '/submeter-proposta',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsAuth = PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (needsAuth && !request.cookies.get(AUTH_COOKIE_KEY)) {
    return NextResponse.redirect(new URL('/autenticacao', request.url));
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
