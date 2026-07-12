ALTER TABLE request_history
  ADD COLUMN IF NOT EXISTS duration_ms   integer,
  ADD COLUMN IF NOT EXISTS req_size      integer,
  ADD COLUMN IF NOT EXISTS res_size      integer,
  ADD COLUMN IF NOT EXISTS error_details text;
