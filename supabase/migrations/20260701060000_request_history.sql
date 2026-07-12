CREATE TABLE request_history (
  id          bigint primary key generated always as identity,
  user_id     bigint NOT NULL,
  method      text NOT NULL,
  url         text NOT NULL,
  req_headers jsonb,
  req_body    text,
  res_status  integer,
  res_headers jsonb,
  res_body    text,
  executed_at timestamptz NOT NULL default now()
);

ALTER TABLE request_history
ADD CONSTRAINT fk_request_history_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

CREATE INDEX ON request_history (user_id, executed_at DESC);

ALTER TABLE request_history ENABLE ROW LEVEL SECURITY;
