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
        "rounded-xl border border-border bg-surface",
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
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
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
    neutral: "bg-primary text-white",
    income: "bg-success text-white",
    expense: "bg-danger text-white",
    warning: "bg-warning text-foreground",
    danger: "bg-danger text-white",
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5 transition-colors duration-200 hover:bg-surface/80">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium uppercase tracking-[0.12em] text-muted">{label}</div>
          {helper ? <div className="mt-2 text-sm text-muted">{helper}</div> : null}
        </div>
        <span className={cx("inline-flex h-10 w-10 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="text-2xl font-semibold tracking-[-0.05em] text-foreground">{value}</div>
    </div>
  )
})

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    receita: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    despesa: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    pendente: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    pago: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    atrasado: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    mensal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    anual: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    unica: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  }

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize border",
        map[status] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20"
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
    <div className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span className="font-medium text-muted">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  )
}

export function PremiumInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "h-10 w-full rounded-xl border border-[#232832] bg-[#151922] px-4 text-sm text-white placeholder:text-gray-400 outline-none transition-all duration-150 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
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
        "h-10 w-full rounded-xl border border-[#232832] bg-[#151922] px-4 text-sm text-white outline-none transition-all duration-150 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
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
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    ghost: "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white",
  }

  return (
    <button
      {...props}
      className={cx(
        "inline-flex h-9 items-center justify-center rounded-xl px-3 text-sm font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 hover:translate-y-[-1px]",
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
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-surface border border-border">
        <Wallet className="h-6 w-6 text-muted" />
      </div>
      <div className="text-base font-semibold text-foreground">{title}</div>
      <div className="mt-1 max-w-sm text-sm text-muted">{description}</div>
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
