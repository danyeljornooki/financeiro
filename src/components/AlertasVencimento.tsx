"use client"

import { BellRing } from "lucide-react"
import { useEffect, useState } from "react"
import { listarAlertasVencimento, type AlertaVencimento } from "../lib/contas"
import { SectionTitle, ShellCard, StatusBadge, money } from "./ui"

type Props = {
  refreshKey?: number
}

function textoDias(diasRestantes: number) {
  if (diasRestantes === 0) return "vence hoje"
  if (diasRestantes === 1) return "vence amanha"
  return `vence em ${diasRestantes} dias`
}

export default function AlertasVencimento({ refreshKey = 0 }: Props) {
  const [alertas, setAlertas] = useState<AlertaVencimento[]>([])

  useEffect(() => {
    let active = true

    void listarAlertasVencimento().then((data) => {
      if (active) {
        setAlertas(data)
      }
    })

    return () => {
      active = false
    }
  }, [refreshKey])

  if (alertas.length === 0) {
    return null
  }

  return (
    <ShellCard className="overflow-hidden border-amber-200/70 bg-[linear-gradient(135deg,rgba(255,251,235,0.95),rgba(255,255,255,0.95))] p-6">
      <SectionTitle
        eyebrow="Alertas"
        title="Vencimentos proximos"
        description="Monitoramento automatico para evitar atrasos e manter o fluxo organizado."
      />

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {alertas.map((alerta) => (
          <div
            key={alerta.id}
            className="rounded-[24px] border border-amber-200/70 bg-white/90 p-5 shadow-[0_16px_40px_-28px_rgba(217,119,6,0.45)]"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <BellRing className="h-5 w-5" />
              </div>
              <StatusBadge status={alerta.tipo} />
            </div>
            <div className="text-lg font-semibold tracking-[-0.04em] text-slate-950">{alerta.descricao}</div>
            <div className="mt-1 text-sm text-slate-500">
              {textoDias(alerta.diasRestantes)} • {alerta.vencimento}
            </div>
            <div className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-amber-700">
              {money(alerta.valor)}
            </div>
          </div>
        ))}
      </div>
    </ShellCard>
  )
}
