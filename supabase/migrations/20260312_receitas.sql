create extension if not exists pgcrypto;

create table if not exists public.receitas (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  valor numeric not null,
  data date not null,
  created_at timestamptz not null default now()
);

alter table public.receitas enable row level security;

drop policy if exists "deny_anon_select_receitas" on public.receitas;
drop policy if exists "deny_anon_insert_receitas" on public.receitas;
drop policy if exists "deny_anon_update_receitas" on public.receitas;
drop policy if exists "deny_anon_delete_receitas" on public.receitas;

create policy "deny_anon_select_receitas"
on public.receitas
for select
to anon, authenticated
using (false);

create policy "deny_anon_insert_receitas"
on public.receitas
for insert
to anon, authenticated
with check (false);

create policy "deny_anon_update_receitas"
on public.receitas
for update
to anon, authenticated
using (false)
with check (false);

create policy "deny_anon_delete_receitas"
on public.receitas
for delete
to anon, authenticated
using (false);
