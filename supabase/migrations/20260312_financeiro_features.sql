alter table public.contas
  add column if not exists tipo text not null default 'despesa',
  add column if not exists recorrencia text not null default 'unica',
  add column if not exists grupo_recorrencia_id uuid,
  add column if not exists parcela_atual integer,
  add column if not exists parcela_total integer,
  add column if not exists grupo_parcelamento_id uuid,
  add column if not exists pago_em timestamptz,
  add column if not exists historico_pagamentos jsonb not null default '[]'::jsonb;

alter table public.contas
  alter column status set default 'pendente';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'contas_tipo_check'
  ) then
    alter table public.contas
      add constraint contas_tipo_check
      check (tipo in ('receita', 'despesa'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'contas_recorrencia_check'
  ) then
    alter table public.contas
      add constraint contas_recorrencia_check
      check (recorrencia in ('unica', 'mensal', 'anual'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'contas_status_check'
  ) then
    alter table public.contas
      add constraint contas_status_check
      check (status in ('pendente', 'pago', 'atrasado'));
  end if;
end $$;
