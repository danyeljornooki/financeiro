"use client"

import { useEffect, useMemo, useState } from "react"
import { editarConta, excluirConta, listarContas, type Conta } from "../lib/contas"

type Props = {
  refreshKey?: number
}

type ContaForm = {
  descricao: string
  categoria: string
  valor: string
  vencimento: string
  status: string
}

export default function ContasTable({ refreshKey = 0 }: Props) {
  const [contas, setContas] = useState<Conta[]>([])
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [form, setForm] = useState<ContaForm>({
    descricao: "",
    categoria: "",
    valor: "",
    vencimento: "",
    status: "pendente",
  })

  const mesAtual = new Date().toISOString().slice(0, 7)
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [filtroMes, setFiltroMes] = useState(mesAtual)

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

  async function handleExcluir(id: number) {
    await excluirConta(id)
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
    })
  }

  async function salvarEdicao(id: number) {
    await editarConta(id, {
      descricao: form.descricao,
      categoria: form.categoria,
      valor: Number(form.valor),
      vencimento: form.vencimento || null,
      status: form.status,
    })

    setEditandoId(null)
    await recarregar()
  }

  const categorias = useMemo(() => {
    const lista = contas.map((conta) => conta.categoria).filter(Boolean)
    return [...new Set(lista)]
  }, [contas])

  const contasFiltradas = useMemo(() => {
    return contas.filter((conta) => {
      const statusOk =
        filtroStatus === "todos" || conta.status === filtroStatus
      const categoriaOk =
        filtroCategoria === "todas" || conta.categoria === filtroCategoria
      const mesConta = conta.vencimento ? conta.vencimento.slice(0, 7) : ""
      const mesOk = filtroMes ? mesConta === filtroMes : true

      return statusOk && categoriaOk && mesOk
    })
  }, [contas, filtroStatus, filtroCategoria, filtroMes])

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-bold">Contas cadastradas</h2>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <input
          type="month"
          value={filtroMes}
          onChange={(e) => setFiltroMes(e.target.value)}
          className="rounded border p-2"
        />

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="rounded border p-2"
        >
          <option value="todos">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="pago">Pago</option>
          <option value="atrasado">Atrasado</option>
        </select>

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="rounded border p-2"
        >
          <option value="todas">Todas as categorias</option>
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Descricao</th>
            <th className="p-2 text-left">Categoria</th>
            <th className="p-2 text-left">Valor</th>
            <th className="p-2 text-left">Vencimento</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Acoes</th>
          </tr>
        </thead>

        <tbody>
          {contasFiltradas.map((conta) => (
            <tr key={conta.id} className="border-t align-top">
              <td className="p-2">
                {editandoId === conta.id ? (
                  <input
                    className="w-full border p-1"
                    value={form.descricao}
                    onChange={(e) =>
                      setForm({ ...form, descricao: e.target.value })
                    }
                  />
                ) : (
                  conta.descricao
                )}
              </td>

              <td className="p-2">
                {editandoId === conta.id ? (
                  <input
                    className="w-full border p-1"
                    value={form.categoria}
                    onChange={(e) =>
                      setForm({ ...form, categoria: e.target.value })
                    }
                  />
                ) : (
                  conta.categoria
                )}
              </td>

              <td className="p-2">
                {editandoId === conta.id ? (
                  <input
                    type="number"
                    className="w-full border p-1"
                    value={form.valor}
                    onChange={(e) =>
                      setForm({ ...form, valor: e.target.value })
                    }
                  />
                ) : (
                  `R$ ${Number(conta.valor).toFixed(2)}`
                )}
              </td>

              <td className="p-2">
                {editandoId === conta.id ? (
                  <input
                    type="date"
                    className="w-full border p-1"
                    value={form.vencimento}
                    onChange={(e) =>
                      setForm({ ...form, vencimento: e.target.value })
                    }
                  />
                ) : (
                  conta.vencimento || "-"
                )}
              </td>

              <td className="p-2">
                {editandoId === conta.id ? (
                  <select
                    className="w-full border p-1"
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option value="pendente">pendente</option>
                    <option value="pago">pago</option>
                    <option value="atrasado">atrasado</option>
                  </select>
                ) : (
                  conta.status
                )}
              </td>

              <td className="p-2">
                <div className="flex gap-2">
                  {editandoId === conta.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => salvarEdicao(conta.id)}
                        className="rounded bg-green-600 px-3 py-1 text-white"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditandoId(null)}
                        className="rounded bg-gray-500 px-3 py-1 text-white"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => iniciarEdicao(conta)}
                        className="rounded bg-yellow-500 px-3 py-1 text-white"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExcluir(conta.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white"
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {contasFiltradas.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                Nenhuma conta encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
