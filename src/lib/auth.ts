import "server-only"

import type { NextRequest } from "next/server"

export const AUTH_COOKIE_NAME = "financeiro_auth"
const LOGIN_WINDOW_MS = 60_000
const MAX_ATTEMPTS = 5

type AttemptEntry = {
  count: number
  firstAttemptAt: number
}

export type AccessLogEntry = {
  id: string
  type: "login_success" | "login_failure" | "access_granted" | "access_denied" | "logout"
  ip: string
  path: string
  at: string
  detail: string
}

const attemptsStore = globalThis as typeof globalThis & {
  __financeiroAttempts?: Map<string, AttemptEntry>
  __financeiroLogs?: AccessLogEntry[]
}

const attempts = attemptsStore.__financeiroAttempts ?? new Map<string, AttemptEntry>()
const logs = attemptsStore.__financeiroLogs ?? []

attemptsStore.__financeiroAttempts = attempts
attemptsStore.__financeiroLogs = logs

function envPassword() {
  return process.env.APP_PASSWORD ?? ""
}

function authSecret() {
  return process.env.APP_AUTH_SECRET ?? envPassword()
}

export function authToken() {
  return `${authSecret()}::${envPassword()}`
}

export function isPasswordConfigured() {
  return envPassword().length > 0
}

export function verifyPassword(password: string) {
  return isPasswordConfigured() && password === envPassword()
}

export function readClientIp(request: NextRequest | Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown"
  }

  return request.headers.get("x-real-ip") || "unknown"
}

export function isAuthenticated(request: NextRequest | Request) {
  const cookieHeader =
    "cookies" in request
      ? request.cookies.get(AUTH_COOKIE_NAME)?.value
      : request.headers.get("cookie") || ""

  if (typeof cookieHeader === "string" && !("cookies" in request)) {
    const match = cookieHeader
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${AUTH_COOKIE_NAME}=`))

    return match?.split("=")[1] === authToken()
  }

  return cookieHeader === authToken()
}

export function registerAccessLog(entry: Omit<AccessLogEntry, "id" | "at">) {
  logs.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    at: new Date().toISOString(),
    ...entry,
  })

  if (logs.length > 200) {
    logs.length = 200
  }
}

export function listAccessLogs() {
  return [...logs]
}

export function checkRateLimit(ip: string) {
  const now = Date.now()
  const current = attempts.get(ip)

  if (!current || now - current.firstAttemptAt > LOGIN_WINDOW_MS) {
    attempts.set(ip, { count: 0, firstAttemptAt: now })
    return { allowed: true, remaining: MAX_ATTEMPTS }
  }

  if (current.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: LOGIN_WINDOW_MS - (now - current.firstAttemptAt),
    }
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - current.count }
}

export function registerFailedAttempt(ip: string) {
  const now = Date.now()
  const current = attempts.get(ip)

  if (!current || now - current.firstAttemptAt > LOGIN_WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttemptAt: now })
    return 1
  }

  current.count += 1
  attempts.set(ip, current)
  return current.count
}

export function clearFailedAttempts(ip: string) {
  attempts.delete(ip)
}
