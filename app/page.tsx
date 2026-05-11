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
import SecurityPanel from "../src/components/SecurityPanel"
import { sincronizarAutomacoes } from "../src/lib/contas"
import { SectionTitle, ShellCard } from "../src/components/ui"

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [currentSection, setCurrentSection] = useState("overview")
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7))

  const atualizarLista = () => setRefreshKey((prev) => prev + 1)

  useEffect(() => {
    let active = true
    let interval: number | undefined

    const executarAutomacoes = async () => {
      await sincronizarAutomacoes()
      if (active) atualizarLista()
    }

    void executarAutomacoes()
    interval = window.setInterval(() => {
      void executarAutomacoes()
    }, 60000)

    return () => {
      active = false
      if (interval) window.clearInterval(interval)
    }
  }, [])

  const sair = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <AppShell
      selectedMonth={selectedMonth}
      onSelectedMonthChange={setSelectedMonth}
      onLogout={sair}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
    >
      {currentSection === "overview" && (
        <div className="space-y-6">
          <DashboardCards refreshKey={refreshKey} selectedMonth={selectedMonth} />
          <AlertasVencimento refreshKey={refreshKey} />
          <ShellCard className="p-6">
            <SectionTitle
              eyebrow="Operação"
              title="Entrada e saída rápida"
              description="Registre receitas e despesas rapidamente sem perder o foco."
            />
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <AddReceita onSaved={atualizarLista} />
              <AddConta onSaved={atualizarLista} />
            </div>
          </ShellCard>
        </div>
      )}

      {currentSection === "receitas" && (
        <section className="space-y-6">
          <ShellCard className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <SectionTitle
                eyebrow="Fluxo de caixa"
                title="Receitas do período"
                description="Acompanhe as entradas e ajuste detalhes com um filtro mensal global."
              />
              <AddReceita onSaved={atualizarLista} />
            </div>
            <div className="mt-6">
              <ReceitasTable refreshKey={refreshKey} selectedMonth={selectedMonth} />
            </div>
          </ShellCard>
        </section>
      )}

      {currentSection === "despesas" && (
        <section className="space-y-6">
          <ShellCard className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <SectionTitle
                eyebrow="Contas"
                title="Despesas e compromissos"
                description="Veja status, vencimentos e histórico em uma visão compacta."
              />
              <AddConta onSaved={atualizarLista} />
            </div>
            <div className="mt-6">
              <ContasTable refreshKey={refreshKey} selectedMonth={selectedMonth} />
            </div>
          </ShellCard>
          <AlertasVencimento refreshKey={refreshKey} />
        </section>
      )}

      {currentSection === "analytics" && (
        <section className="space-y-6">
          <DashboardInsights refreshKey={refreshKey} selectedMonth={selectedMonth} />
          <FinanceiroAvancado refreshKey={refreshKey} />
        </section>
      )}

      {currentSection === "security" && (
        <section>
          <SecurityPanel refreshKey={refreshKey} />
        </section>
      )}
    </AppShell>
  )
}
