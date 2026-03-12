import { NextResponse } from "next/server"
import {
  AUTH_COOKIE_NAME,
  authToken,
  checkRateLimit,
  clearFailedAttempts,
  readClientIp,
  registerAccessLog,
  registerFailedAttempt,
  verifyPassword,
} from "@/src/lib/auth"

export async function POST(request: Request) {
  const ip = readClientIp(request)
  const rateLimit = checkRateLimit(ip)

  if (!rateLimit.allowed) {
    registerAccessLog({
      type: "login_failure",
      ip,
      path: "/api/auth/login",
      detail: "rate limit exceeded",
    })

    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente em instantes." },
      { status: 429 }
    )
  }

  const body = (await request.json()) as { password?: string }
  const password = body.password ?? ""

  if (!verifyPassword(password)) {
    const attempts = registerFailedAttempt(ip)

    registerAccessLog({
      type: "login_failure",
      ip,
      path: "/api/auth/login",
      detail: `invalid password, attempt ${attempts}`,
    })

    return NextResponse.json({ error: "Senha invalida" }, { status: 401 })
  }

  clearFailedAttempts(ip)

  const response = NextResponse.json({ ok: true })
  response.cookies.set(AUTH_COOKIE_NAME, authToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  })

  registerAccessLog({
    type: "login_success",
    ip,
    path: "/api/auth/login",
    detail: "successful login",
  })

  return response
}
