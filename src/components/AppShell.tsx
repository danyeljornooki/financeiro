"use client"

import { BellDot, CalendarRange, ChartColumnBig, CreditCard, HandCoins, LayoutDashboard, LogOut, Menu, ShieldCheck, Sparkles, WalletCards, X } from "lucide-react"
import { ReactNode, useCallback, useMemo, useState } from "react"
import { DataPill, PremiumButton, PremiumInput, ShellCard, cx } from "./ui"

type Props = {
  children: ReactNode
  selectedMonth: string
  onSelectedMonthChange: (value: string) => void
  onLogout: () => Promise<void>
  currentSection: string
  onSectionChange: (value: string) => void
}

const navItems = [
  { label: "Visão geral", icon: LayoutDashboard, id: "overview" },
  { label: "Receitas", icon: HandCoins, id: "receitas" },
  { label: "Despesas", icon: CreditCard, id: "despesas" },
  { label: "Analytics", icon: ChartColumnBig, id: "analytics" },
  { label: "Segurança", icon: ShieldCheck, id: "security" },
]

const sectionMeta: Record<string, { eyebrow: string; title: string; description: string }> = {
  overview: {
    eyebrow: "Workspace",
    title: "Visão geral financeira",
    description: "Resumo do período com indicadores claros e foco nos dados essenciais.",
  },
  receitas: {
    eyebrow: "Receitas",
    title: "Entradas do período",
    description: "Cadastre e acompanhe receitas com foco em fluxo de caixa mensal.",
  },
  despesas: {
    eyebrow: "Despesas",
    title: "Saídas e compromissos",
    description: "Gerencie vencimentos, status e prioridades financeiras de forma objetiva.",
  },
  analytics: {
    eyebrow: "Analytics",
    title: "Análise e tendências",
    description: "Visualize o desempenho financeiro com gráficos limpos e dados relevantes.",
  },
  security: {
    eyebrow: "Segurança",
    title: "Acesso e proteção",
    description: "Monitore autenticações e eventos de segurança do sistema.",
  },
}

export default function AppShell({
  children,
  selectedMonth,
  onSelectedMonthChange,
  onLogout,
  currentSection,
  onSectionChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const activeMeta = useMemo(
    () => sectionMeta[currentSection] ?? sectionMeta.overview,
    [currentSection]
  )

  const handleNavigate = useCallback(
    (sectionId: string) => {
      onSectionChange(sectionId)
      setOpen(false)
    },
    [onSectionChange]
  )

  const sidebar = useMemo(
    () => (
      <div className="flex h-full flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <WalletCards className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Financeiro
            </div>
            <div className="text-lg font-semibold tracking-[-0.04em] text-slate-950">
              Control Hub
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-3">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Navegação
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={cx(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-colors duration-200",
                    currentSection === item.id
                      ? "bg-slate-950 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Ambiente protegido
          </div>
          <div className="text-sm font-semibold text-slate-950">
            Painel com dados privados e segurança de acesso.
          </div>
          <div className="mt-3 text-sm text-slate-500">
            RLS e autenticação tornam o fluxo mais seguro.
          </div>
        </div>
      </div>
    ),
    [currentSection, handleNavigate]
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1680px] p-4 md:p-6 xl:p-8">
        <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden xl:block">
            <ShellCard className="sticky top-8 h-[calc(100vh-4rem)] overflow-hidden border-slate-200 bg-white p-5">
              {sidebar}
            </ShellCard>
          </aside>

          <div className="min-w-0 space-y-6">
            <ShellCard className="p-4 md:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 xl:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </button>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
                      {activeMeta.eyebrow}
                    </div>
                    <h1 className="text-3xl font-semibold tracking-[-0.06em] text-slate-950 md:text-4xl">
                      {activeMeta.title}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                      {activeMeta.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <div className="flex flex-wrap items-center gap-2">
                    <DataPill icon={BellDot} label="Monitoramento" value="Ativo" />
                    <DataPill icon={ShieldCheck} label="Proteção" value="RLS + Auth" />
                  </div>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="relative min-w-[220px]">
                      <CalendarRange className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <PremiumInput
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => onSelectedMonthChange(e.target.value)}
                        className="pl-11"
                      />
                    </div>
                    <PremiumButton variant="ghost" onClick={() => void onLogout()} className="gap-2">
                      <LogOut className="h-4 w-4" />
                      Sair
                    </PremiumButton>
                  </div>
                </div>
              </div>
            </ShellCard>

            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </div>

      {open ? (
        <>
          <div className="fixed inset-0 z-40 bg-slate-950/30 xl:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-slate-200 bg-white p-4 shadow-lg xl:hidden">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {sidebar}
          </aside>
        </>
      ) : null}
    </div>
  )
}
