"use client"

import { useEffect, useState } from "react"
import { ArrowDownCircle, ArrowUpCircle, BanknoteArrowDown, Landmark, Wallet2, WalletMinimal } from "lucide-react"
import { listarContas } from "../lib/contas"
import { listarReceitas } from "../lib/receitas"
import { SectionTitle, ShellCard, StatCard, money } from "./ui"

type Props = {
  refreshKey?: number
  selectedMonth: string
}

type DashboardResumo = {
  totalReceitasMes: number
  totalDespesasMes: number
  saldoMes: number
  saldoRestante: number
  despesasPagasMes: number
  despesasEmAbertoMes: number
}

export default function DashboardCards({ refreshKey = 0, selectedMonth }: Props) {
  const [resumo, setResumo] = useState<DashboardResumo>({
    totalReceitasMes: 0,
    totalDespesasMes: 0,
    saldoMes: 0,
    saldoRestante: 0,
    despesasPagasMes: 0,
    despesasEmAbertoMes: 0,
  })

  useEffect(() => {
    let active = true

    void Promise.all([listarReceitas(), listarContas()]).then(([receitas, contas]) => {
      if (!active) return

      const receitasMes = receitas
        .filter((receita) => receita.data.slice(0, 7) === selectedMonth)
        .reduce((acc, receita) => acc + receita.valor, 0)

      const despesasMes = contas.filter(
        (conta) =>
          conta.tipo === "despesa" &&
          conta.vencimento?.slice(0, 7) === selectedMonth
      )

      const totalDespesasMes = despesasMes.reduce((acc, conta) => acc + conta.valor, 0)
      const despesasPagasMes = despesasMes
        .filter((conta) => conta.status === "pago")
        .reduce((acc, conta) => acc + conta.valor, 0)
      const despesasEmAbertoMes = despesasMes
        .filter((conta) => conta.status !== "pago")
        .reduce((acc, conta) => acc + conta.valor, 0)

      setResumo({
        totalReceitasMes: receitasMes,
        totalDespesasMes,
        saldoMes: receitasMes - totalDespesasMes,
        saldoRestante: receitasMes - despesasPagasMes,
        despesasPagasMes,
        despesasEmAbertoMes,
      })
    })

    return () => {
      active = false
    }
  }, [refreshKey, selectedMonth])

  return (
    <ShellCard className="p-6 md:p-7">
      <SectionTitle
        eyebrow="Resumo mensal"
        title="Visao financeira do periodo"
        description={`Os cards refletem receitas e despesas de ${selectedMonth}.`}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        <StatCard
          icon={ArrowUpCircle}
          label="Total de receitas"
          value={money(resumo.totalReceitasMes)}
          tone="income"
          helper="Entradas confirmadas no mes"
        />
        <StatCard
          icon={ArrowDownCircle}
          label="Total de despesas"
          value={money(resumo.totalDespesasMes)}
          tone="expense"
          helper="Saidas previstas para o periodo"
        />
        <StatCard
          icon={Landmark}
          label="Saldo do mes"
          value={money(resumo.saldoMes)}
          tone={resumo.saldoMes >= 0 ? "neutral" : "danger"}
          helper="Receitas menos despesas do periodo"
        />
        <StatCard
          icon={WalletMinimal}
          label="Saldo restante"
          value={money(resumo.saldoRestante)}
          tone={resumo.saldoRestante >= 0 ? "income" : "danger"}
          helper="Disponivel apos despesas ja quitadas"
        />
        <StatCard
          icon={Wallet2}
          label="Despesas pagas"
          value={money(resumo.despesasPagasMes)}
          tone="neutral"
          helper="Compromissos liquidados no mes"
        />
        <StatCard
          icon={BanknoteArrowDown}
          label="Despesas em aberto"
          value={money(resumo.despesasEmAbertoMes)}
          tone="warning"
          helper="Valor que ainda exige atencao"
        />
      </div>
    </ShellCard>
  )
}
