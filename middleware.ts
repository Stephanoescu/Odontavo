import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

/**
 * MIDDLEWARE — Supabase Session Guard
 * - Protects /dentist/* and /patient/* routes (redirige a /login si no hay sesión).
 * - Redirige a autenticados fuera de /login y /register (evita acceso redundante).
 * - Refresca el token en cada request para evitar tokens stale.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresca la sesión en cada request (obligatorio en @supabase/ssr)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthed = !!user;

  // Rutas públicas — si ya hay sesión, redirigir al dashboard correcto
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
  if (isAuthPage && isAuthed) {
    const role = user.user_metadata?.role ?? 'dentist';
    return NextResponse.redirect(new URL(role === 'patient' ? '/patient' : '/dentist', request.url));
  }

  // Protect /dentist/* — debe tener sesión activa
  if (pathname.startsWith('/dentist') && !isAuthed) {
    return NextResponse.redirect(new URL('/login?from=dentist', request.url));
  }

  // Protect /patient/* — debe tener sesión activa
  if (pathname.startsWith('/patient') && !isAuthed) {
    return NextResponse.redirect(new URL('/login?from=patient', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/dentist/:path*', '/patient/:path*', '/login', '/register', '/forgot-password'],
};

