-- Auvit Etapa 2: users table, roles, RLS
-- Run in Supabase Dashboard → SQL Editor (runs with elevated privileges)

-- Extensible role enum: add values later with:
-- ALTER TYPE public.user_role ADD VALUE 'new_role';

CREATE TYPE public.user_role AS ENUM (
  'admin',
  'receptionist',
  'technician',
  'operations'
);

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT 'receptionist',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX users_role_idx ON public.users (role);
CREATE INDEX users_email_idx ON public.users (email);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Read own profile
CREATE POLICY "users_select_own"
  ON public.users
  FOR SELECT
  USING (auth.uid () = id);

-- is_admin() avoids RLS infinite recursion (see 002_fix_rls_recursion.sql)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE POLICY "users_select_admin"
  ON public.users
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "users_insert_admin"
  ON public.users
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "users_update_admin"
  ON public.users
  FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "users_delete_admin"
  ON public.users
  FOR DELETE
  USING (public.is_admin());

-- Bootstrap admin profile (user must already exist in Authentication)
INSERT INTO public.users (id, email, name, role)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data ->> 'name', 'Sistemas'),
  'admin'::public.user_role
FROM auth.users
WHERE email = 'sistemas@auvit.com'
ON CONFLICT (id) DO UPDATE
SET
  role = 'admin'::public.user_role,
  email = EXCLUDED.email,
  name = COALESCE(public.users.name, EXCLUDED.name);
