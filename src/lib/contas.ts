import { supabase } from "./supabase"

type ContaInsert = Record<string, unknown>

export async function criarConta(data: ContaInsert) {
  const { data: result, error } = await supabase
    .from("contas")
    .insert([data])

  return { result, error }
}
