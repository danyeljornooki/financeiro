import { NextResponse } from "next/server"
import { ensureAuthorized } from "@/src/lib/api-auth"
import { getSupabaseAdmin } from "@/src/lib/supabase-admin"

type Context = {
  params: Promise<{ id: string }>
}

function payloadBasico(body: Record<string, unknown>) {
  return {
    descricao: body.descricao,
    categoria: body.categoria,
    valor: body.valor,
    vencimento: body.vencimento,
    status: body.status,
  }
}

export async function PUT(req: Request, { params }: Context) {
  const unauthorized = ensureAuthorized(req)
  if (unauthorized) return unauthorized

  let supabaseAdmin
  try {
    supabaseAdmin = getSupabaseAdmin()
  } catch {
    return NextResponse.json({ error: "Supabase admin nao configurado" }, { status: 500 })
  }

  const { id } = await params
  const body = (await req.json()) as Record<string, unknown>

  const tentativaCompleta = await supabaseAdmin
    .from("contas")
    .update(body)
    .eq("id", id)
    .select()

  if (!tentativaCompleta.error) {
    return NextResponse.json(tentativaCompleta.data)
  }

  const tentativaBasica = await supabaseAdmin
    .from("contas")
    .update(payloadBasico(body))
    .eq("id", id)
    .select()

  if (tentativaBasica.error) {
    return NextResponse.json({ error: tentativaBasica.error.message }, { status: 500 })
  }

  return NextResponse.json(tentativaBasica.data)
}

export async function DELETE(_: Request, { params }: Context) {
  const unauthorized = ensureAuthorized(_)
  if (unauthorized) return unauthorized

  let supabaseAdmin
  try {
    supabaseAdmin = getSupabaseAdmin()
  } catch {
    return NextResponse.json({ error: "Supabase admin nao configurado" }, { status: 500 })
  }

  const { id } = await params

  const { error } = await supabaseAdmin
    .from("contas")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
