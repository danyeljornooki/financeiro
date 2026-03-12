import { NextResponse } from "next/server"
import { AUTH_COOKIE_NAME, readClientIp, registerAccessLog } from "@/src/lib/auth"

export async function POST(request: Request) {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  })

  registerAccessLog({
    type: "logout",
    ip: readClientIp(request),
    path: "/api/auth/logout",
    detail: "logout",
  })

  return response
}
