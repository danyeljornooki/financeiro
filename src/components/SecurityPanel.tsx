"use client"

import { useEffect, useState } from "react"
import { Activity, Clock3, LockKeyhole, ShieldCheck, TriangleAlert } from "lucide-react"
import { EmptyState, SectionTitle, ShellCard, StatCard, StatusBadge } from "./ui"

type AccessLogEntry = {
  id: string
  type: "login_success" | "login_failure" | "access_granted" | "access_denied" | "logout"
  ip: string
  path: string
  at: string
  detail: string
}

const typeLabel: Record<AccessLogEntry["type"], string> = {
  login_success: "login success",
  login_failure: "login failure",
  access_granted: "access granted",
  access_denied: "access denied",
  logout: "logout",
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  })
}

export default function SecurityPanel({ refreshKey }: { refreshKey: number }) {
  const [logs, setLogs] = useState<AccessLogEntry[]>([])

  useEffect(() => {
    let active = true

    async function carregarLogs() {
      const response = await fetch("/api/security/logs", { cache: "no-store" })
      if (!response.ok) return

      const data = (await response.json()) as AccessLogEntry[]
      if (active) {
        setLogs(data)
      }
    }

    void carregarLogs()

    return () => {
      active = false
    }
  }, [refreshKey])

  const falhas = logs.filter((item) => item.type === "login_failure" || item.type === "access_denied")
  const sucessos = logs.filter((item) => item.type === "login_success" || item.type === "access_granted")
  const ultimoEvento = logs[0]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ShieldCheck} label="Protecao ativa" value="RLS + Auth" helper="APIs internas protegidas" />
        <StatCard icon={TriangleAlert} label="Tentativas negadas" value={String(falhas.length)} tone="danger" helper="Falhas registradas em memoria" />
        <StatCard icon={LockKeyhole} label="Acessos liberados" value={String(sucessos.length)} tone="income" helper="Autenticacoes e acessos validos" />
        <StatCard
          icon={Clock3}
          label="Ultima atividade"
          value={ultimoEvento ? formatDate(ultimoEvento.at) : "--"}
          helper={ultimoEvento ? ultimoEvento.path : "Sem eventos recentes"}
        />
      </div>

      <ShellCard className="p-6">
        <SectionTitle
          eyebrow="Auditoria"
          title="Logs recentes de acesso"
          description="Monitoramento operacional de autenticacao, negacoes e uso das rotas protegidas."
        />

        {logs.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="Nenhum log recente"
              description="Os eventos de seguranca aparecerao aqui conforme o sistema registrar acessos e tentativas."
            />
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200/80">
            <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-3 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <span>Evento</span>
              <span>Origem</span>
              <span>Rota</span>
              <span>Horario</span>
            </div>
            <div className="divide-y divide-slate-200/80 bg-white">
              {logs.slice(0, 12).map((entry) => (
                <div key={entry.id} className="grid grid-cols-1 gap-3 px-5 py-4 text-sm text-slate-600 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                      <Activity className="h-4 w-4" />
                    </span>
                    <div className="space-y-1">
                      <StatusBadge status={entry.type.includes("failure") || entry.type.includes("denied") ? "atrasado" : "pago"} />
                      <div className="text-sm font-semibold capitalize text-slate-950">{typeLabel[entry.type]}</div>
                      <div className="text-xs text-slate-500">{entry.detail}</div>
                    </div>
                  </div>
                  <div className="self-center font-medium text-slate-700">{entry.ip}</div>
                  <div className="self-center font-mono text-xs text-slate-500">{entry.path}</div>
                  <div className="self-center text-slate-500">{formatDate(entry.at)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ShellCard>
    </div>
  )
}
