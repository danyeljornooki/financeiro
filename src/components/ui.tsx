"use client"

import { memo } from "react"
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

export const ShellCard = memo(function ShellCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cx(
        "rounded-[28px] border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      {children}
    </section>
  )
})

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

export const StatCard = memo(function StatCard({
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
    neutral: "bg-slate-950 text-white",
    income: "bg-emerald-700 text-white",
    expense: "bg-rose-600 text-white",
    warning: "bg-amber-500 text-slate-950",
    danger: "bg-red-600 text-white",
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">{label}</div>
          {helper ? <div className="mt-2 text-sm text-slate-500">{helper}</div> : null}
        </div>
        <span className={cx("inline-flex h-11 w-11 items-center justify-center rounded-2xl", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="text-3xl font-semibold tracking-[-0.05em] text-slate-950">{value}</div>
    </div>
  )
})

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
        "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition duration-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100",
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
        "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition duration-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100",
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
    primary: "bg-slate-950 text-white hover:bg-slate-800",
    secondary: "bg-sky-600 text-white hover:bg-sky-500",
    danger: "bg-rose-600 text-white hover:bg-rose-500",
    ghost: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-950",
  }

  return (
    <button
      {...props}
      className={cx(
        "inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
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
    <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
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
