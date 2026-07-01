CREATE TABLE users (
  id bigint primary key generated always as identity,
  email text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz default now()
);