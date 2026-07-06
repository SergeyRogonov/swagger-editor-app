CREATE TABLE access_tokens (
  id bigint primary key generated always as identity,
  id_user bigint NOT NULL,
  access_token text NOT NULL,
  ip_x_forwarded_for text NULL,
  ip_x_real_ip text NULL,
  ip_cf_connecting_ip text NULL,
  created_at timestamptz default now()
);

ALTER TABLE access_tokens
ADD CONSTRAINT fk_access_tokens_user
FOREIGN KEY (id_user)
REFERENCES users(id)
ON DELETE CASCADE;
