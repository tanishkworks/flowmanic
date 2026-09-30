-- Flowmanic schema. Applied by scripts/migrate.mjs inside a transaction.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ---------------------------------------------------------------------------
-- Automation systems (the five services)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS systems (
  id             SERIAL PRIMARY KEY,
  slug           TEXT        NOT NULL UNIQUE,          -- UNIQUE creates the lookup index
  position       SMALLINT    NOT NULL,
  name           TEXT        NOT NULL,
  short_name     TEXT        NOT NULL,
  display_top    TEXT        NOT NULL,
  display_bottom TEXT        NOT NULL,
  summary        TEXT        NOT NULL,
  setup_price    TEXT        NOT NULL,
  monthly_price  TEXT,
  badge          TEXT,
  accent         TEXT        NOT NULL,
  art_bg         TEXT        NOT NULL,
  flow           JSONB       NOT NULL DEFAULT '[]'::jsonb,
  outcomes       JSONB       NOT NULL DEFAULT '[]'::jsonb,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS systems_position_idx ON systems (position);

-- ---------------------------------------------------------------------------
-- Integrations (tools) + many-to-many link to systems
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS integrations (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  description TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS integrations_category_name_idx ON integrations (category, name);
CREATE INDEX IF NOT EXISTS integrations_name_idx          ON integrations (name);
-- Trigram indexes make  ILIKE '%term%'  searches index-backed instead of full scans
CREATE INDEX IF NOT EXISTS integrations_name_trgm_idx ON integrations USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS integrations_desc_trgm_idx ON integrations USING gin (description gin_trgm_ops);

CREATE TABLE IF NOT EXISTS system_integrations (
  system_id      INT      NOT NULL REFERENCES systems(id)      ON DELETE CASCADE,
  integration_id INT      NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
  step           SMALLINT NOT NULL,
  PRIMARY KEY (system_id, integration_id)          -- also serves lookups by system_id
);
-- Reverse lookup ("which systems use this integration?") used by the LATERAL join
CREATE INDEX IF NOT EXISTS system_integrations_integration_idx ON system_integrations (integration_id);

-- ---------------------------------------------------------------------------
-- Leads from the contact form
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  agency      TEXT NOT NULL,
  website     TEXT,
  team_size   TEXT NOT NULL,
  interest    TEXT NOT NULL,
  message     TEXT,
  source      TEXT,
  ip_hash     TEXT,
  user_agent  TEXT,
  status      TEXT NOT NULL DEFAULT 'new'
              CHECK (status IN ('new', 'contacted', 'booked', 'won', 'lost')),
  created_at  TIMESTAMPTZ(3) NOT NULL DEFAULT now()   -- ms precision keeps keyset cursors exact
);
-- Keyset pagination: ORDER BY created_at DESC, id DESC
CREATE INDEX IF NOT EXISTS leads_created_id_idx        ON leads (created_at DESC, id DESC);
-- Filtered admin view: WHERE status = ? ORDER BY created_at DESC, id DESC
CREATE INDEX IF NOT EXISTS leads_status_created_id_idx ON leads (status, created_at DESC, id DESC);
-- Duplicate / returning-lead lookups by email (case-insensitive)
CREATE INDEX IF NOT EXISTS leads_email_lower_idx       ON leads (lower(email));
