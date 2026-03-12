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
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
    >
      {currentSection === "overview" ? (
        <div className="space-y-6">
          <section id="overview">
            <DashboardCards refreshKey={refreshKey} selectedMonth={selectedMonth} />
          </section>
          <AlertasVencimento refreshKey={refreshKey} />
          <ShellCard className="p-6">
            <SectionTitle
              eyebrow="Operacao"
              title="Movimentos do periodo"
              description="Acesso rapido ao registro de receitas e despesas sem sair da visao geral."
            />
            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <AddReceita onSaved={atualizarLista} />
              <AddConta onSaved={atualizarLista} />
            </div>
          </ShellCard>
        </div>
      ) : null}

      {currentSection === "receitas" ? (
        <section id="receitas" className="space-y-6">
          <AddReceita onSaved={atualizarLista} />
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
      ) : null}

      {currentSection === "despesas" ? (
        <section id="despesas" className="space-y-6">
          <AlertasVencimento refreshKey={refreshKey} />
          <AddConta onSaved={atualizarLista} />
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
      ) : null}

      {currentSection === "analytics" ? (
        <section id="analytics" className="space-y-6">
          <DashboardInsights refreshKey={refreshKey} selectedMonth={selectedMonth} />
          <FinanceiroAvancado refreshKey={refreshKey} />
        </section>
      ) : null}

      {currentSection === "security" ? (
        <section id="security">
          <SecurityPanel refreshKey={refreshKey} />
        </section>
      ) : null}
    </AppShell>
  )
}
