import { NextResponse } from "next/server"
import { ensureAuthorized } from "@/src/lib/api-auth"
import { supabaseAdmin } from "@/src/lib/supabase-admin"

type Context = {
  params: Promise<{ id: string }>
}

export async function PUT(request: Request, { params }: Context) {
  const unauthorized = ensureAuthorized(request)
  if (unauthorized) return unauthorized

  const { id } = await params
  const body = (await request.json()) as Record<string, unknown>

  const { data, error } = await supabaseAdmin
    .from("receitas")
    .update(body)
    .eq("id", id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: Context) {
  const unauthorized = ensureAuthorized(request)
  if (unauthorized) return unauthorized

  const { id } = await params

  const { error } = await supabaseAdmin
    .from("receitas")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
