-- Etapa 5: Agenda semanal (múltiples citas por ticket)

CREATE TYPE public.schedule_status AS ENUM (
  'scheduled',
  'completed',
  'cancelled'
);

CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets (id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES public.users (id) ON DELETE RESTRICT,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  status public.schedule_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.users (id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT schedules_end_after_start CHECK (scheduled_end > scheduled_start)
);

CREATE INDEX schedules_start_idx ON public.schedules (scheduled_start);
CREATE INDEX schedules_technician_idx ON public.schedules (technician_id);
CREATE INDEX schedules_ticket_idx ON public.schedules (ticket_id);

CREATE OR REPLACE FUNCTION public.set_schedules_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER schedules_updated_at
  BEFORE UPDATE ON public.schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.set_schedules_updated_at();

CREATE OR REPLACE FUNCTION public.can_manage_agenda()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT public.get_my_role() IN ('admin', 'receptionist', 'operations');
$$;

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Admin/recepción/operaciones ven toda la agenda; técnico solo sus citas
CREATE POLICY "schedules_select_by_role"
  ON public.schedules
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      public.can_manage_agenda()
      OR technician_id = auth.uid()
    )
  );

CREATE POLICY "schedules_insert_managers"
  ON public.schedules
  FOR INSERT
  WITH CHECK (public.can_manage_agenda());

CREATE POLICY "schedules_update_managers"
  ON public.schedules
  FOR UPDATE
  USING (public.can_manage_agenda());

CREATE POLICY "schedules_delete_managers"
  ON public.schedules
  FOR DELETE
  USING (public.can_manage_agenda());
