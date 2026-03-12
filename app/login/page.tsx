"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [error, setError] = useState(
    searchParams.get("error") === "config" ? "APP_PASSWORD nao configurado no servidor." : ""
  )
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    const data = (await res.json()) as { error?: string }

    setLoading(false)

    if (!res.ok) {
      setError(data.error || "Falha ao autenticar")
      return
    }

    router.replace(searchParams.get("next") || "/")
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Acesso protegido</h1>
        <p className="mb-6 text-sm text-gray-600">
          Informe a senha geral do sistema para acessar o financeiro.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha do sistema"
          className="mb-3 w-full rounded border p-3"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void handleLogin()
            }
          }}
        />

        {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}

        <button
          type="button"
          onClick={() => void handleLogin()}
          disabled={loading}
          className="w-full rounded bg-black px-4 py-3 text-white disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-neutral-100" />}>
      <LoginContent />
    </Suspense>
  )
}
