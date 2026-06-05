
ALTER TABLE public.mood_state
  ADD COLUMN IF NOT EXISTS note_updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS note_read_at timestamptz;

CREATE OR REPLACE FUNCTION public.is_paulo()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND username = 'paulo');
$$;

CREATE OR REPLACE FUNCTION public.mood_state_guard()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_mavi() THEN
    IF NEW.note IS DISTINCT FROM OLD.note THEN
      NEW.note_updated_at := now();
      NEW.note_read_at := NULL;
    END IF;
    RETURN NEW;
  ELSIF public.is_paulo() THEN
    -- Paulo can only toggle note_read_at
    NEW.selected_ids := OLD.selected_ids;
    NEW.note := OLD.note;
    NEW.note_updated_at := OLD.note_updated_at;
    RETURN NEW;
  ELSE
    RAISE EXCEPTION 'not allowed';
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS mood_state_guard_trigger ON public.mood_state;
CREATE TRIGGER mood_state_guard_trigger
  BEFORE UPDATE ON public.mood_state
  FOR EACH ROW EXECUTE FUNCTION public.mood_state_guard();

DROP POLICY IF EXISTS "only mavi can update mood" ON public.mood_state;
CREATE POLICY "mavi or paulo can update mood"
  ON public.mood_state FOR UPDATE TO authenticated
  USING (public.is_mavi() OR public.is_paulo())
  WITH CHECK (public.is_mavi() OR public.is_paulo());
