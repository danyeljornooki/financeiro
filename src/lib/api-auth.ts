import "server-only"

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isAuthenticated, readClientIp, registerAccessLog } from "./auth"

export function ensureAuthorized(request: NextRequest | Request) {
  if (isAuthenticated(request)) {
    registerAccessLog({
      type: "access_granted",
      ip: readClientIp(request),
      path: new URL(request.url).pathname,
      detail: "authorized request",
    })

    return null
  }

  registerAccessLog({
    type: "access_denied",
    ip: readClientIp(request),
    path: new URL(request.url).pathname,
    detail: "missing or invalid auth cookie",
  })

  return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
}
