create table sweep_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  usdc_address text not null,
  amount_usdc numeric(18, 6) not null,
  tx_hash text not null,
  swept_at timestamptz not null default now()
);

create index sweep_transactions_swept_at_idx on sweep_transactions (swept_at desc);
create index sweep_transactions_user_id_idx on sweep_transactions (user_id);
