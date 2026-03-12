import { NextResponse } from "next/server"
import { ensureAuthorized } from "@/src/lib/api-auth"
import { listAccessLogs } from "@/src/lib/auth"

export async function GET(request: Request) {
  const unauthorized = ensureAuthorized(request)
  if (unauthorized) return unauthorized

  return NextResponse.json(listAccessLogs())
}
