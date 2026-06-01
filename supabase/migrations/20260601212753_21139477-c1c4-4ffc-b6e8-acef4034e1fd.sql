
REVOKE EXECUTE ON FUNCTION public.is_mavi() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_mavi() TO authenticated;
