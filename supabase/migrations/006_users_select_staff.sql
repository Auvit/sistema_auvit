-- Permite a admin/recepción/operaciones leer perfiles (agenda, asignación de técnicos)

CREATE POLICY "users_select_staff"
  ON public.users
  FOR SELECT
  USING (public.can_manage_agenda());
