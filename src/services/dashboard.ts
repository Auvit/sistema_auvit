import type { SupabaseClient } from '@supabase/supabase-js'
import type { TicketStatus, TicketWithRelations } from '@/types/ticket'
import type { UserRole } from '@/types/user'
import { listTickets } from '@/services/tickets'

const ACTIVE_STATUSES: TicketStatus[] = [
  'open',
  'assigned',
  'in_progress',
  'resolved',
]

const PENDING_WORK_STATUSES: TicketStatus[] = [
  'open',
  'assigned',
  'in_progress',
]

export type DashboardMetrics = {
  openTickets: number
  criticalTickets: number
  activeTechnicians: number
  pendingServices: number
}

export type DashboardData = {
  metrics: DashboardMetrics
  recentTickets: TicketWithRelations[]
}

function isActiveTicket(status: TicketStatus) {
  return ACTIVE_STATUSES.includes(status)
}

export async function getDashboardData(
  supabase: SupabaseClient,
  role: UserRole,
  userId: string
): Promise<DashboardData> {
  const allTickets = await listTickets(supabase)

  const tickets =
    role === 'technician'
      ? allTickets.filter((t) => t.assigned_to === userId)
      : allTickets

  const activeTickets = tickets.filter((t) => isActiveTicket(t.status))

  const metrics: DashboardMetrics = {
    openTickets: activeTickets.length,
    criticalTickets: activeTickets.filter((t) => t.priority === 'critical')
      .length,
    activeTechnicians:
      role === 'technician'
        ? tickets.filter((t) =>
            PENDING_WORK_STATUSES.includes(t.status)
          ).length > 0
          ? 1
          : 0
        : new Set(
            allTickets
              .filter((t) => PENDING_WORK_STATUSES.includes(t.status))
              .map((t) => t.assigned_to)
              .filter(Boolean)
          ).size,
    pendingServices: tickets.filter((t) =>
      PENDING_WORK_STATUSES.includes(t.status)
    ).length,
  }

  const recentTickets = tickets.slice(0, 8)

  return { metrics, recentTickets }
}
