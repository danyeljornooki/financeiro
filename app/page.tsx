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
          <DashboardCards key={`cards-${refreshKey}`} refreshKey={refreshKey} selectedMonth={selectedMonth} />
          <AlertasVencimento key={`alertas-${refreshKey}`} refreshKey={refreshKey} />
          <ShellCard className="p-6">
            <SectionTitle
              eyebrow="Operações"
              title="Entrada e saída rápida"
              description="Registre receitas e despesas rapidamente."
            />
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <AddReceita key={`receita-${refreshKey}`} onSaved={atualizarLista} />
              <AddConta key={`conta-${refreshKey}`} onSaved={atualizarLista} />
            </div>
          </ShellCard>
        </div>
      )}

      {currentSection === "receitas" && (
        <section className="space-y-6">
          <ShellCard className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <SectionTitle
                eyebrow="Receitas"
                title="Entradas do período"
                description="Acompanhe as receitas com filtro mensal."
              />
              <AddReceita key={`receita-${refreshKey}`} onSaved={atualizarLista} />
            </div>
            <div className="mt-6">
              <ReceitasTable key={`receitas-table-${refreshKey}`} refreshKey={refreshKey} selectedMonth={selectedMonth} />
            </div>
          </ShellCard>
        </section>
      )}

      {currentSection === "despesas" && (
        <section className="space-y-6">
          <ShellCard className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <SectionTitle
                eyebrow="Despesas"
                title="Contas e compromissos"
                description="Gerencie despesas e acompanhe status."
              />
              <AddConta key={`conta-${refreshKey}`} onSaved={atualizarLista} />
            </div>
            <div className="mt-6">
              <ContasTable key={`contas-table-${refreshKey}`} refreshKey={refreshKey} selectedMonth={selectedMonth} />
            </div>
          </ShellCard>
          <AlertasVencimento key={`alertas-${refreshKey}`} refreshKey={refreshKey} />
        </section>
      )}

      {currentSection === "analytics" && (
        <section className="space-y-6">
          <DashboardInsights key={`insights-${refreshKey}`} refreshKey={refreshKey} selectedMonth={selectedMonth} />
          <FinanceiroAvancado key={`avancado-${refreshKey}`} refreshKey={refreshKey} />
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
