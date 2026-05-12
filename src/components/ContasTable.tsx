"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import { CheckCheck, Copy, Pencil, Trash2 } from "lucide-react"
import {
  duplicarConta,
  editarConta,
  excluirConta,
  listarContas,
  marcarContaComoPaga,
  type Conta,
} from "../lib/contas"
import {
  EmptyState,
  PremiumButton,
  PremiumInput,
  PremiumSelect,
  SectionTitle,
  StatusBadge,
  money,
} from "./ui"
import { Sheet } from "./Sheet"

type Props = {
  refreshKey?: number
  selectedMonth: string
}

type ContaForm = {
  descricao: string
  categoria: string
  valor: string
  vencimento: string
  status: Conta["status"]
  tipo: Conta["tipo"]
}

export default function ContasTable({ refreshKey = 0, selectedMonth }: Props) {
  const [contas, setContas] = useState<Conta[]>([])
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingConta, setEditingConta] = useState<Conta | null>(null)
  const [historicoAbertoId, setHistoricoAbertoId] = useState<string | null>(null)
  const [form, setForm] = useState<ContaForm>({
    descricao: "",
    categoria: "",
    valor: "",
    vencimento: "",
    status: "pendente",
    tipo: "despesa",
  })

  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")

  useEffect(() => {
    let active = true

    void listarContas().then((data) => {
      if (active) {
        setContas(data)
      }
    })

    return () => {
      active = false
    }
  }, [refreshKey])

  async function recarregar() {
    const data = await listarContas()
    setContas(data)
  }

  async function handleExcluir(id: string) {
    await excluirConta(id)
    await recarregar()
  }

  async function handlePagar(conta: Conta) {
    await marcarContaComoPaga(conta)
    await recarregar()
  }

  async function handleDuplicar(conta: Conta) {
    await duplicarConta(conta)
    await recarregar()
  }

  function iniciarEdicao(conta: Conta) {
    setEditingConta(conta)
    setForm({
      descricao: conta.descricao,
      categoria: conta.categoria,
      valor: String(conta.valor),
      vencimento: conta.vencimento ?? "",
      status: conta.status,
      tipo: conta.tipo,
    })
    setSheetOpen(true)
  }

  function fecharSheet() {
    setSheetOpen(false)
    setEditingConta(null)
    setForm({
      descricao: "",
      categoria: "",
      valor: "",
      vencimento: "",
      status: "pendente",
      tipo: "despesa",
    })
  }

  async function salvarEdicao() {
    if (!editingConta) return

    await editarConta(editingConta.id, {
      descricao: form.descricao,
      categoria: form.categoria,
      valor: Number(form.valor),
      vencimento: form.vencimento || null,
      status: form.status,
      tipo: form.tipo,
    })

    fecharSheet()
    await recarregar()
  }

  const categorias = useMemo(() => {
    const lista = contas
      .filter((conta) => conta.tipo === "despesa")
      .map((conta) => conta.categoria)
      .filter(Boolean)
    return [...new Set(lista)]
  }, [contas])

  const contasFiltradas = useMemo(() => {
    return contas.filter((conta) => {
      const statusOk = filtroStatus === "todos" || conta.status === filtroStatus
      const categoriaOk = filtroCategoria === "todas" || conta.categoria === filtroCategoria
      const mesConta = conta.vencimento ? conta.vencimento.slice(0, 7) : ""
      const mesOk = selectedMonth ? mesConta === selectedMonth : true

      return conta.tipo === "despesa" && statusOk && categoriaOk && mesOk
    })
  }, [contas, filtroStatus, filtroCategoria, selectedMonth])

  return (
    <div>
      <SectionTitle
        eyebrow="Despesas"
        title="Operação de contas"
        description="Edite, duplique, quite e acompanhe compromissos com filtros refinados e leitura profissional."
        action={
          <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2">
            <PremiumSelect value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="todos">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="atrasado">Atrasado</option>
            </PremiumSelect>
            <PremiumSelect value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
              <option value="todas">Todas as categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </PremiumSelect>
          </div>
        }
      />

      {contasFiltradas.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Nenhuma despesa encontrada"
            description="Use os filtros do periodo ou registre uma nova conta para alimentar este painel premium."
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-[#0f0f23]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-[#0f0f23]/80 backdrop-blur-sm">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400" style={{ minWidth: '240px', maxWidth: '320px' }}>Descrição</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400" style={{ width: '120px' }}>Valor</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400" style={{ width: '140px' }}>Vencimento</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400" style={{ width: '110px' }}>Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right" style={{ width: '140px' }}>Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {contasFiltradas.map((conta) => (
                  <Fragment key={conta.id}>
                    <tr className="transition-colors duration-150 hover:bg-white/2" style={{ height: '64px' }}>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-white">{conta.descricao}</div>
                          <div className="text-xs text-gray-400">{conta.categoria}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-rose-400">{money(conta.valor)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-300">{conta.vencimento || "-"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={conta.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => iniciarEdicao(conta)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/70 border border-white/10 transition-all duration-150 hover:bg-white/10 hover:text-white hover:translate-y-[-1px]"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePagar(conta)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/70 border border-white/10 transition-all duration-150 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 hover:translate-y-[-1px]"
                          >
                            <CheckCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicar(conta)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/70 border border-white/10 transition-all duration-150 hover:bg-white/10 hover:text-white hover:translate-y-[-1px]"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleExcluir(conta.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/70 border border-white/10 transition-all duration-150 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 hover:translate-y-[-1px]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {historicoAbertoId !== conta.id ? (
                          <button
                            type="button"
                            onClick={() =>
                              setHistoricoAbertoId(historicoAbertoId === conta.id ? null : conta.id)
                            }
                            className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-400 transition-colors hover:text-white"
                          >
                            {historicoAbertoId === conta.id ? "Ocultar histórico" : "Ver histórico"}
                          </button>
                        ) : null}
                      </td>
                    </tr>

                    {historicoAbertoId === conta.id ? (
                      <tr className="bg-white/5">
                        <td colSpan={5} className="px-4 py-4">
                          {conta.historico_pagamentos && conta.historico_pagamentos.length > 0 ? (
                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                              {conta.historico_pagamentos.map((item, index) => (
                                <div key={`${conta.id}-${index}`} className="rounded-2xl border border-white/10 bg-[#0f0f23] p-4">
                                  <div className="mb-2 flex items-center justify-between">
                                    <StatusBadge status={item.status} />
                                    <span className="text-xs text-gray-400">
                                      {new Date(item.data).toLocaleDateString("pt-BR")}
                                    </span>
                                  </div>
                                  <div className="text-lg font-semibold text-white">{money(item.valor)}</div>
                                  <div className="mt-1 text-sm text-gray-400">{item.observacao}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <EmptyState
                              title="Histórico vazio"
                              description="Pagamentos realizados nesta conta aparecerão aqui com contexto e rastreabilidade."
                            />
                          )}
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Sheet isOpen={sheetOpen} onClose={fecharSheet} title="Editar Conta">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Descrição</label>
            <PremiumInput
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Digite a descrição"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Categoria</label>
            <PremiumInput
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              placeholder="Digite a categoria"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Valor</label>
            <PremiumInput
              type="number"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
              placeholder="0,00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Vencimento</label>
            <PremiumInput
              type="date"
              value={form.vencimento}
              onChange={(e) => setForm({ ...form, vencimento: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Status</label>
            <PremiumSelect
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Conta["status"] })}
            >
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="atrasado">Atrasado</option>
            </PremiumSelect>
          </div>
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <PremiumButton onClick={salvarEdicao} className="flex-1">
              Salvar
            </PremiumButton>
            <PremiumButton variant="ghost" onClick={fecharSheet} className="flex-1">
              Cancelar
            </PremiumButton>
          </div>
        </div>
      </Sheet>
    </div>
  )
}
