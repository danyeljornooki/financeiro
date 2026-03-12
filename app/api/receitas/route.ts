import { NextResponse } from "next/server"
import { ensureAuthorized } from "@/src/lib/api-auth"
import { supabaseAdmin } from "@/src/lib/supabase-admin"

export async function GET(request: Request) {
  const unauthorized = ensureAuthorized(request)
  if (unauthorized) return unauthorized

  const { data, error } = await supabaseAdmin
    .from("receitas")
    .select("*")
    .order("data", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const unauthorized = ensureAuthorized(request)
  if (unauthorized) return unauthorized

  const body = (await request.json()) as Record<string, unknown>

  const { data, error } = await supabaseAdmin
    .from("receitas")
    .insert([body])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
