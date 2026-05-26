-- Etapa 3: clients, tickets, ticket_history

CREATE TYPE public.ticket_status AS ENUM (
  'open',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
  'cancelled'
);

CREATE TYPE public.ticket_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients (id) ON DELETE RESTRICT,
  assigned_to UUID REFERENCES public.users (id) ON DELETE SET NULL,
  priority public.ticket_priority NOT NULL DEFAULT 'medium',
  status public.ticket_status NOT NULL DEFAULT 'open',
  reported_issue TEXT NOT NULL,
  possible_solution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.ticket_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets (id) ON DELETE CASCADE,
  notes TEXT,
  status public.ticket_status,
  created_by UUID NOT NULL REFERENCES public.users (id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX tickets_client_id_idx ON public.tickets (client_id);
CREATE INDEX tickets_assigned_to_idx ON public.tickets (assigned_to);
CREATE INDEX tickets_status_idx ON public.tickets (status);
CREATE INDEX ticket_history_ticket_id_idx ON public.ticket_history (ticket_id);

CREATE OR REPLACE FUNCTION public.set_tickets_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.set_tickets_updated_at();

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.can_manage_clients()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT public.get_my_role() IN ('admin', 'receptionist', 'operations');
$$;

CREATE OR REPLACE FUNCTION public.can_manage_tickets()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT public.get_my_role() IN ('admin', 'receptionist', 'operations');
$$;

CREATE OR REPLACE FUNCTION public.is_technician()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT public.get_my_role() = 'technician';
$$;

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_history ENABLE ROW LEVEL SECURITY;

-- Clients: all authenticated users can read (tickets show client info)
CREATE POLICY "clients_select_authenticated"
  ON public.clients
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "clients_insert_managers"
  ON public.clients
  FOR INSERT
  WITH CHECK (public.can_manage_clients());

CREATE POLICY "clients_update_managers"
  ON public.clients
  FOR UPDATE
  USING (public.can_manage_clients());

CREATE POLICY "clients_delete_admin"
  ON public.clients
  FOR DELETE
  USING (public.is_admin());

-- Tickets
CREATE POLICY "tickets_select_authenticated"
  ON public.tickets
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "tickets_insert_managers"
  ON public.tickets
  FOR INSERT
  WITH CHECK (public.can_manage_tickets());

CREATE POLICY "tickets_update_managers"
  ON public.tickets
  FOR UPDATE
  USING (public.can_manage_tickets());

CREATE POLICY "tickets_update_technician"
  ON public.tickets
  FOR UPDATE
  USING (
    public.is_technician()
    AND (
      assigned_to = auth.uid()
      OR (assigned_to IS NULL AND status = 'open')
    )
  );

CREATE POLICY "tickets_delete_admin"
  ON public.tickets
  FOR DELETE
  USING (public.is_admin());

-- Ticket history
CREATE POLICY "ticket_history_select_authenticated"
  ON public.ticket_history
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "ticket_history_insert_managers"
  ON public.ticket_history
  FOR INSERT
  WITH CHECK (public.can_manage_tickets());

CREATE POLICY "ticket_history_insert_technician"
  ON public.ticket_history
  FOR INSERT
  WITH CHECK (
    public.is_technician()
    AND EXISTS (
      SELECT 1
      FROM public.tickets t
      WHERE t.id = ticket_id
        AND (
          t.assigned_to = auth.uid()
          OR (t.assigned_to IS NULL AND t.status = 'open')
        )
    )
  );
