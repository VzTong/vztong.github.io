-- D1 Schema for Portfolio Visitor Access Logging
-- Table: portfolio_access_history

CREATE TABLE IF NOT EXISTS portfolio_access_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  asn_org TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  path TEXT,
  referrer TEXT,
  screen_resolution TEXT,
  language TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Optimize query performance for analytics and time-series queries
CREATE INDEX IF NOT EXISTS idx_access_created_at ON portfolio_access_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_country ON portfolio_access_history(country);
CREATE INDEX IF NOT EXISTS idx_access_path ON portfolio_access_history(path);
