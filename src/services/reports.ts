import type { SupabaseClient } from '@supabase/supabase-js'
import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type TicketPriority,
  type TicketStatus,
  type TicketWithRelations,
} from '@/types/ticket'
import type { UserRole } from '@/types/user'
import { PRIORITY_LABELS, STATUS_LABELS } from '@/lib/ticket-labels'
import { listTickets } from '@/services/tickets'

export type StatusCount = {
  status: TicketStatus
  label: string
  count: number
}

export type PriorityCount = {
  priority: TicketPriority
  label: string
  count: number
}

export type TechnicianReportRow = {
  technicianId: string | null
  name: string
  total: number
  pending: number
  resolved: number
  closed: number
}

export type ReportsSummary = {
  total: number
  active: number
  pendingWork: number
  resolved: number
  closed: number
  cancelled: number
  criticalActive: number
  unassigned: number
}

export type ReportsData = {
  summary: ReportsSummary
  byStatus: StatusCount[]
  byPriority: PriorityCount[]
  byTechnician: TechnicianReportRow[]
  recentClosed: TicketWithRelations[]
}

const PENDING_STATUSES: TicketStatus[] = ['open', 'assigned', 'in_progress']
const ACTIVE_STATUSES: TicketStatus[] = [
  'open',
  'assigned',
  'in_progress',
  'resolved',
]

export async function getReportsData(
  supabase: SupabaseClient,
  role: UserRole,
  userId: string
): Promise<ReportsData> {
  const allTickets = await listTickets(supabase)

  const tickets =
    role === 'technician'
      ? allTickets.filter((t) => t.assigned_to === userId)
      : allTickets

  const byStatus: StatusCount[] = TICKET_STATUSES.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: tickets.filter((t) => t.status === status).length,
  }))

  const byPriority: PriorityCount[] = TICKET_PRIORITIES.map((priority) => ({
    priority,
    label: PRIORITY_LABELS[priority],
    count: tickets.filter((t) => t.priority === priority).length,
  }))

  const techMap = new Map<string, TechnicianReportRow>()

  for (const ticket of tickets) {
    const key = ticket.assigned_to ?? '__unassigned__'
    const name =
      ticket.assignee?.name ??
      ticket.assignee?.email ??
      (ticket.assigned_to ? 'Técnico' : 'Sin asignar')

    if (!techMap.has(key)) {
      techMap.set(key, {
        technicianId: ticket.assigned_to,
        name,
        total: 0,
        pending: 0,
        resolved: 0,
        closed: 0,
      })
    }

    const row = techMap.get(key)!
    row.total += 1
    if (PENDING_STATUSES.includes(ticket.status)) row.pending += 1
    if (ticket.status === 'resolved') row.resolved += 1
    if (ticket.status === 'closed') row.closed += 1
  }

  const byTechnician = [...techMap.values()].sort((a, b) => b.total - a.total)

  const activeTickets = tickets.filter((t) => ACTIVE_STATUSES.includes(t.status))

  const summary: ReportsSummary = {
    total: tickets.length,
    active: activeTickets.length,
    pendingWork: tickets.filter((t) => PENDING_STATUSES.includes(t.status))
      .length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
    cancelled: tickets.filter((t) => t.status === 'cancelled').length,
    criticalActive: activeTickets.filter((t) => t.priority === 'critical')
      .length,
    unassigned: tickets.filter(
      (t) => !t.assigned_to && PENDING_STATUSES.includes(t.status)
    ).length,
  }

  const recentClosed = tickets
    .filter((t) => t.status === 'closed' || t.status === 'resolved')
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 10)

  return {
    summary,
    byStatus,
    byPriority,
    byTechnician,
    recentClosed,
  }
}
