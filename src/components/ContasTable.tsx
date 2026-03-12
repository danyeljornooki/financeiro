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

function labelRecorrencia(conta: Conta) {
  if (conta.parcela_total && conta.parcela_atual) {
    return `${conta.parcela_atual}/${conta.parcela_total}`
  }

  if (conta.recorrencia === "mensal") return "mensal"
  if (conta.recorrencia === "anual") return "anual"
  return "unica"
}

export default function ContasTable({ refreshKey = 0, selectedMonth }: Props) {
  const [contas, setContas] = useState<Conta[]>([])
  const [editandoId, setEditandoId] = useState<string | null>(null)
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
    setEditandoId(conta.id)
    setForm({
      descricao: conta.descricao,
      categoria: conta.categoria,
      valor: String(conta.valor),
      vencimento: conta.vencimento ?? "",
      status: conta.status,
      tipo: conta.tipo,
    })
  }

  async function salvarEdicao(id: string) {
    await editarConta(id, {
      descricao: form.descricao,
      categoria: form.categoria,
      valor: Number(form.valor),
      vencimento: form.vencimento || null,
      status: form.status,
      tipo: form.tipo,
    })

    setEditandoId(null)
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
        title="Operacao de contas"
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
        <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-5 py-4">Descricao</th>
                  <th className="px-5 py-4">Categoria</th>
                  <th className="px-5 py-4">Valor</th>
                  <th className="px-5 py-4">Vencimento</th>
                  <th className="px-5 py-4">Recorrencia</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {contasFiltradas.map((conta) => (
                  <Fragment key={conta.id}>
                    <tr className="transition hover:bg-slate-50/80">
                      <td className="px-5 py-4">
                        {editandoId === conta.id ? (
                          <PremiumInput
                            value={form.descricao}
                            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                          />
                        ) : (
                          <div>
                            <div className="font-medium text-slate-900">{conta.descricao}</div>
                            <div className="text-sm text-slate-500">{conta.categoria}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {editandoId === conta.id ? (
                          <PremiumInput
                            value={form.categoria}
                            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                          />
                        ) : (
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {conta.categoria}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {editandoId === conta.id ? (
                          <PremiumInput
                            type="number"
                            value={form.valor}
                            onChange={(e) => setForm({ ...form, valor: e.target.value })}
                          />
                        ) : (
                          <span className="text-base font-semibold text-rose-700">{money(conta.valor)}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {editandoId === conta.id ? (
                          <PremiumInput
                            type="date"
                            value={form.vencimento}
                            onChange={(e) => setForm({ ...form, vencimento: e.target.value })}
                          />
                        ) : (
                          <span className="text-sm text-slate-600">{conta.vencimento || "-"}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={labelRecorrencia(conta)} />
                      </td>
                      <td className="px-5 py-4">
                        {editandoId === conta.id ? (
                          <PremiumSelect
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value as Conta["status"] })}
                          >
                            <option value="pendente">pendente</option>
                            <option value="pago">pago</option>
                            <option value="atrasado">atrasado</option>
                          </PremiumSelect>
                        ) : (
                          <StatusBadge status={conta.status} />
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {editandoId === conta.id ? (
                            <>
                              <PremiumButton onClick={() => salvarEdicao(conta.id)}>Salvar</PremiumButton>
                              <PremiumButton variant="ghost" onClick={() => setEditandoId(null)}>
                                Cancelar
                              </PremiumButton>
                            </>
                          ) : (
                            <>
                              <PremiumButton variant="ghost" onClick={() => iniciarEdicao(conta)} className="gap-2 px-3">
                                <Pencil className="h-4 w-4" />
                              </PremiumButton>
                              <PremiumButton variant="secondary" onClick={() => handlePagar(conta)} className="gap-2 px-3">
                                <CheckCheck className="h-4 w-4" />
                              </PremiumButton>
                              <PremiumButton variant="ghost" onClick={() => handleDuplicar(conta)} className="gap-2 px-3">
                                <Copy className="h-4 w-4" />
                              </PremiumButton>
                              <PremiumButton variant="danger" onClick={() => handleExcluir(conta.id)} className="gap-2 px-3">
                                <Trash2 className="h-4 w-4" />
                              </PremiumButton>
                            </>
                          )}
                        </div>
                        {editandoId !== conta.id ? (
                          <button
                            type="button"
                            onClick={() =>
                              setHistoricoAbertoId(historicoAbertoId === conta.id ? null : conta.id)
                            }
                            className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-900"
                          >
                            {historicoAbertoId === conta.id ? "Ocultar historico" : "Ver historico"}
                          </button>
                        ) : null}
                      </td>
                    </tr>

                    {historicoAbertoId === conta.id ? (
                      <tr className="bg-slate-50/80">
                        <td colSpan={7} className="px-5 py-4">
                          {conta.historico_pagamentos && conta.historico_pagamentos.length > 0 ? (
                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                              {conta.historico_pagamentos.map((item, index) => (
                                <div key={`${conta.id}-${index}`} className="rounded-[20px] border border-slate-200 bg-white p-4">
                                  <div className="mb-2 flex items-center justify-between">
                                    <StatusBadge status={item.status} />
                                    <span className="text-xs text-slate-500">
                                      {new Date(item.data).toLocaleDateString("pt-BR")}
                                    </span>
                                  </div>
                                  <div className="text-lg font-semibold text-slate-950">{money(item.valor)}</div>
                                  <div className="mt-1 text-sm text-slate-500">{item.observacao}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <EmptyState
                              title="Historico vazio"
                              description="Pagamentos realizados nesta conta aparecerao aqui com contexto e rastreabilidade."
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
    </div>
  )
}
