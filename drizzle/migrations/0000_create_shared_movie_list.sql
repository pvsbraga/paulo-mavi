CREATE TABLE public.movie_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 200),
  added_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.movie_list TO authenticated;
GRANT ALL ON public.movie_list TO service_role;
ALTER TABLE public.movie_list ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mavi and Paulo can read movies" ON public.movie_list FOR SELECT TO authenticated USING (public.is_mavi() OR public.is_paulo());
CREATE POLICY "Mavi and Paulo can add movies" ON public.movie_list FOR INSERT TO authenticated WITH CHECK ((public.is_mavi() OR public.is_paulo()) AND added_by = auth.uid());
CREATE POLICY "Mavi and Paulo can remove movies" ON public.movie_list FOR DELETE TO authenticated USING (public.is_mavi() OR public.is_paulo());