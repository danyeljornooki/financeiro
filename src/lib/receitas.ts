export type Receita = {
  id: string
  descricao: string
  valor: number
  data: string
  created_at?: string | null
}

export type ReceitaInput = Omit<Receita, "id" | "created_at">

type ApiError = {
  error?: string
}

function normalizarReceita(receita: Partial<Receita> & Record<string, unknown>): Receita {
  return {
    id:
      typeof receita.id === "string" || typeof receita.id === "number"
        ? String(receita.id)
        : `${receita.descricao ?? "receita"}-${receita.created_at ?? Math.random().toString(16).slice(2)}`,
    descricao: String(receita.descricao ?? ""),
    valor: Number(receita.valor ?? 0),
    data: typeof receita.data === "string" ? receita.data : "",
    created_at: typeof receita.created_at === "string" ? receita.created_at : null,
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const json = (await res.json()) as T | ApiError

  if (!res.ok) {
    const message =
      typeof json === "object" && json !== null && "error" in json
        ? json.error || "Erro na requisicao"
        : "Erro na requisicao"

    throw new Error(message)
  }

  return json as T
}

export async function listarReceitas(): Promise<Receita[]> {
  try {
    const res = await fetch("/api/receitas", { cache: "no-store" })
    const data = await parseJson<Array<Partial<Receita> & Record<string, unknown>>>(res)
    return data.map((receita) => normalizarReceita(receita))
  } catch {
    return []
  }
}

export async function criarReceita(data: ReceitaInput) {
  try {
    const res = await fetch("/api/receitas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await parseJson<Receita[]>(res)
    return { result, error: null }
  } catch (error) {
    return { result: null, error }
  }
}

export async function editarReceita(id: string, data: Partial<ReceitaInput>) {
  try {
    const res = await fetch(`/api/receitas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await parseJson<Receita[]>(res)
    return { result, error: null }
  } catch (error) {
    return { result: null, error }
  }
}

export async function excluirReceita(id: string) {
  try {
    const res = await fetch(`/api/receitas/${id}`, {
      method: "DELETE",
    })

    const result = await parseJson<{ ok: boolean }>(res)
    return { result, error: null }
  } catch (error) {
    return { result: null, error }
  }
}
