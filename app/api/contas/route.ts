import { NextResponse } from "next/server"
import { ensureAuthorized } from "@/src/lib/api-auth"
import { getSupabaseAdmin } from "@/src/lib/supabase-admin"

type ContaPayload = {
  descricao: string
  categoria: string
  valor: number
  vencimento: string | null
  status: "pendente" | "pago" | "atrasado"
  tipo: "receita" | "despesa"
  recorrencia: "unica" | "mensal" | "anual"
  grupo_recorrencia_id: string | null
  parcela_atual: number | null
  parcela_total: number | null
  grupo_parcelamento_id: string | null
  pago_em: string | null
  historico_pagamentos: unknown[]
}

function texto(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function numero(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function inteiroPositivo(value: unknown) {
  const parsed = numero(value)
  return parsed && parsed > 0 ? Math.trunc(parsed) : null
}

function dataIso(value: unknown) {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null
}

function normalizarPayload(body: Record<string, unknown>): ContaPayload | null {
  const descricao = texto(body.descricao)
  const categoria = texto(body.categoria)
  const valor = numero(body.valor)

  if (!descricao || !categoria || valor === null) {
    return null
  }

  return {
    descricao,
    categoria,
    valor,
    vencimento: dataIso(body.vencimento),
    status:
      body.status === "pago" || body.status === "atrasado" || body.status === "pendente"
        ? body.status
        : "pendente",
    tipo: body.tipo === "receita" ? "receita" : "despesa",
    recorrencia:
      body.recorrencia === "mensal" || body.recorrencia === "anual"
        ? body.recorrencia
        : "unica",
    grupo_recorrencia_id: texto(body.grupo_recorrencia_id) || null,
    parcela_atual: inteiroPositivo(body.parcela_atual),
    parcela_total: inteiroPositivo(body.parcela_total),
    grupo_parcelamento_id: texto(body.grupo_parcelamento_id) || null,
    pago_em: typeof body.pago_em === "string" ? body.pago_em : null,
    historico_pagamentos: Array.isArray(body.historico_pagamentos) ? body.historico_pagamentos : [],
  }
}

function payloadBasico(body: ContaPayload) {
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
  const payload = normalizarPayload(body)

  if (!payload) {
    return NextResponse.json(
      { error: "Dados invalidos. Informe descricao, categoria e valor validos." },
      { status: 400 }
    )
  }

  const tentativaCompleta = await supabaseAdmin
    .from("contas")
    .insert([payload])
    .select()

  if (!tentativaCompleta.error) {
    return NextResponse.json(tentativaCompleta.data)
  }

  const tentativaBasica = await supabaseAdmin
    .from("contas")
    .insert([payloadBasico(payload)])
    .select()

  if (tentativaBasica.error) {
    return NextResponse.json({ error: tentativaBasica.error.message }, { status: 500 })
  }

  return NextResponse.json(tentativaBasica.data)
}
