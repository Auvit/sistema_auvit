export const TICKET_STATUSES = [
  'open',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
  'cancelled',
] as const

export type TicketStatus = (typeof TICKET_STATUSES)[number]

export const TICKET_PRIORITIES = [
  'low',
  'medium',
  'high',
  'critical',
] as const

export type TicketPriority = (typeof TICKET_PRIORITIES)[number]

export type Ticket = {
  id: string
  client_id: string
  assigned_to: string | null
  priority: TicketPriority
  status: TicketStatus
  reported_issue: string
  possible_solution: string | null
  created_at: string
  updated_at: string
}

export type TicketWithRelations = Ticket & {
  client: {
    id: string
    name: string
    phone: string | null
    email?: string | null
    address?: string | null
  }
  assignee: { id: string; name: string | null; email: string } | null
}

export type TicketHistoryEntry = {
  id: string
  ticket_id: string
  notes: string | null
  status: TicketStatus | null
  created_by: string
  created_at: string
  author?: { name: string | null; email: string }
}

export function isTicketStatus(value: string): value is TicketStatus {
  return (TICKET_STATUSES as readonly string[]).includes(value)
}

export function isTicketPriority(value: string): value is TicketPriority {
  return (TICKET_PRIORITIES as readonly string[]).includes(value)
}
