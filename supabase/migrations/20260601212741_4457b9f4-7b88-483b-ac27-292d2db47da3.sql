
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE CHECK (username IN ('mavi','paulo')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles readable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Helper: is current user Mavi
CREATE OR REPLACE FUNCTION public.is_mavi()
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND username = 'mavi');
$$;

-- Shared mood state (single row)
CREATE TABLE public.mood_state (
  id TEXT PRIMARY KEY DEFAULT 'current',
  selected_ids TEXT[] NOT NULL DEFAULT ARRAY['felizinha'],
  note TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.mood_state TO anon, authenticated;
GRANT INSERT, UPDATE ON public.mood_state TO authenticated;
GRANT ALL ON public.mood_state TO service_role;
ALTER TABLE public.mood_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mood readable by all" ON public.mood_state FOR SELECT USING (true);
CREATE POLICY "only mavi can insert mood" ON public.mood_state FOR INSERT TO authenticated WITH CHECK (public.is_mavi());
CREATE POLICY "only mavi can update mood" ON public.mood_state FOR UPDATE TO authenticated USING (public.is_mavi()) WITH CHECK (public.is_mavi());

INSERT INTO public.mood_state (id) VALUES ('current') ON CONFLICT DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.mood_state;
ALTER TABLE public.mood_state REPLICA IDENTITY FULL;
