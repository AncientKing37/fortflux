create table public.email_change_codes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  code text not null,
  current_email text not null,
  new_email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone not null,
  constraint email_change_codes_code_length check (length(code) = 6)
);

-- Add RLS policies
alter table public.email_change_codes enable row level security;

create policy "Users can only access their own codes"
  on public.email_change_codes for all
  using (auth.uid() = user_id); 