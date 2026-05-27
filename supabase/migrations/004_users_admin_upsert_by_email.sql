-- Etapa 4 (usuarios UI): helper para crear/actualizar perfiles por email
-- Requiere que el usuario ya exista en auth.users.

CREATE OR REPLACE FUNCTION public.admin_upsert_user_profile(
  target_email TEXT,
  target_name TEXT,
  target_role public.user_role,
  target_phone TEXT DEFAULT NULL
)
RETURNS public.users
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  auth_user auth.users%ROWTYPE;
  result_row public.users%ROWTYPE;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can manage user profiles';
  END IF;

  SELECT *
  INTO auth_user
  FROM auth.users
  WHERE lower(email) = lower(target_email)
  LIMIT 1;

  IF auth_user.id IS NULL THEN
    RAISE EXCEPTION 'Auth user not found for email %', target_email;
  END IF;

  INSERT INTO public.users (id, email, name, role, phone)
  VALUES (
    auth_user.id,
    auth_user.email,
    NULLIF(target_name, ''),
    target_role,
    NULLIF(target_phone, '')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone
  RETURNING * INTO result_row;

  RETURN result_row;
END;
$$;
