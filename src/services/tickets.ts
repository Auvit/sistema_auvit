import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Ticket,
  TicketHistoryEntry,
  TicketPriority,
  TicketStatus,
  TicketWithRelations,
} from '@/types/ticket'

export type TicketInput = {
  client_id: string
  assigned_to?: string | null
  priority: TicketPriority
  status: TicketStatus
  reported_issue: string
  possible_solution?: string | null
}

export async function listTickets(
  supabase: SupabaseClient
): Promise<TicketWithRelations[]> {
  const { data, error } = await supabase
    .from('tickets')
    .select(
      `
      *,
      client:clients ( id, name, phone ),
      assignee:users ( id, name, email )
    `
    )
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as TicketWithRelations[]
}

export async function getTicket(
  supabase: SupabaseClient,
  id: string
): Promise<TicketWithRelations | null> {
  const { data, error } = await supabase
    .from('tickets')
    .select(
      `
      *,
      client:clients ( id, name, phone, email, address ),
      assignee:users ( id, name, email )
    `
    )
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return data as TicketWithRelations
}

export async function createTicket(
  supabase: SupabaseClient,
  input: TicketInput
) {
  return supabase.from('tickets').insert(input).select().single()
}

export async function updateTicket(
  supabase: SupabaseClient,
  id: string,
  input: Partial<TicketInput>
) {
  return supabase.from('tickets').update(input).eq('id', id).select().single()
}

export async function deleteTicket(supabase: SupabaseClient, id: string) {
  return supabase.from('tickets').delete().eq('id', id)
}

export async function addTicketHistory(
  supabase: SupabaseClient,
  entry: {
    ticket_id: string
    notes?: string | null
    status?: TicketStatus | null
    created_by: string
  }
) {
  return supabase.from('ticket_history').insert(entry)
}

export async function getTicketHistory(
  supabase: SupabaseClient,
  ticketId: string
): Promise<TicketHistoryEntry[]> {
  const { data, error } = await supabase
    .from('ticket_history')
    .select(
      `
      *,
      author:users ( name, email )
    `
    )
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as TicketHistoryEntry[]
}

export async function listTechnicians(supabase: SupabaseClient) {
  const { data } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('role', 'technician')
    .order('name', { ascending: true })

  return data ?? []
}
