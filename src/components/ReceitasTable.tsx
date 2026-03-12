"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { editarReceita, excluirReceita, listarReceitas, type Receita } from "../lib/receitas"
import { EmptyState, PremiumButton, PremiumInput, SectionTitle, StatusBadge, money } from "./ui"

type Props = {
  refreshKey?: number
  selectedMonth: string
}

type ReceitaForm = {
  descricao: string
  valor: string
  data: string
}

export default function ReceitasTable({ refreshKey = 0, selectedMonth }: Props) {
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [form, setForm] = useState<ReceitaForm>({
    descricao: "",
    valor: "",
    data: "",
  })

  useEffect(() => {
    let active = true

    void listarReceitas().then((data) => {
      if (active) {
        setReceitas(data)
      }
    })

    return () => {
      active = false
    }
  }, [refreshKey])

  async function recarregar() {
    const data = await listarReceitas()
    setReceitas(data)
  }

  function iniciarEdicao(receita: Receita) {
    setEditandoId(receita.id)
    setForm({
      descricao: receita.descricao,
      valor: String(receita.valor),
      data: receita.data,
    })
  }

  async function salvarEdicao(id: string) {
    await editarReceita(id, {
      descricao: form.descricao,
      valor: Number(form.valor),
      data: form.data,
    })

    setEditandoId(null)
    await recarregar()
  }

  async function handleExcluir(id: string) {
    await excluirReceita(id)
    await recarregar()
  }

  const receitasFiltradas = useMemo(
    () => receitas.filter((receita) => receita.data.slice(0, 7) === selectedMonth),
    [receitas, selectedMonth]
  )

  return (
    <div>
      <SectionTitle
        eyebrow="Receitas"
        title="Entradas registradas"
        description="Acompanhe recebimentos do periodo e ajuste registros sem sair da tela."
      />

      {receitasFiltradas.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Nenhuma receita encontrada"
            description="Assim que uma entrada for registrada para este mes, ela aparecera aqui com foco total em leitura e controle."
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-5 py-4">Descricao</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Data</th>
                  <th className="px-5 py-4">Valor</th>
                  <th className="px-5 py-4 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {receitasFiltradas.map((receita) => (
                  <tr key={receita.id} className="transition hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      {editandoId === receita.id ? (
                        <PremiumInput
                          value={form.descricao}
                          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                        />
                      ) : (
                        <div>
                          <div className="font-medium text-slate-900">{receita.descricao}</div>
                          <div className="text-sm text-slate-500">Receita mensal registrada</div>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status="receita" />
                    </td>
                    <td className="px-5 py-4">
                      {editandoId === receita.id ? (
                        <PremiumInput
                          type="date"
                          value={form.data}
                          onChange={(e) => setForm({ ...form, data: e.target.value })}
                        />
                      ) : (
                        <span className="text-sm text-slate-600">{receita.data}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {editandoId === receita.id ? (
                        <PremiumInput
                          type="number"
                          value={form.valor}
                          onChange={(e) => setForm({ ...form, valor: e.target.value })}
                        />
                      ) : (
                        <span className="text-base font-semibold text-emerald-700">
                          {money(receita.valor)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {editandoId === receita.id ? (
                          <>
                            <PremiumButton onClick={() => salvarEdicao(receita.id)}>
                              Salvar
                            </PremiumButton>
                            <PremiumButton variant="ghost" onClick={() => setEditandoId(null)}>
                              Cancelar
                            </PremiumButton>
                          </>
                        ) : (
                          <>
                            <PremiumButton variant="ghost" onClick={() => iniciarEdicao(receita)} className="gap-2 px-3">
                              <Pencil className="h-4 w-4" />
                            </PremiumButton>
                            <PremiumButton variant="danger" onClick={() => handleExcluir(receita.id)} className="gap-2 px-3">
                              <Trash2 className="h-4 w-4" />
                            </PremiumButton>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
