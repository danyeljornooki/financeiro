"use client"

import { useState } from "react"
import AddConta from "../src/components/AddConta"
import ContasTable from "../src/components/ContasTable"
import DashboardCards from "../src/components/DashboardCards"

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)

  function atualizarLista() {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Sistema Financeiro</h1>

      <DashboardCards refreshKey={refreshKey} />

      <AddConta onSaved={atualizarLista} />

      <ContasTable refreshKey={refreshKey} />
    </main>
  )
}
