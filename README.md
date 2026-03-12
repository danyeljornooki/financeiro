# Financeiro Control Hub

Painel financeiro em `Next.js` com foco em uso real: receitas, despesas, dashboard visual, automações, segurança por senha global e integração com `Supabase`.

O projeto já está estruturado como uma aplicação SaaS/fintech de uso privado, com frontend premium, APIs protegidas e banco acessado no servidor via `service_role`.

## Stack

- `Next.js 16` com App Router
- `React 19`
- `Tailwind CSS 4`
- `Supabase`
- `Recharts`
- `Framer Motion`
- `Lucide React`
- `TypeScript`

## O que o sistema faz

- Cadastro e edição de despesas
- Cadastro e edição de receitas mensais
- Dashboard com cards financeiros
- Gráficos por categoria, mês e tendência
- Top gastos e projeção de saldo
- Contas recorrentes e parcelamento
- Status automático de contas atrasadas
- Alertas de vencimento
- Histórico e ações rápidas nas tabelas
- Planejamento financeiro anual
- Simulação de economia mensal
- Metas financeiras e controle de dívidas
- Área de segurança com logs de acesso

## Segurança

O projeto foi estruturado para não depender de acesso direto do frontend ao banco:

- senha global antes de entrar no app
- `proxy` protegendo páginas e APIs
- rate limit de login: `5 tentativas por minuto`
- logs de acesso e tentativas
- `RLS` no Supabase
- `service_role` usada apenas no servidor
- APIs internas para `contas`, `receitas` e `security/logs`

## Variáveis de ambiente

Crie um arquivo `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
APP_PASSWORD=...
APP_AUTH_SECRET=...
```

Notas:

- `APP_PASSWORD` é a senha geral do sistema
- `APP_AUTH_SECRET` é usado para compor o token do cookie de autenticação
- `SUPABASE_SERVICE_ROLE_KEY` nunca deve ser exposta no cliente

## Rodando localmente

Instale as dependências:

```bash
npm install
```

Suba o ambiente de desenvolvimento:

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npx tsc --noEmit
```

## Estrutura principal

```text
app/
  api/
    auth/
    contas/
    receitas/
    security/
  login/
  layout.tsx
  page.tsx

src/
  components/
    AddConta.tsx
    AddReceita.tsx
    AlertasVencimento.tsx
    AppShell.tsx
    ContasTable.tsx
    DashboardCards.tsx
    DashboardInsights.tsx
    FinanceiroAvancado.tsx
    ReceitasTable.tsx
    SecurityPanel.tsx
    ui.tsx
  lib/
    api-auth.ts
    auth.ts
    contas.ts
    receitas.ts
    supabase-admin.ts
    supabase.ts

supabase/
  migrations/
```

## Banco e migrations

As migrations do projeto estão em:

- `supabase/migrations/20260312_financeiro_features.sql`
- `supabase/migrations/20260312_receitas.sql`
- `supabase/migrations/20260312_security_rls.sql`

Antes de usar tudo em produção, aplique essas migrations no Supabase.

## Fluxo da aplicação

1. O usuário acessa o app e passa pela autenticação por senha global.
2. O `proxy` valida o cookie antes de liberar páginas e rotas.
3. O frontend consome apenas as APIs internas do Next.
4. As APIs usam `supabaseAdmin` no servidor para operar em `contas` e `receitas`.
5. O dashboard consolida receitas, despesas, saldo e módulos analíticos.

## Observações

- Os logs e o rate limit atuais ficam em memória do servidor.
- Em ambiente serverless, isso funciona como proteção básica, não como auditoria persistente.
- O projeto já usa `proxy.ts`, que substitui `middleware.ts` no Next 16.

## Próximos passos possíveis

- persistir logs de segurança em tabela própria
- mover rate limit para Redis ou armazenamento externo
- adicionar exportação PDF/CSV
- adicionar múltiplos usuários com autenticação real

## Estado atual

O projeto está preparado para uso como painel financeiro privado, com backend protegido, UI moderna e base adequada para evolução em produção.
