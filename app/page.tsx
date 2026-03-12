"use client"

import { useEffect, useState } from "react"
import AddConta from "../src/components/AddConta"
import AddReceita from "../src/components/AddReceita"
import AlertasVencimento from "../src/components/AlertasVencimento"
import AppShell from "../src/components/AppShell"
import ContasTable from "../src/components/ContasTable"
import DashboardCards from "../src/components/DashboardCards"
import DashboardInsights from "../src/components/DashboardInsights"
import FinanceiroAvancado from "../src/components/FinanceiroAvancado"
import ReceitasTable from "../src/components/ReceitasTable"
import { sincronizarAutomacoes } from "../src/lib/contas"
import { SectionTitle, ShellCard } from "../src/components/ui"

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )

  function atualizarLista() {
    setRefreshKey((prev) => prev + 1)
  }

  useEffect(() => {
    let active = true

    async function executarAutomacoes() {
      await sincronizarAutomacoes()

      if (active) {
        setRefreshKey((prev) => prev + 1)
      }
    }

    void executarAutomacoes()

    const interval = window.setInterval(() => {
      void executarAutomacoes()
    }, 60000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <AppShell
      selectedMonth={selectedMonth}
      onSelectedMonthChange={setSelectedMonth}
      onLogout={sair}
    >
      <section id="overview">
        <DashboardCards refreshKey={refreshKey} selectedMonth={selectedMonth} />
      </section>

      <section id="analytics">
        <DashboardInsights refreshKey={refreshKey} selectedMonth={selectedMonth} />
      </section>

      <AlertasVencimento refreshKey={refreshKey} />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <SectionTitle
            eyebrow="Operacao"
            title="Registrar movimento"
            description="Crie novas receitas e despesas com o mesmo acabamento visual do dashboard."
          />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <AddReceita onSaved={atualizarLista} />
            <AddConta onSaved={atualizarLista} />
          </div>
        </div>

        <section id="planejamento">
          <FinanceiroAvancado refreshKey={refreshKey} />
        </section>
      </div>

      <section id="receitas">
        <ShellCard className="p-6">
        <SectionTitle
          eyebrow="Fluxo de caixa"
          title="Receitas do periodo"
          description="Visualize, ajuste e acompanhe entradas financeiras usando o filtro mensal global."
        />
        <div className="mt-6">
          <ReceitasTable refreshKey={refreshKey} selectedMonth={selectedMonth} />
        </div>
        </ShellCard>
      </section>

      <section id="despesas">
        <ShellCard className="p-6">
        <SectionTitle
          eyebrow="Contas"
          title="Despesas e compromissos"
          description="Monitore despesas, status, recorrencias e historico em uma grade refinada."
        />
        <div className="mt-6">
          <ContasTable refreshKey={refreshKey} selectedMonth={selectedMonth} />
        </div>
        </ShellCard>
      </section>
    </AppShell>
  )
}
