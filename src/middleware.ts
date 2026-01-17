import { NextResponse } from 'next/server'; // <-- ESSA LINHA É A QUE FALTA
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pega o token dos cookies
  const token = request.cookies.get('barber.token')?.value;

  // Se o usuário tentar acessar qualquer dashboard sem estar logado
  if (request.nextUrl.pathname.includes('/dashboard') && !token) {
    // Redireciona para a página de login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Deixa a requisição seguir em frente se houver token ou se não for rota protegida
  return NextResponse.next();
}

// Configura para rodar o middleware nas rotas de dashboard de qualquer barbearia
export const config = {
  matcher: ['/:slug/dashboard/:path*'],
};