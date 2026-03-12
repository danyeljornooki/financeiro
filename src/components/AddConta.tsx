"use client"

import { criarConta } from "../lib/contas"

export default function AddConta() {
  async function handleAddConta() {
    await criarConta({
      descricao: "Aluguel",
      categoria: "Casa",
      valor: 500,
      vencimento: "2026-03-10",
      status: "pendente",
    })
  }

  return (
    <button type="button" onClick={handleAddConta}>
      Adicionar conta
    </button>
  )
}
