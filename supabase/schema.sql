-- Supabase SQL Editor에서 한 번 실행
-- 모든 접근은 서버(API 라우트)의 secret key로만 한다. RLS를 켜고 정책을 두지 않아 브라우저(anon) 접근은 전부 차단된다.

create table if not exists guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 20),
  message text not null check (char_length(message) between 1 and 500),
  password_hash text not null,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists guestbook_entries_created_at_idx on guestbook_entries (created_at desc);

-- 작성 도배 / 4자리 비밀번호 무작위 대입 방지용 이벤트 로그
create table if not exists rate_limit_events (
  id bigint generated always as identity primary key,
  key text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_events_key_created_at_idx on rate_limit_events (key, created_at desc);

alter table guestbook_entries enable row level security;
alter table rate_limit_events enable row level security;
