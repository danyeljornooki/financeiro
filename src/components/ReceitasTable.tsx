"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { editarReceita, excluirReceita, listarReceitas, type Receita } from "../lib/receitas"
import { EmptyState, PremiumButton, PremiumInput, SectionTitle, StatusBadge, money } from "./ui"
import { Sheet } from "./Sheet"

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
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingReceita, setEditingReceita] = useState<Receita | null>(null)
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
    setEditingReceita(receita)
    setForm({
      descricao: receita.descricao,
      valor: String(receita.valor),
      data: receita.data,
    })
    setSheetOpen(true)
  }

  function fecharSheet() {
    setSheetOpen(false)
    setEditingReceita(null)
    setForm({ descricao: "", valor: "", data: "" })
  }

  async function salvarEdicao() {
    if (!editingReceita) return

    await editarReceita(editingReceita.id, {
      descricao: form.descricao,
      valor: Number(form.valor),
      data: form.data,
    })

    fecharSheet()
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
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-[#0f0f23]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-[#0f0f23]/80 backdrop-blur-sm">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400" style={{ minWidth: '240px', maxWidth: '320px' }}>Descrição</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400" style={{ width: '110px' }}>Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400" style={{ width: '140px' }}>Data</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400" style={{ width: '120px' }}>Valor</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right" style={{ width: '140px' }}>Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {receitasFiltradas.map((receita) => (
                  <tr key={receita.id} className="transition-colors duration-150 hover:bg-white/2" style={{ height: '64px' }}>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-white">{receita.descricao}</div>
                        <div className="text-xs text-gray-400">Receita mensal registrada</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status="receita" />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-300">{receita.data}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-emerald-400">
                        {money(receita.valor)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => iniciarEdicao(receita)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/70 border border-white/10 transition-all duration-150 hover:bg-white/10 hover:text-white hover:translate-y-[-1px]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleExcluir(receita.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/70 border border-white/10 transition-all duration-150 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 hover:translate-y-[-1px]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Sheet isOpen={sheetOpen} onClose={fecharSheet} title="Editar Receita">
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
            <label className="block text-sm font-medium text-white mb-2">Valor</label>
            <PremiumInput
              type="number"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
              placeholder="0,00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Data</label>
            <PremiumInput
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
            />
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
