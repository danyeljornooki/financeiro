import { supabase } from "./supabase"

export type Conta = {
  id: number
  descricao: string
  categoria: string
  valor: number
  vencimento: string | null
  status: string
  created_at?: string | null
}

export type ContaInput = Omit<Conta, "id" | "created_at">

export type ResumoContas = {
  total: number
  pendente: number
  pago: number
  atrasado: number
  quantidade: number
}

export async function criarConta(data: ContaInput) {
  const { data: result, error } = await supabase
    .from("contas")
    .insert([data])
    .select()

  if (error) console.error(error)

  return { result, error }
}

export async function listarContas(): Promise<Conta[]> {
  const { data, error } = await supabase
    .from("contas")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return (data ?? []) as Conta[]
}

export async function excluirConta(id: number) {
  const { error } = await supabase
    .from("contas")
    .delete()
    .eq("id", id)

  if (error) console.error(error)

  return { error }
}

export async function editarConta(id: number, data: Partial<ContaInput>) {
  const { data: result, error } = await supabase
    .from("contas")
    .update(data)
    .eq("id", id)
    .select()

  if (error) console.error(error)

  return { result, error }
}

export async function resumoContas(): Promise<ResumoContas> {
  const { data, error } = await supabase
    .from("contas")
    .select("valor,status")

  if (error) {
    console.error(error)
    return {
      total: 0,
      pendente: 0,
      pago: 0,
      atrasado: 0,
      quantidade: 0,
    }
  }

  return (data ?? []).reduce<ResumoContas>(
    (acc, item) => {
      const valor = Number(item.valor ?? 0)

      acc.total += valor
      acc.quantidade += 1

      if (item.status === "pago") acc.pago += valor
      if (item.status === "pendente") acc.pendente += valor
      if (item.status === "atrasado") acc.atrasado += valor

      return acc
    },
    {
      total: 0,
      pendente: 0,
      pago: 0,
      atrasado: 0,
      quantidade: 0,
    }
  )
}
