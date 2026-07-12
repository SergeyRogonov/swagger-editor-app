CREATE TABLE user_schemas (
  user_id bigint PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  schema_content text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
