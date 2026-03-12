"use client"

import { CalendarDays, HandCoins, ReceiptText } from "lucide-react"
import { useState } from "react"
import { criarReceita } from "../lib/receitas"
import { PremiumButton, PremiumInput, SectionTitle, ShellCard } from "./ui"

type Props = {
  onSaved?: () => void
}

export default function AddReceita({ onSaved }: Props) {
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [data, setData] = useState("")

  async function salvarReceita() {
    if (!descricao || !valor || !data) return

    const { error } = await criarReceita({
      descricao,
      valor: Number(valor),
      data,
    })

    if (error) return

    setDescricao("")
    setValor("")
    setData("")
    onSaved?.()
  }

  return (
    <ShellCard className="border-slate-200/70 p-5">
      <SectionTitle
        eyebrow="Receita"
        title="Nova entrada"
        description="Registre recebimentos e ganhos do mes com o mesmo padrao visual."
      />

      <div className="mt-6 grid grid-cols-1 gap-4">
        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <ReceiptText className="h-4 w-4 text-emerald-600" />
            Descricao
          </span>
          <PremiumInput
            placeholder="Ex: Receita de consultoria"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <HandCoins className="h-4 w-4 text-emerald-600" />
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
              <CalendarDays className="h-4 w-4 text-emerald-600" />
              Data
            </span>
            <PremiumInput
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </label>
        </div>

        <div className="pt-2">
          <PremiumButton
            type="button"
            onClick={salvarReceita}
            variant="secondary"
            className="w-full md:w-auto"
          >
            Salvar receita
          </PremiumButton>
        </div>
      </div>
    </ShellCard>
  )
}
