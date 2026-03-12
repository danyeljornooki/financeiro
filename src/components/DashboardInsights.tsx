"use client"

import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { CircleDollarSign, Layers3, PieChartIcon, TrendingUp } from "lucide-react"
import { gerarGraficoPorCategoria, listarContas, type Conta } from "../lib/contas"
import { listarReceitas, type Receita } from "../lib/receitas"
import { SectionTitle, ShellCard, money } from "./ui"

type Props = {
  refreshKey?: number
  selectedMonth: string
}

const COLORS = ["#0f766e", "#0284c7", "#6366f1", "#ea580c", "#dc2626", "#8b5cf6"]

type MesItem = {
  mes: string
  receitas: number
  despesas: number
  saldo: number
}

function tooltipMoney(
  value: number | string | ReadonlyArray<number | string> | undefined
) {
  const normalized = Array.isArray(value) ? value[0] : value
  return money(Number(normalized ?? 0))
}

const tooltipStyle = {
  borderRadius: 20,
  border: "1px solid rgba(226,232,240,0.9)",
  background: "rgba(255,255,255,0.96)",
  boxShadow: "0 18px 40px -24px rgba(15,23,42,0.35)",
  padding: "10px 12px",
}

export default function DashboardInsights({ refreshKey = 0, selectedMonth }: Props) {
  const [contas, setContas] = useState<Conta[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])

  useEffect(() => {
    let active = true

    void Promise.all([listarContas(), listarReceitas()]).then(([contasData, receitasData]) => {
      if (active) {
        setContas(contasData)
        setReceitas(receitasData)
      }
    })

    return () => {
      active = false
    }
  }, [refreshKey])

  const serieMensal = useMemo<MesItem[]>(() => {
    const hoje = new Date()
    const base = Array.from({ length: 6 }, (_, index) => {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - (5 - index), 1)
      return {
        mes: `${String(data.getMonth() + 1).padStart(2, "0")}/${String(data.getFullYear()).slice(2)}`,
        ref: `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`,
        receitas: 0,
        despesas: 0,
        saldo: 0,
      }
    })

    for (const receita of receitas) {
      const item = base.find((entry) => entry.ref === receita.data.slice(0, 7))
      if (!item) continue
      item.receitas += receita.valor
      item.saldo += receita.valor
    }

    for (const conta of contas) {
      if (!conta.vencimento || conta.tipo !== "despesa") continue
      const vencimentoRef = conta.vencimento.slice(0, 7)
      const item = base.find((entry) => entry.ref === vencimentoRef)
      if (!item) continue
      item.despesas += conta.valor
      item.saldo -= conta.valor
    }

    return base.map((item) => ({
      mes: item.mes,
      receitas: item.receitas,
      despesas: item.despesas,
      saldo: item.saldo,
    }))
  }, [contas, receitas])

  const categorias = useMemo(
    () => gerarGraficoPorCategoria(contas).slice(0, 5).map((item, index) => ({ ...item, color: COLORS[index % COLORS.length] })),
    [contas]
  )

  const distribuicaoStatus = useMemo(() => {
    const despesasMes = contas.filter(
      (conta) => conta.tipo === "despesa" && conta.vencimento?.slice(0, 7) === selectedMonth
    )
    const grouped = [
      { name: "Pago", value: 0, color: "#059669" },
      { name: "Pendente", value: 0, color: "#d97706" },
      { name: "Atrasado", value: 0, color: "#dc2626" },
    ]

    for (const conta of despesasMes) {
      if (conta.status === "pago") grouped[0].value += conta.valor
      if (conta.status === "pendente") grouped[1].value += conta.valor
      if (conta.status === "atrasado") grouped[2].value += conta.valor
    }

    return grouped
  }, [contas, selectedMonth])

  const topGastos = useMemo(
    () =>
      contas
        .filter((conta) => conta.tipo === "despesa")
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5),
    [contas]
  )

  const saldoTrend = useMemo(() => {
    let acumulado = 0
    return serieMensal.map((item) => {
      acumulado += item.saldo
      return {
        mes: item.mes,
        saldoProjetado: acumulado,
      }
    })
  }, [serieMensal])

  const chartBaseClass = "rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] p-6 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.38),inset_0_1px_0_rgba(255,255,255,0.75)]"

  return (
    <ShellCard className="p-6 md:p-7">
      <SectionTitle
        eyebrow="Analytics"
        title="Leitura visual do fluxo financeiro"
        description="Graficos refinados para acompanhar categorias, evolucao mensal, status e tendencia de saldo."
      />

      <div className="mt-6 grid grid-cols-1 gap-5 2xl:grid-cols-12">
        <motion.div className={chartBaseClass + " 2xl:col-span-7"} whileHover={{ y: -2 }}>
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <CircleDollarSign className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold text-slate-950">Receitas vs despesas</h3>
              <p className="text-sm text-slate-500">Evolucao dos ultimos seis meses</p>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serieMensal} barGap={10}>
                <CartesianGrid stroke="#e5edf6" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip formatter={tooltipMoney} contentStyle={tooltipStyle} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
                <Legend />
                <Bar dataKey="receitas" fill="#0f766e" radius={[12, 12, 0, 0]} />
                <Bar dataKey="despesas" fill="#be123c" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className={chartBaseClass + " 2xl:col-span-5"} whileHover={{ y: -2 }}>
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <PieChartIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold text-slate-950">Gastos por categoria</h3>
              <p className="text-sm text-slate-500">Distribuicao das maiores categorias</p>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[210px_minmax(0,1fr)]">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categorias} dataKey="valor" nameKey="categoria" innerRadius={62} outerRadius={92} paddingAngle={3}>
                    {categorias.map((entry) => (
                      <Cell key={entry.categoria} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={tooltipMoney} contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {categorias.map((item) => (
                <div key={item.categoria} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-slate-700">{item.categoria}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-950">{item.percentual.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className={chartBaseClass + " 2xl:col-span-5"} whileHover={{ y: -2 }}>
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <Layers3 className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold text-slate-950">Distribuicao por status</h3>
              <p className="text-sm text-slate-500">Mapa do mes selecionado</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribuicaoStatus} dataKey="value" nameKey="name" innerRadius={58} outerRadius={104} paddingAngle={4}>
                  {distribuicaoStatus.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipMoney} contentStyle={tooltipStyle} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className={chartBaseClass + " 2xl:col-span-7"} whileHover={{ y: -2 }}>
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold text-slate-950">Tendencia de saldo</h3>
              <p className="text-sm text-slate-500">Projecao acumulada com base nos ultimos meses</p>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={saldoTrend}>
                <defs>
                  <linearGradient id="saldoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e5edf6" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip formatter={tooltipMoney} contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="saldoProjetado"
                  stroke="#1d4ed8"
                  strokeWidth={3}
                  fill="url(#saldoGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className={chartBaseClass + " 2xl:col-span-12"} whileHover={{ y: -2 }}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-950">Top gastos</h3>
              <p className="text-sm text-slate-500">Itens de maior impacto financeiro no momento</p>
            </div>
            <div className="text-sm text-slate-500">{topGastos.length} itens monitorados</div>
          </div>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-5">
            {topGastos.map((item, index) => (
              <div key={item.id} className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                  #{index + 1}
                </div>
                <div className="text-base font-semibold text-slate-950">{item.descricao}</div>
                <div className="mt-1 text-sm text-slate-500">{item.categoria}</div>
                <div className="mt-4 text-xl font-semibold tracking-[-0.04em] text-rose-700">
                  {money(item.valor)}
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  {item.vencimento ? `Vencimento em ${item.vencimento}` : "Sem data definida"}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </ShellCard>
  )
}
