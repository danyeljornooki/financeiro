export type TipoConta = "receita" | "despesa"
export type StatusConta = "pendente" | "pago" | "atrasado"
export type RecorrenciaConta = "unica" | "mensal" | "anual"

export type HistoricoPagamento = {
  data: string
  status: StatusConta
  valor: number
  observacao: string
}

export type Conta = {
  id: string
  descricao: string
  categoria: string
  valor: number
  vencimento: string | null
  status: StatusConta
  tipo: TipoConta
  recorrencia: RecorrenciaConta
  grupo_recorrencia_id: string | null
  parcela_atual: number | null
  parcela_total: number | null
  grupo_parcelamento_id: string | null
  pago_em: string | null
  historico_pagamentos: HistoricoPagamento[] | null
  created_at?: string | null
}

export type ContaInput = Omit<Conta, "id" | "created_at">

export type ResumoContas = {
  total: number
  pendente: number
  pago: number
  atrasado: number
  quantidade: number
  receitas: number
  despesas: number
  saldoMensal: number
}

export type AlertaVencimento = {
  id: string
  descricao: string
  vencimento: string
  diasRestantes: number
  valor: number
  tipo: TipoConta
}

export type MetaFinanceiraResumo = {
  objetivo: number
  valorAtual: number
  aporteMensal: number
  restante: number
  progresso: number
  mesesEstimados: number | null
}

export type DividaResumo = {
  totalDividas: number
  totalAtrasado: number
  totalPendente: number
  quantidade: number
  itens: Conta[]
}

export type SimulacaoEconomia = {
  economiaMensal: number
  economiaAnual: number
  novoSaldoMensal: number
  mesesParaReserva: number | null
}

export type PlanejamentoAnualMes = {
  mes: string
  receitas: number
  despesas: number
  saldo: number
  quantidade: number
}

export type DashboardCategoria = {
  categoria: string
  valor: number
  percentual: number
}

export type DashboardMes = {
  mes: string
  receitas: number
  despesas: number
  saldo: number
}

export type TopGasto = {
  id: string
  descricao: string
  categoria: string
  valor: number
  vencimento: string | null
}

export type ProjecaoSaldo = {
  mes: string
  saldoProjetado: number
}

type ApiError = {
  error?: string
}

const RESUMO_ZERADO: ResumoContas = {
  total: 0,
  pendente: 0,
  pago: 0,
  atrasado: 0,
  quantidade: 0,
  receitas: 0,
  despesas: 0,
  saldoMensal: 0,
}

function normalizarConta(conta: Partial<Conta> & Record<string, unknown>): Conta {
  const id =
    typeof conta.id === "string" || typeof conta.id === "number"
      ? String(conta.id)
      : `${conta.descricao ?? "conta"}-${conta.created_at ?? Math.random().toString(16).slice(2)}`

  return {
    id,
    descricao: String(conta.descricao ?? ""),
    categoria: String(conta.categoria ?? ""),
    valor: Number(conta.valor ?? 0),
    vencimento:
      typeof conta.vencimento === "string" || conta.vencimento === null
        ? conta.vencimento
        : null,
    status:
      conta.status === "pago" || conta.status === "atrasado"
        ? conta.status
        : "pendente",
    tipo: conta.tipo === "receita" ? "receita" : "despesa",
    recorrencia:
      conta.recorrencia === "mensal" || conta.recorrencia === "anual"
        ? conta.recorrencia
        : "unica",
    grupo_recorrencia_id:
      typeof conta.grupo_recorrencia_id === "string" ? conta.grupo_recorrencia_id : null,
    parcela_atual:
      typeof conta.parcela_atual === "number" ? conta.parcela_atual : null,
    parcela_total:
      typeof conta.parcela_total === "number" ? conta.parcela_total : null,
    grupo_parcelamento_id:
      typeof conta.grupo_parcelamento_id === "string" ? conta.grupo_parcelamento_id : null,
    pago_em: typeof conta.pago_em === "string" ? conta.pago_em : null,
    historico_pagamentos: Array.isArray(conta.historico_pagamentos)
      ? (conta.historico_pagamentos as HistoricoPagamento[])
      : [],
    created_at: typeof conta.created_at === "string" ? conta.created_at : null,
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

function inicioDoMesAtual() {
  return new Date().toISOString().slice(0, 7)
}

function hojeISO() {
  return new Date().toISOString().slice(0, 10)
}

function inicioDoDia(dataIso: string) {
  return new Date(`${dataIso}T00:00:00`)
}

function adicionarMes(dataBase: string) {
  const data = inicioDoDia(dataBase)
  data.setMonth(data.getMonth() + 1)
  return data.toISOString().slice(0, 10)
}

function adicionarAno(dataBase: string) {
  const data = inicioDoDia(dataBase)
  data.setFullYear(data.getFullYear() + 1)
  return data.toISOString().slice(0, 10)
}

function diasAte(dataIso: string) {
  const hoje = inicioDoDia(hojeISO())
  const alvo = inicioDoDia(dataIso)
  const diff = alvo.getTime() - hoje.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function contaAtrasada(conta: Conta) {
  return Boolean(
    conta.vencimento &&
      conta.status !== "pago" &&
      inicioDoDia(conta.vencimento).getTime() < inicioDoDia(hojeISO()).getTime()
  )
}

function proximoVencimento(conta: Conta) {
  if (!conta.vencimento) return null
  if (conta.recorrencia === "mensal") return adicionarMes(conta.vencimento)
  if (conta.recorrencia === "anual") return adicionarAno(conta.vencimento)
  return null
}

export async function criarConta(data: ContaInput) {
  try {
    const res = await fetch("/api/contas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await parseJson<Conta[]>(res)
    return { result, error: null }
  } catch (error) {
    return { result: null, error }
  }
}

export async function listarContas(): Promise<Conta[]> {
  try {
    const res = await fetch("/api/contas", { cache: "no-store" })
    const data = await parseJson<Array<Partial<Conta> & Record<string, unknown>>>(res)
    return data.map((conta) => normalizarConta(conta))
  } catch {
    return []
  }
}

export async function editarConta(id: string, data: Partial<ContaInput>) {
  try {
    const res = await fetch(`/api/contas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await parseJson<Conta[]>(res)
    return { result, error: null }
  } catch (error) {
    return { result: null, error }
  }
}

export async function excluirConta(id: string) {
  try {
    const res = await fetch(`/api/contas/${id}`, {
      method: "DELETE",
    })

    const result = await parseJson<{ ok: boolean }>(res)
    return { result, error: null }
  } catch (error) {
    return { result: null, error }
  }
}

export async function marcarContaComoPaga(conta: Conta) {
  const historicoAtual = conta.historico_pagamentos ?? []
  const registro: HistoricoPagamento = {
    data: new Date().toISOString(),
    status: "pago",
    valor: conta.valor,
    observacao: "Pagamento registrado rapidamente",
  }

  return editarConta(conta.id, {
    status: "pago",
    pago_em: registro.data,
    historico_pagamentos: [...historicoAtual, registro],
  })
}

export async function duplicarConta(conta: Conta) {
  return criarConta({
    descricao: `${conta.descricao} (copia)`,
    categoria: conta.categoria,
    valor: conta.valor,
    vencimento: conta.vencimento,
    status: "pendente",
    tipo: conta.tipo,
    recorrencia: "unica",
    grupo_recorrencia_id: null,
    parcela_atual: null,
    parcela_total: null,
    grupo_parcelamento_id: null,
    pago_em: null,
    historico_pagamentos: [],
  })
}

export async function resumoContas(): Promise<ResumoContas> {
  const contas = await listarContas()
  const mesAtual = inicioDoMesAtual()

  return contas.reduce<ResumoContas>((acc, conta) => {
    const valor = Number(conta.valor ?? 0)

    acc.total += conta.tipo === "receita" ? valor : -valor
    acc.quantidade += 1

    if (conta.status === "pago") acc.pago += valor
    if (conta.status === "pendente") acc.pendente += valor
    if (conta.status === "atrasado") acc.atrasado += valor

    if (conta.tipo === "receita") {
      acc.receitas += valor
    } else {
      acc.despesas += valor
    }

    if (conta.vencimento?.slice(0, 7) === mesAtual) {
      acc.saldoMensal += conta.tipo === "receita" ? valor : -valor
    }

    return acc
  }, { ...RESUMO_ZERADO })
}

export async function atualizarStatusAtrasados(contasBase?: Conta[]) {
  const contas = contasBase ?? (await listarContas())
  const atrasadas = contas.filter((conta) => contaAtrasada(conta) && conta.status !== "atrasado")

  if (atrasadas.length === 0) {
    return { atualizadas: 0 }
  }

  await Promise.all(
    atrasadas.map((conta) =>
      editarConta(conta.id, {
        status: "atrasado",
      })
    )
  )

  return { atualizadas: atrasadas.length }
}

export async function criarContasRecorrentesAutomaticamente(contasBase?: Conta[]) {
  const contas = contasBase ?? (await listarContas())
  const recorrentes = contas.filter(
    (conta) => conta.recorrencia !== "unica" && conta.vencimento
  )

  let criadas = 0

  for (const conta of recorrentes) {
    const proximaData = proximoVencimento(conta)
    if (!proximaData) continue

    const jaExiste = contas.some((item) => {
      const mesmoGrupo =
        conta.grupo_recorrencia_id && item.grupo_recorrencia_id
          ? item.grupo_recorrencia_id === conta.grupo_recorrencia_id
          : item.descricao === conta.descricao &&
            item.categoria === conta.categoria &&
            item.valor === conta.valor &&
            item.tipo === conta.tipo &&
            item.recorrencia === conta.recorrencia

      return mesmoGrupo && item.vencimento === proximaData
    })

    const contaJaPassouDoVencimento =
      inicioDoDia(conta.vencimento as string).getTime() <= inicioDoDia(hojeISO()).getTime()

    if (!jaExiste && contaJaPassouDoVencimento) {
      const { error } = await criarConta({
        descricao: conta.descricao,
        categoria: conta.categoria,
        valor: conta.valor,
        vencimento: proximaData,
        status: "pendente",
        tipo: conta.tipo,
        recorrencia: conta.recorrencia,
        grupo_recorrencia_id: conta.grupo_recorrencia_id || conta.id,
        parcela_atual: null,
        parcela_total: null,
        grupo_parcelamento_id: null,
        pago_em: null,
        historico_pagamentos: [],
      })

      if (!error) {
        criadas += 1
      }
    }
  }

  return { criadas }
}

export async function listarAlertasVencimento(dias = 5): Promise<AlertaVencimento[]> {
  const contas = await listarContas()

  return contas
    .filter((conta) => conta.status !== "pago" && Boolean(conta.vencimento))
    .map((conta) => ({
      id: conta.id,
      descricao: conta.descricao,
      vencimento: conta.vencimento as string,
      diasRestantes: diasAte(conta.vencimento as string),
      valor: conta.valor,
      tipo: conta.tipo,
    }))
    .filter((conta) => conta.diasRestantes >= 0 && conta.diasRestantes <= dias)
    .sort((a, b) => a.diasRestantes - b.diasRestantes)
}

export async function sincronizarAutomacoes() {
  const contas = await listarContas()
  const recorrencia = await criarContasRecorrentesAutomaticamente(contas)
  const atrasados = await atualizarStatusAtrasados(contas)
  const alertas = await listarAlertasVencimento()

  return {
    criadasRecorrentes: recorrencia.criadas,
    contasAtrasadas: atrasados.atualizadas,
    alertas,
  }
}

export function calcularMetaFinanceira(
  objetivo: number,
  valorAtual: number,
  aporteMensal: number
): MetaFinanceiraResumo {
  const restante = Math.max(objetivo - valorAtual, 0)
  const progresso = objetivo > 0 ? Math.min((valorAtual / objetivo) * 100, 100) : 0
  const mesesEstimados =
    aporteMensal > 0 && restante > 0 ? Math.ceil(restante / aporteMensal) : restante === 0 ? 0 : null

  return {
    objetivo,
    valorAtual,
    aporteMensal,
    restante,
    progresso,
    mesesEstimados,
  }
}

export function calcularControleDividas(contas: Conta[]): DividaResumo {
  const itens = contas
    .filter((conta) => conta.tipo === "despesa" && conta.status !== "pago")
    .sort((a, b) => {
      const dataA = a.vencimento ?? "9999-12-31"
      const dataB = b.vencimento ?? "9999-12-31"
      return dataA.localeCompare(dataB)
    })

  return {
    totalDividas: itens.reduce((acc, conta) => acc + conta.valor, 0),
    totalAtrasado: itens
      .filter((conta) => conta.status === "atrasado")
      .reduce((acc, conta) => acc + conta.valor, 0),
    totalPendente: itens
      .filter((conta) => conta.status === "pendente")
      .reduce((acc, conta) => acc + conta.valor, 0),
    quantidade: itens.length,
    itens,
  }
}

export function simularEconomiaMensal(
  contas: Conta[],
  economiaMensal: number
): SimulacaoEconomia {
  const resumo = contas.reduce(
    (acc, conta) => {
      if (conta.tipo === "receita") acc.receitas += conta.valor
      if (conta.tipo === "despesa") acc.despesas += conta.valor
      return acc
    },
    { receitas: 0, despesas: 0 }
  )

  const novoSaldoMensal = resumo.receitas - resumo.despesas + economiaMensal
  const metaReserva = resumo.despesas * 6
  const mesesParaReserva =
    economiaMensal > 0 && metaReserva > 0 ? Math.ceil(metaReserva / economiaMensal) : null

  return {
    economiaMensal,
    economiaAnual: economiaMensal * 12,
    novoSaldoMensal,
    mesesParaReserva,
  }
}

export function gerarPlanejamentoFinanceiroAnual(
  contas: Conta[],
  ano = new Date().getFullYear()
): PlanejamentoAnualMes[] {
  const meses = Array.from({ length: 12 }, (_, index) => ({
    mes: `${ano}-${String(index + 1).padStart(2, "0")}`,
    receitas: 0,
    despesas: 0,
    saldo: 0,
    quantidade: 0,
  }))

  for (const conta of contas) {
    if (!conta.vencimento) continue

    const [anoConta, mesConta] = conta.vencimento.split("-")
    if (Number(anoConta) !== ano) continue

    const item = meses[Number(mesConta) - 1]
    if (!item) continue

    if (conta.tipo === "receita") {
      item.receitas += conta.valor
      item.saldo += conta.valor
    } else {
      item.despesas += conta.valor
      item.saldo -= conta.valor
    }

    item.quantidade += 1
  }

  return meses
}

export function gerarGraficoPorCategoria(contas: Conta[]): DashboardCategoria[] {
  const despesas = contas.filter((conta) => conta.tipo === "despesa")
  const total = despesas.reduce((acc, conta) => acc + conta.valor, 0)
  const agrupado = new Map<string, number>()

  for (const conta of despesas) {
    agrupado.set(conta.categoria, (agrupado.get(conta.categoria) ?? 0) + conta.valor)
  }

  return [...agrupado.entries()]
    .map(([categoria, valor]) => ({
      categoria,
      valor,
      percentual: total > 0 ? (valor / total) * 100 : 0,
    }))
    .sort((a, b) => b.valor - a.valor)
}

export function gerarGraficoPorMes(
  contas: Conta[],
  meses = 6
): DashboardMes[] {
  const hoje = new Date()
  const referencia = Array.from({ length: meses }, (_, index) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - (meses - index - 1), 1)
    const mes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`
    return { mes, receitas: 0, despesas: 0, saldo: 0 }
  })

  for (const conta of contas) {
    if (!conta.vencimento) continue

    const mesConta = conta.vencimento.slice(0, 7)
    const item = referencia.find((entry) => entry.mes === mesConta)
    if (!item) continue

    if (conta.tipo === "receita") {
      item.receitas += conta.valor
      item.saldo += conta.valor
    } else {
      item.despesas += conta.valor
      item.saldo -= conta.valor
    }
  }

  return referencia
}

export function listarTopGastos(contas: Conta[], limite = 5): TopGasto[] {
  return contas
    .filter((conta) => conta.tipo === "despesa")
    .sort((a, b) => b.valor - a.valor)
    .slice(0, limite)
    .map((conta) => ({
      id: conta.id,
      descricao: conta.descricao,
      categoria: conta.categoria,
      valor: conta.valor,
      vencimento: conta.vencimento,
    }))
}

export function calcularProjecaoSaldo(
  contas: Conta[],
  meses = 6
): ProjecaoSaldo[] {
  const historico = gerarGraficoPorMes(contas, meses)
  let acumulado = 0

  return historico.map((item) => {
    acumulado += item.saldo
    return {
      mes: item.mes,
      saldoProjetado: acumulado,
    }
  })
}
