-- Fix: RLS policies that query public.users inside public.users policies
-- cause infinite recursion and block ALL reads (including own profile).
-- Run this in Supabase SQL Editor after 001_users_and_roles.sql

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

DROP POLICY IF EXISTS "users_select_admin" ON public.users;
DROP POLICY IF EXISTS "users_insert_admin" ON public.users;
DROP POLICY IF EXISTS "users_update_admin" ON public.users;
DROP POLICY IF EXISTS "users_delete_admin" ON public.users;

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
