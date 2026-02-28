import { withAuth } from 'next-auth/middleware'

const privatePaths = ['/', '/formulary', '/preview-doc']

export default withAuth(
  function middleware() {
    // callback quando autorizado; não precisa redirecionar
  },
  {
    callbacks: {
      authorized: ({ token, pathname }) => {
        const isPrivate = privatePaths.some((p) => pathname === p || (p !== '/' && pathname.startsWith(p)))
        if (isPrivate) return !!token
        return true
      },
    },
    pages: {
      signIn: '/auth',
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - auth (login)
     * - api/auth (NextAuth)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    '/((?!auth|api/auth|_next/static|_next/image|favicon.ico|upload|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
