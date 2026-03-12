import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Financeiro Control Hub",
  description: "Painel financeiro premium com receitas, despesas, automacoes e seguranca.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
