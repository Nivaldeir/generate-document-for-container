import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  console.log(token)
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth")

  // Se não estiver logado e tentar acessar rota protegida
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth", req.url))
  }

  // Se estiver logado e tentar acessar /auth
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}