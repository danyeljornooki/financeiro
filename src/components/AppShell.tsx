"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  BellDot,
  CalendarRange,
  ChartColumnBig,
  CreditCard,
  HandCoins,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react"
import { ReactNode, useState } from "react"
import { DataPill, PremiumButton, PremiumInput, ShellCard, cx } from "./ui"

type Props = {
  children: ReactNode
  selectedMonth: string
  onSelectedMonthChange: (value: string) => void
  onLogout: () => Promise<void>
}

const navItems = [
  { label: "Visao geral", icon: LayoutDashboard, id: "overview", active: true },
  { label: "Receitas", icon: HandCoins, id: "receitas" },
  { label: "Despesas", icon: CreditCard, id: "despesas" },
  { label: "Analytics", icon: ChartColumnBig, id: "analytics" },
  { label: "Seguranca", icon: ShieldCheck, id: "planejamento" },
]

export default function AppShell({
  children,
  selectedMonth,
  onSelectedMonthChange,
  onLogout,
}: Props) {
  const [open, setOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState("overview")

  function handleNavigate(sectionId: string) {
    setCurrentSection(sectionId)
    const target = document.getElementById(sectionId)
    target?.scrollIntoView({ behavior: "smooth", block: "start" })
    setOpen(false)
  }

  const sidebar = (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top,#38bdf8,transparent_55%),linear-gradient(135deg,#0f172a,#1e3a8a)] text-white shadow-lg">
            <WalletCards className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">
              Financeiro
            </div>
            <div className="text-lg font-semibold tracking-[-0.04em] text-slate-950">
              Control Hub
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(241,245,249,0.82))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Navegacao
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
                    "group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition",
                    currentSection === item.id || item.active && currentSection === "overview"
                      ? "bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] text-white shadow-[0_18px_34px_-18px_rgba(15,23,42,0.8)]"
                      : "text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-[0_14px_28px_-22px_rgba(15,23,42,0.45)]"
                  )}
                >
                  <Icon className="h-4 w-4 transition group-hover:scale-105" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

      <ShellCard className="overflow-hidden bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] p-5 text-white">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-sky-100">
          <Sparkles className="h-4 w-4" />
          Ambiente protegido
        </div>
        <div className="text-2xl font-semibold tracking-[-0.05em]">
          Painel premium com dados privados e APIs protegidas.
        </div>
        <div className="mt-3 text-sm text-sky-100/80">
          Operacao centralizada com autenticao, RLS e monitoramento.
        </div>
      </ShellCard>
    </div>
  )

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_28%),radial-gradient(circle_at_top_right,#dcfce7,transparent_22%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <div className="mx-auto max-w-[1680px] p-4 md:p-6 xl:p-8">
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden xl:block">
            <ShellCard className="sticky top-8 h-[calc(100vh-4rem)] overflow-hidden border-slate-200/70 bg-[radial-gradient(circle_at_top,#bfdbfe,transparent_28%),radial-gradient(circle_at_bottom_right,#dbeafe,transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,245,249,0.92))] p-5">
              {sidebar}
            </ShellCard>
          </aside>

          <div className="min-w-0 space-y-6">
            <ShellCard className="overflow-hidden p-4 md:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 xl:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </button>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-[0.26em] text-sky-600">
                      Workspace
                    </div>
                    <h1 className="text-3xl font-semibold tracking-[-0.06em] text-slate-950 md:text-4xl">
                      Painel financeiro premium
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                      Receitas, despesas, previsoes e operacao segura em uma unica visao.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <div className="flex flex-wrap items-center gap-2">
                    <DataPill icon={BellDot} label="Monitoramento" value="Ativo" />
                    <DataPill icon={ShieldCheck} label="Protecao" value="RLS + Auth" />
                  </div>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="relative">
                      <CalendarRange className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <PremiumInput
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => onSelectedMonthChange(e.target.value)}
                        className="min-w-[220px] pl-11"
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

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/35 xl:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-[310px] p-4 xl:hidden"
            >
              <ShellCard className="h-full p-5">
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
              </ShellCard>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
