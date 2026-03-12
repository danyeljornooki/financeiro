"use client"

import { useEffect, useMemo, useState } from "react"
import { Gem, Goal, Landmark, PiggyBank } from "lucide-react"
import {
  calcularControleDividas,
  calcularMetaFinanceira,
  gerarPlanejamentoFinanceiroAnual,
  listarContas,
  simularEconomiaMensal,
  type Conta,
} from "../lib/contas"
import { PremiumInput, SectionTitle, ShellCard, StatCard, money } from "./ui"

type Props = {
  refreshKey?: number
}

export default function FinanceiroAvancado({ refreshKey = 0 }: Props) {
  const [contas, setContas] = useState<Conta[]>([])
  const [objetivo, setObjetivo] = useState("10000")
  const [valorAtual, setValorAtual] = useState("2500")
  const [aporteMensal, setAporteMensal] = useState("500")
  const [economiaMensal, setEconomiaMensal] = useState("300")

  useEffect(() => {
    let active = true

    void listarContas().then((data) => {
      if (active) {
        setContas(data)
      }
    })

    return () => {
      active = false
    }
  }, [refreshKey])

  const meta = useMemo(
    () =>
      calcularMetaFinanceira(
        Number(objetivo) || 0,
        Number(valorAtual) || 0,
        Number(aporteMensal) || 0
      ),
    [objetivo, valorAtual, aporteMensal]
  )

  const dividas = useMemo(() => calcularControleDividas(contas), [contas])
  const simulacao = useMemo(
    () => simularEconomiaMensal(contas, Number(economiaMensal) || 0),
    [contas, economiaMensal]
  )
  const planejamento = useMemo(() => gerarPlanejamentoFinanceiroAnual(contas), [contas])

  return (
    <ShellCard className="p-6">
      <SectionTitle
        eyebrow="Planejamento"
        title="Camada estrategica"
        description="Metas, dividas, simulacao de economia e planejamento anual em uma visao executiva."
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard
          icon={Goal}
          label="Meta financeira"
          value={money(meta.objetivo)}
          tone="income"
          helper={`${meta.progresso.toFixed(1)}% concluido`}
        />
        <StatCard
          icon={Landmark}
          label="Dividas em aberto"
          value={money(dividas.totalDividas)}
          tone={dividas.totalAtrasado > 0 ? "danger" : "warning"}
          helper={`${dividas.quantidade} registros monitorados`}
        />
        <StatCard
          icon={PiggyBank}
          label="Economia simulada"
          value={money(simulacao.economiaMensal)}
          tone="neutral"
          helper={`${money(simulacao.economiaAnual)} ao ano`}
        />
        <StatCard
          icon={Gem}
          label="Novo saldo mensal"
          value={money(simulacao.novoSaldoMensal)}
          tone={simulacao.novoSaldoMensal >= 0 ? "income" : "danger"}
          helper={
            simulacao.mesesParaReserva === null
              ? "Reserva indefinida"
              : `Reserva em ${simulacao.mesesParaReserva} meses`
          }
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
          <h3 className="text-lg font-semibold text-slate-950">Configuracao da meta</h3>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <PremiumInput type="number" value={objetivo} onChange={(e) => setObjetivo(e.target.value)} placeholder="Objetivo total" />
            <PremiumInput type="number" value={valorAtual} onChange={(e) => setValorAtual(e.target.value)} placeholder="Valor atual" />
            <PremiumInput type="number" value={aporteMensal} onChange={(e) => setAporteMensal(e.target.value)} placeholder="Aporte mensal" />
            <PremiumInput type="number" value={economiaMensal} onChange={(e) => setEconomiaMensal(e.target.value)} placeholder="Economia mensal desejada" />
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-sky-500" style={{ width: `${meta.progresso}%` }} />
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <div>Restante para a meta: {money(meta.restante)}</div>
            <div>
              Tempo estimado: {meta.mesesEstimados === null ? "defina um aporte" : `${meta.mesesEstimados} meses`}
            </div>
            <div>Dividas atrasadas: {money(dividas.totalAtrasado)}</div>
            <div>Dividas pendentes: {money(dividas.totalPendente)}</div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-950">Planejamento anual</h3>
          <div className="mt-4 max-h-[360px] overflow-auto rounded-[20px] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-4 py-3">Mes</th>
                  <th className="px-4 py-3">Receitas</th>
                  <th className="px-4 py-3">Despesas</th>
                  <th className="px-4 py-3">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {planejamento.map((mes) => (
                  <tr key={mes.mes} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-medium text-slate-800">{mes.mes}</td>
                    <td className="px-4 py-3 text-emerald-700">{money(mes.receitas)}</td>
                    <td className="px-4 py-3 text-rose-700">{money(mes.despesas)}</td>
                    <td className="px-4 py-3 font-semibold text-slate-950">{money(mes.saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ShellCard>
  )
}
