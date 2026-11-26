-- ReZenOnance Nightly: Persistent 30-Day Community Cache & Real-Time Play Logs
-- Apply in Supabase SQL Editor or via Supabase CLI when Postgres is reachable.

CREATE TABLE IF NOT EXISTS public.community_tracks (
  canonical_key text PRIMARY KEY,
  track_id text NOT NULL,
  provider text NOT NULL DEFAULT 'racing',
  title text NOT NULL,
  artist text,
  album text,
  artwork_url text,
  duration integer,
  quality text NOT NULL DEFAULT 'LOSSLESS',
  stream_url text NOT NULL,
  stream_format text NOT NULL DEFAULT 'flac',
  hits integer NOT NULL DEFAULT 1,
  last_played_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_tracks_hits ON public.community_tracks (hits DESC, last_played_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_tracks_expires ON public.community_tracks (expires_at);
CREATE INDEX IF NOT EXISTS idx_community_tracks_track_id ON public.community_tracks (track_id);

CREATE TABLE IF NOT EXISTS public.community_searches (
  cache_key text PRIMARY KEY,
  tracks_json jsonb NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_searches_expires ON public.community_searches (expires_at);

CREATE TABLE IF NOT EXISTS public.community_play_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  canonical_key text NOT NULL,
  track_id text NOT NULL,
  provider text NOT NULL DEFAULT 'racing',
  route_prefix text NOT NULL DEFAULT '/',
  delivery_mode text NOT NULL DEFAULT 'json',
  title text NOT NULL,
  artist text,
  artwork_url text,
  quality text NOT NULL DEFAULT 'LOSSLESS',
  cache_hit boolean NOT NULL DEFAULT false,
  played_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_play_logs_played_at ON public.community_play_logs (played_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_play_logs_provider ON public.community_play_logs (provider, played_at DESC);

ALTER TABLE public.community_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_play_logs ENABLE ROW LEVEL SECURITY;

-- Public read-only access for telemetry display; server writes using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS securely server-side).
DROP POLICY IF EXISTS "Public read community_tracks" ON public.community_tracks;
CREATE POLICY "Public read community_tracks" ON public.community_tracks
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read community_searches" ON public.community_searches;
CREATE POLICY "Public read community_searches" ON public.community_searches
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read community_play_logs" ON public.community_play_logs;
CREATE POLICY "Public read community_play_logs" ON public.community_play_logs
  FOR SELECT TO anon, authenticated USING (true);
