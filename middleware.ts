import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  isAuthenticated,
  isPasswordConfigured,
  readClientIp,
  registerAccessLog,
} from "./src/lib/auth"

function isPublicPath(pathname: string) {
  return (
    pathname === "/login" ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isPasswordConfigured()) {
    return NextResponse.next()
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  if (!isAuthenticated(request)) {
    registerAccessLog({
      type: "access_denied",
      ip: readClientIp(request),
      path: pathname,
      detail: "middleware blocked anonymous access",
    })

    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
