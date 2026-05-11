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
    receita: "bg-success/10 text-success border-success/20",
    despesa: "bg-danger/10 text-danger border-danger/20",
    pendente: "bg-warning/10 text-warning border-warning/20",
    pago: "bg-success/10 text-success border-success/20",
    atrasado: "bg-danger/10 text-danger border-danger/20",
    mensal: "bg-primary/10 text-primary border-primary/20",
    anual: "bg-primary/10 text-primary border-primary/20",
    unica: "bg-muted/10 text-muted border-border",
  }

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold capitalize border",
        map[status] ?? "bg-muted/10 text-muted border-border"
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
        "h-10 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
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
        "h-10 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
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
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20",
    danger: "bg-danger text-white hover:bg-danger/90",
    ghost: "bg-surface text-foreground border border-border hover:bg-surface/80",
  }

  return (
    <button
      {...props}
      className={cx(
        "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
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
