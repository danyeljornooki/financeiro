import type { Metadata } from "next"
import { JetBrains_Mono, Manrope } from "next/font/google"
import "./globals.css"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
})

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

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
      <body className={`${manrope.variable} ${mono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
