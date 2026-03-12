import { NextResponse } from "next/server"
import { ensureAuthorized } from "@/src/lib/api-auth"
import { getSupabaseAdmin } from "@/src/lib/supabase-admin"

function payloadBasico(body: Record<string, unknown>) {
  return {
    descricao: body.descricao,
    categoria: body.categoria,
    valor: body.valor,
    vencimento: body.vencimento,
    status: body.status,
  }
}

export async function GET(request: Request) {
  const unauthorized = ensureAuthorized(request)
  if (unauthorized) return unauthorized

  let supabaseAdmin
  try {
    supabaseAdmin = getSupabaseAdmin()
  } catch {
    return NextResponse.json({ error: "Supabase admin nao configurado" }, { status: 500 })
  }

  const { data, error } = await supabaseAdmin
    .from("contas")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const unauthorized = ensureAuthorized(req)
  if (unauthorized) return unauthorized

  let supabaseAdmin
  try {
    supabaseAdmin = getSupabaseAdmin()
  } catch {
    return NextResponse.json({ error: "Supabase admin nao configurado" }, { status: 500 })
  }

  const body = (await req.json()) as Record<string, unknown>

  const tentativaCompleta = await supabaseAdmin
    .from("contas")
    .insert([body])
    .select()

  if (!tentativaCompleta.error) {
    return NextResponse.json(tentativaCompleta.data)
  }

  const tentativaBasica = await supabaseAdmin
    .from("contas")
    .insert([payloadBasico(body)])
    .select()

  if (tentativaBasica.error) {
    return NextResponse.json({ error: tentativaBasica.error.message }, { status: 500 })
  }

  return NextResponse.json(tentativaBasica.data)
}
