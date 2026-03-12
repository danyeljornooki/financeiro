"use client"

import { useEffect, useState } from "react"
import { resumoContas, type ResumoContas } from "../lib/contas"

type Props = {
  refreshKey?: number
}

function money(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export default function DashboardCards({ refreshKey = 0 }: Props) {
  const [resumo, setResumo] = useState<ResumoContas>({
    total: 0,
    pendente: 0,
    pago: 0,
    atrasado: 0,
    quantidade: 0,
  })

  useEffect(() => {
    let active = true

    void resumoContas().then((data) => {
      if (active) {
        setResumo(data)
      }
    })

    return () => {
      active = false
    }
  }, [refreshKey])

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      <div className="rounded-lg border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Total</p>
        <h3 className="text-2xl font-bold">{money(resumo.total)}</h3>
      </div>

      <div className="rounded-lg border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Pendente</p>
        <h3 className="text-2xl font-bold">{money(resumo.pendente)}</h3>
      </div>

      <div className="rounded-lg border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Pago</p>
        <h3 className="text-2xl font-bold">{money(resumo.pago)}</h3>
      </div>

      <div className="rounded-lg border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Atrasado</p>
        <h3 className="text-2xl font-bold">{money(resumo.atrasado)}</h3>
      </div>

      <div className="rounded-lg border p-4 shadow-sm">
        <p className="text-sm text-gray-500">Quantidade</p>
        <h3 className="text-2xl font-bold">{resumo.quantidade}</h3>
      </div>
    </div>
  )
}
