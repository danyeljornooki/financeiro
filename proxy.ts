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
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  if (!isPasswordConfigured()) {
    registerAccessLog({
      type: "access_denied",
      ip: readClientIp(request),
      path: pathname,
      detail: "APP_PASSWORD not configured",
    })

    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "APP_PASSWORD nao configurado" }, { status: 503 })
    }

    return NextResponse.redirect(new URL("/login?error=config", request.url))
  }

  if (!isAuthenticated(request)) {
    registerAccessLog({
      type: "access_denied",
      ip: readClientIp(request),
      path: pathname,
      detail: "proxy blocked anonymous access",
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
  matcher: ["/((?!login|_next|favicon.ico).*)"],
}
