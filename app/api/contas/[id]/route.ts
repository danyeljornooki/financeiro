import { NextResponse } from "next/server"
import { ensureAuthorized } from "@/src/lib/api-auth"
import { getSupabaseAdmin } from "@/src/lib/supabase-admin"

type Context = {
  params: Promise<{ id: string }>
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
  if (value === null) return null
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : undefined
}

function normalizarPayload(body: Record<string, unknown>) {
  const payload: Record<string, unknown> = {}

  if ("descricao" in body) payload.descricao = texto(body.descricao)
  if ("categoria" in body) payload.categoria = texto(body.categoria)
  if ("valor" in body) {
    const valor = numero(body.valor)
    if (valor !== null) payload.valor = valor
  }
  if ("vencimento" in body) {
    const vencimento = dataIso(body.vencimento)
    if (vencimento !== undefined) payload.vencimento = vencimento
  }
  if (body.status === "pendente" || body.status === "pago" || body.status === "atrasado") {
    payload.status = body.status
  }
  if (body.tipo === "receita" || body.tipo === "despesa") {
    payload.tipo = body.tipo
  }
  if (body.recorrencia === "unica" || body.recorrencia === "mensal" || body.recorrencia === "anual") {
    payload.recorrencia = body.recorrencia
  }
  if ("grupo_recorrencia_id" in body) payload.grupo_recorrencia_id = texto(body.grupo_recorrencia_id) || null
  if ("parcela_atual" in body) payload.parcela_atual = inteiroPositivo(body.parcela_atual)
  if ("parcela_total" in body) payload.parcela_total = inteiroPositivo(body.parcela_total)
  if ("grupo_parcelamento_id" in body) payload.grupo_parcelamento_id = texto(body.grupo_parcelamento_id) || null
  if ("pago_em" in body) payload.pago_em = typeof body.pago_em === "string" ? body.pago_em : null
  if ("historico_pagamentos" in body && Array.isArray(body.historico_pagamentos)) {
    payload.historico_pagamentos = body.historico_pagamentos
  }

  return payload
}

function payloadBasico(body: Record<string, unknown>) {
  const payload: Record<string, unknown> = {}

  if ("descricao" in body) payload.descricao = body.descricao
  if ("categoria" in body) payload.categoria = body.categoria
  if ("valor" in body) payload.valor = body.valor
  if ("vencimento" in body) payload.vencimento = body.vencimento
  if ("status" in body) payload.status = body.status

  return payload
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
  const payload = normalizarPayload(body)

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: "Nenhum campo valido enviado para atualizacao." }, { status: 400 })
  }

  const tentativaCompleta = await supabaseAdmin
    .from("contas")
    .update(payload)
    .eq("id", id)
    .select()

  if (!tentativaCompleta.error) {
    return NextResponse.json(tentativaCompleta.data)
  }

  const tentativaBasica = await supabaseAdmin
    .from("contas")
    .update(payloadBasico(payload))
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
