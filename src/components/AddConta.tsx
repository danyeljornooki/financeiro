"use client"

import { useState } from "react"
import { criarConta } from "../lib/contas"

type Props = {
  onSaved?: () => void
}

export default function AddConta({ onSaved }: Props) {
  const [descricao, setDescricao] = useState("")
  const [categoria, setCategoria] = useState("")
  const [valor, setValor] = useState("")
  const [vencimento, setVencimento] = useState("")

  async function salvarConta() {
    if (!descricao || !categoria || !valor) return

    const { error } = await criarConta({
      descricao,
      categoria,
      valor: Number(valor),
      vencimento: vencimento || null,
      status: "pendente",
    })

    if (error) return

    setDescricao("")
    setCategoria("")
    setValor("")
    setVencimento("")
    onSaved?.()
  }

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-xl font-bold">Adicionar Conta</h2>

      <input
        placeholder="Descricao"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="mb-2 w-full border p-2"
      />

      <input
        placeholder="Categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="mb-2 w-full border p-2"
      />

      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="mb-2 w-full border p-2"
      />

      <input
        type="date"
        value={vencimento}
        onChange={(e) => setVencimento(e.target.value)}
        className="mb-4 w-full border p-2"
      />

      <button
        type="button"
        onClick={salvarConta}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Salvar
      </button>
    </div>
  )
}
