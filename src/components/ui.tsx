"use client"

import { motion } from "framer-motion"
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Clock3, LucideIcon, Wallet } from "lucide-react"
import { ReactNode } from "react"

export function money(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export function ShellCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cx(
        "rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] shadow-[0_24px_80px_-36px_rgba(15,23,42,0.4),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur",
        className
      )}
    >
      {children}
    </motion.section>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "neutral",
  helper,
}: {
  icon: LucideIcon
  label: string
  value: string
  tone?: "neutral" | "income" | "expense" | "warning" | "danger"
  helper?: string
}) {
  const tones = {
    neutral: "from-slate-950 to-slate-700 text-white",
    income: "from-emerald-700 to-emerald-500 text-white",
    expense: "from-rose-700 to-rose-500 text-white",
    warning: "from-amber-600 to-orange-400 text-white",
    danger: "from-red-700 to-red-500 text-white",
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.38),inset_0_1px_0_rgba(255,255,255,0.7)]"
    >
      <div className={cx("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", tones[tone])} />
      <div className="absolute inset-x-6 top-16 h-20 rounded-full bg-slate-100/70 blur-2xl" />
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className={cx("inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="text-3xl font-semibold tracking-[-0.05em] text-slate-950">{value}</div>
      {helper ? <div className="mt-2 text-sm text-slate-500">{helper}</div> : null}
    </motion.div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    receita: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    despesa: "bg-rose-50 text-rose-700 ring-rose-200",
    pendente: "bg-amber-50 text-amber-700 ring-amber-200",
    pago: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    atrasado: "bg-red-50 text-red-700 ring-red-200",
    mensal: "bg-sky-50 text-sky-700 ring-sky-200",
    anual: "bg-violet-50 text-violet-700 ring-violet-200",
    unica: "bg-slate-100 text-slate-700 ring-slate-200",
  }

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset",
        map[status] ?? "bg-slate-100 text-slate-700 ring-slate-200"
      )}
    >
      {status}
    </span>
  )
}

export function DataPill({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
      <Icon className="h-3.5 w-3.5" />
      <span className="font-medium text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  )
}

export function PremiumInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100",
        props.className
      )}
    />
  )
}

export function PremiumSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cx(
        "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100",
        props.className
      )}
    />
  )
}

export function PremiumButton({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost"
}) {
  const variants = {
    primary:
      "bg-slate-950 text-white shadow-[0_14px_30px_-18px_rgba(15,23,42,0.8)] hover:bg-slate-800",
    secondary:
      "bg-sky-600 text-white shadow-[0_14px_30px_-18px_rgba(2,132,199,0.8)] hover:bg-sky-500",
    danger:
      "bg-rose-600 text-white shadow-[0_14px_30px_-18px_rgba(225,29,72,0.8)] hover:bg-rose-500",
    ghost:
      "bg-white/80 text-slate-700 border border-slate-200 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.5)] hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950",
  }

  return (
    <button
      {...props}
      className={cx(
        "inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  )
}

export function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
        <Wallet className="h-6 w-6 text-slate-400" />
      </div>
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <div className="mt-1 max-w-sm text-sm text-slate-500">{description}</div>
    </div>
  )
}

export const statusIcons = {
  receita: ArrowUpRight,
  despesa: ArrowDownRight,
  pendente: Clock3,
  pago: Wallet,
  atrasado: AlertTriangle,
}
