alter table public.contas enable row level security;

drop policy if exists "deny_anon_select_contas" on public.contas;
drop policy if exists "deny_anon_insert_contas" on public.contas;
drop policy if exists "deny_anon_update_contas" on public.contas;
drop policy if exists "deny_anon_delete_contas" on public.contas;

create policy "deny_anon_select_contas"
on public.contas
for select
to anon, authenticated
using (false);

create policy "deny_anon_insert_contas"
on public.contas
for insert
to anon, authenticated
with check (false);

create policy "deny_anon_update_contas"
on public.contas
for update
to anon, authenticated
using (false)
with check (false);

create policy "deny_anon_delete_contas"
on public.contas
for delete
to anon, authenticated
using (false);
