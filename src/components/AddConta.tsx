"use client"

import { CalendarDays, Layers3, ReceiptText, Repeat2, Tag, Wallet } from "lucide-react"
import { useState } from "react"
import { criarConta, type RecorrenciaConta } from "../lib/contas"
import { PremiumButton, PremiumInput, PremiumSelect, SectionTitle, ShellCard } from "./ui"

type Props = {
  onSaved?: () => void
}

export default function AddConta({ onSaved }: Props) {
  const [descricao, setDescricao] = useState("")
  const [categoria, setCategoria] = useState("")
  const [valor, setValor] = useState("")
  const [vencimento, setVencimento] = useState("")
  const [recorrencia, setRecorrencia] = useState<RecorrenciaConta>("unica")
  const [parcelas, setParcelas] = useState("1")

  async function salvarConta() {
    if (!descricao || !categoria || !valor) return

    const { error } = await criarConta({
      descricao,
      categoria,
      valor: Number(valor),
      vencimento: vencimento || null,
      status: "pendente",
      tipo: "despesa",
      recorrencia,
      grupo_recorrencia_id: null,
      parcela_atual: null,
      parcela_total: Number(parcelas) > 1 ? Number(parcelas) : null,
      grupo_parcelamento_id: null,
      pago_em: null,
      historico_pagamentos: [],
    })

    if (error) return

    setDescricao("")
    setCategoria("")
    setValor("")
    setVencimento("")
    setRecorrencia("unica")
    setParcelas("1")
    onSaved?.()
  }

  return (
    <ShellCard className="border-slate-200/70 p-5">
      <SectionTitle
        eyebrow="Despesa"
        title="Nova conta"
        description="Cadastre compromissos com recorrencia, parcelamento e vencimento."
      />

      <div className="mt-6 grid grid-cols-1 gap-4">
        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <ReceiptText className="h-4 w-4 text-sky-600" />
            Descricao
          </span>
          <PremiumInput
            placeholder="Ex: Aluguel do escritorio"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </label>

        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Tag className="h-4 w-4 text-sky-600" />
            Categoria
          </span>
          <PremiumInput
            placeholder="Ex: Operacional"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Wallet className="h-4 w-4 text-sky-600" />
              Valor
            </span>
            <PremiumInput
              type="number"
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </label>

          <label className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <CalendarDays className="h-4 w-4 text-sky-600" />
              Vencimento
            </span>
            <PremiumInput
              type="date"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Repeat2 className="h-4 w-4 text-sky-600" />
              Recorrencia
            </span>
            <PremiumSelect
              value={recorrencia}
              onChange={(e) => setRecorrencia(e.target.value as RecorrenciaConta)}
            >
              <option value="unica">Unica</option>
              <option value="mensal">Recorrente mensal</option>
              <option value="anual">Recorrente anual</option>
            </PremiumSelect>
          </label>

          <label className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Layers3 className="h-4 w-4 text-sky-600" />
              Parcelas
            </span>
            <PremiumInput
              type="number"
              min="1"
              value={parcelas}
              onChange={(e) => setParcelas(e.target.value || "1")}
            />
          </label>
        </div>

        <div className="pt-2">
          <PremiumButton type="button" onClick={salvarConta} className="w-full md:w-auto">
            Salvar despesa
          </PremiumButton>
        </div>
      </div>
    </ShellCard>
  )
}
